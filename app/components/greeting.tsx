"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type GeoInfo = {
  city: string | null;
  country: string | null;
  timezone: string | null;
  isp: string | null;
  weather: { tempC: number; condition: string } | null;
  sample: boolean;
};

type Signals = Record<string, string | number | null>;

// The witty third line — always a lowercase-first fragment so it reads
// naturally after either "Somewhere in {city}, " or on its own, capitalized.
function timeFragment(hour: number): { emoji: string; text: string } {
  if (hour < 5) return { emoji: "🌙", text: "it's either an early start or a very late one" };
  if (hour < 8) return { emoji: "☕️", text: "coffee is probably still brewing" };
  if (hour < 12) return { emoji: "🌤️", text: "the day is just getting going" };
  if (hour < 14) return { emoji: "🥪", text: "hopefully lunch happened" };
  if (hour < 18) return { emoji: "💻", text: "the afternoon's holding up" };
  if (hour < 22) return { emoji: "🌆", text: "the evening's just getting started" };
  return { emoji: "🌃", text: "the commits at this hour hit different" };
}

function sentenceCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ponytail: only the common zones get a recognizable short code — the
// long tail of ~400 IANA zones has no standardized abbreviation anyway.
// Falls back to Intl's own short name (e.g. "PDT") or a GMT offset.
const TZ_ABBREVIATIONS: Record<string, string> = {
  "America/New_York": "ET",
  "America/Chicago": "CT",
  "America/Denver": "MT",
  "America/Los_Angeles": "PT",
  "America/Anchorage": "AKT",
  "Pacific/Honolulu": "HST",
  "America/Sao_Paulo": "BRT",
  "America/Mexico_City": "CT",
  "Europe/London": "GMT",
  "Europe/Paris": "CET",
  "Europe/Berlin": "CET",
  "Europe/Madrid": "CET",
  "Europe/Rome": "CET",
  "Europe/Moscow": "MSK",
  "Africa/Cairo": "EET",
  "Africa/Johannesburg": "SAST",
  "Asia/Dubai": "GST",
  "Asia/Karachi": "PKT",
  "Asia/Kolkata": "IST",
  "Asia/Kathmandu": "NPT",
  "Asia/Katmandu": "NPT", // ICU/CLDR can resolve to this older alias spelling
  "Asia/Dhaka": "BDT",
  "Asia/Shanghai": "CST",
  "Asia/Hong_Kong": "HKT",
  "Asia/Singapore": "SGT",
  "Asia/Tokyo": "JST",
  "Asia/Seoul": "KST",
  "Australia/Sydney": "AET",
  "Australia/Perth": "AWT",
  "Pacific/Auckland": "NZT",
};

function timezoneAbbr(now: Date): string | undefined {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    TZ_ABBREVIATIONS[zone] ??
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value
  );
}

function collectSignals(): Signals {
  let gpu: string | null = null;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    gpu = ext ? (gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string) : null;
  } catch {
    gpu = null;
  }

  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    pixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
    cores: navigator.hardwareConcurrency ?? null,
    platform: navigator.platform || null,
    gpu,
  };
}

async function hashSignals(signals: Signals): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(signals));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 8);
}

export function Greeting() {
  const [now, setNow] = useState<Date | null>(null);
  const [geo, setGeo] = useState<GeoInfo | null>(null);
  const [fingerprint, setFingerprint] = useState<{ id: string; signals: Signals } | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 30_000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    fetch("/api/geo", { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<GeoInfo>) : null))
      .then((data) => {
        if (data?.city || data?.isp || data?.weather) setGeo(data);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));

    const signals = collectSignals();
    hashSignals(signals)
      .then((id) => setFingerprint({ id, signals }))
      .catch(() => {});

    return () => {
      clearInterval(tick);
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  if (!now) return null;

  const tzAbbr = timezoneAbbr(now);
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

  const header = geo?.city ? `👋 Hey, ${geo.city}!` : "👋 Hey there!";

  const statParts = [tzAbbr ? `${time} ${tzAbbr}` : time];
  if (geo?.weather) {
    statParts.push(`${geo.weather.tempC}°C`);
    statParts.push(sentenceCase(geo.weather.condition));
  }
  const statLine = statParts.join(" · ");

  const { emoji, text } = timeFragment(now.getHours());
  const line3 = geo?.city
    ? `Somewhere in ${geo.city}, ${text}. ${emoji}`
    : `${text.charAt(0).toUpperCase()}${text.slice(1)}. ${emoji}`;

  return (
    <div className="mt-4 text-xs text-zinc-600">
      <p className="text-zinc-400">{header}</p>
      <p className="mt-1 text-zinc-500">{statLine}</p>
      <p className="mt-1">{line3}</p>
      {geo?.sample && (
        <p className="mt-1 text-[10px] text-zinc-800">
          (local dev only — location and weather above are sample data; your real ones show
          once this is deployed)
        </p>
      )}
      {fingerprint && (
        <p className="mt-2 text-zinc-700">
          Device fingerprint: <span className="font-mono text-zinc-500">{fingerprint.id}</span>
          {" · "}
          {Object.keys(fingerprint.signals).length} signals collected{" "}
          <button
            onClick={() => setShowRaw(true)}
            className="underline duration-200 hover:text-zinc-400"
          >
            view raw data
          </button>
        </p>
      )}
      {showRaw && fingerprint && (
        <RawDataModal signals={fingerprint.signals} onClose={() => setShowRaw(false)} />
      )}
    </div>
  );
}

function RawDataModal({
  signals,
  onClose,
}: {
  signals: Signals;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(signals, null, 2);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-[90vw] max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-lg shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-zinc-400">raw data, this visit</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="text-[11px] text-zinc-500 duration-200 hover:text-zinc-300"
            >
              {copied ? "copied!" : "[copy]"}
            </button>
            <button onClick={onClose} className="text-zinc-600 duration-200 hover:text-zinc-300">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-all text-left text-[11px] text-zinc-300">
          {json}
        </pre>
        <p className="mt-3 border-t border-zinc-800 pt-3 text-xs text-zinc-500">
          Nothing here touched a server to get stored — it was computed in your browser or read
          off the connection itself. Any other site you visit could do the same and just not
          mention it.
        </p>
      </div>
    </div>,
    document.body,
  );
}

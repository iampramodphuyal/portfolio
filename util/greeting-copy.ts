// Pure, isomorphic copy helpers — no network/DOM access, safe to import
// from both the client greeting widget and the curl route handler, so the
// two surfaces share the exact same voice.

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

// Renders a 24h HH:MM clock for an explicit IANA zone (curl mode, which has
// no client browser clock to read) — pass null to fall back to the runtime's
// own zone.
export function localClock(now: Date, zone: string | null): { time: string; hour: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone ?? undefined,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { time: `${hh}:${mm}`, hour: Number.parseInt(hh, 10) };
}

export function timezoneAbbr(zone: string, now: Date): string | undefined {
  return (
    TZ_ABBREVIATIONS[zone] ??
    new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "short" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value
  );
}

export function sentenceCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// The witty third line — always a lowercase-first fragment so it reads
// naturally after either "Somewhere in {city}, " or on its own, capitalized.
export function timeFragment(hour: number): { emoji: string; text: string } {
  if (hour < 5) return { emoji: "🌙", text: "it's either an early start or a very late one" };
  if (hour < 8) return { emoji: "☕️", text: "coffee is probably still brewing" };
  if (hour < 12) return { emoji: "🌤️", text: "the day is just getting going" };
  if (hour < 14) return { emoji: "🥪", text: "hopefully lunch happened" };
  if (hour < 18) return { emoji: "💻", text: "the afternoon's holding up" };
  if (hour < 22) return { emoji: "🌆", text: "the evening's just getting started" };
  return { emoji: "🌃", text: "the commits at this hour hit different" };
}

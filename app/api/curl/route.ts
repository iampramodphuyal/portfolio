export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { execFileSync } from "child_process";
import path from "path";
import { resolveGeo } from "@/util/geo";
import { localClock, timezoneAbbr, sentenceCase, timeFragment } from "@/util/greeting-copy";

// Same dynamic content as the browser greeting widget (time, weather, the
// time-of-day witty remark) — composed as one line for info.sh to weave
// into the bio section, rather than a separate greeting block.
function visitorStat(geo: Awaited<ReturnType<typeof resolveGeo>>): string {
  const now = new Date();
  const { time, hour } = localClock(now, geo.timezone);
  const tzAbbr = geo.timezone ? timezoneAbbr(geo.timezone, now) : undefined;

  const statParts: string[] = [tzAbbr ? `${time} ${tzAbbr}` : time];
  if (geo.weather) {
    statParts.push(`${geo.weather.tempC}°C`);
    statParts.push(sentenceCase(geo.weather.condition));
  }

  const { emoji, text } = timeFragment(hour);
  return `${statParts.join(" · ")} — ${text}. ${emoji}`;
}

export async function GET(request: Request) {
  try {
    const geo = await resolveGeo(request.headers);
    const cwd = process.cwd();
    const output = execFileSync("bash", ["card.sh"], {
      cwd,
      env: {
        ...process.env,
        SCRIPT_DIR: path.join(cwd, "public/curl"),
        // Consumed by info.sh to personalize the bio section. Both are
        // plain env vars (not shell-interpolated), and info.sh only ever
        // references them inside quoted parameter expansions — never
        // eval'd — so neither can be used for command injection.
        VISITOR_LOCATION: geo.city ?? "",
        VISITOR_STAT: geo.timezone ? visitorStat(geo) : "",
        VISITOR_SAMPLE: geo.sample ? "1" : "",
      },
      encoding: "utf-8",
      timeout: 5000,
    });

    return new Response(output, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Bio section is per-visitor now (location, time, weather) — never
        // cache publicly, unlike the rest of the static card.
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    // ponytail: temporary — surfacing the real error to diagnose a
    // production-only 500 that doesn't reproduce locally. Revert once found.
    const details =
      error && typeof error === "object"
        ? {
            message: "message" in error ? String(error.message) : undefined,
            stdout: "stdout" in error ? String((error as any).stdout) : undefined,
            stderr: "stderr" in error ? String((error as any).stderr) : undefined,
            status: "status" in error ? (error as any).status : undefined,
          }
        : String(error);
    return new Response(`Error generating terminal output\n${JSON.stringify(details, null, 2)}\n`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

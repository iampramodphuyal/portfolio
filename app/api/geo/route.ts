import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type IpWhoIsResponse = {
  success?: boolean;
  connection?: { isp?: string | null };
};

type Weather = { tempC: number; condition: string };

async function lookupIsp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as IpWhoIsResponse;
    return data.success ? (data.connection?.isp ?? null) : null;
  } catch {
    return null;
  }
}

async function lookupWeather(city: string): Promise<Weather | null> {
  try {
    const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%t|%C&m`, {
      signal: AbortSignal.timeout(2500),
      headers: { "User-Agent": "curl" },
    });
    if (!res.ok) return null;
    const [tempRaw, condition] = (await res.text()).trim().split("|");
    const tempC = Number.parseInt(tempRaw?.replace(/[^-\d]/g, "") ?? "", 10);
    if (!Number.isFinite(tempC) || !condition) return null;
    return { tempC, condition };
  } catch {
    return null;
  }
}

// ponytail: Vercel only populates x-vercel-ip-* on an actual Vercel
// deployment, so local `next dev` has nothing to read. Fall back to a
// sample location in development only, so the full pipeline (isp/weather
// lookups included) is visible without deploying. Any real deployment
// (including Vercel preview builds, which run as production) ignores this.
const isDev = process.env.NODE_ENV === "development";

export async function GET(request: NextRequest) {
  const cityHeader = request.headers.get("x-vercel-ip-city");
  const usedSampleCity = !cityHeader && isDev;
  const city = cityHeader ? decodeURIComponent(cityHeader) : usedSampleCity ? "San Francisco" : null;
  const country = request.headers.get("x-vercel-ip-country") ?? (usedSampleCity ? "US" : null);

  const forwardedFor = request.headers.get("x-forwarded-for");
  const detectedIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  // ponytail: Next's local dev proxy reports the loopback address, which
  // isn't geolocatable — treat it as absent so the dev fallback below kicks in.
  const isLoopback = detectedIp === "::1" || detectedIp === "127.0.0.1";
  const usedSampleIp = (!detectedIp || isLoopback) && isDev;
  const ip = usedSampleIp ? "8.8.8.8" : isLoopback ? null : detectedIp;

  const [isp, weather] = await Promise.all([
    ip ? lookupIsp(ip) : Promise.resolve(null),
    city ? lookupWeather(city) : Promise.resolve(null),
  ]);

  return NextResponse.json(
    {
      city,
      country,
      timezone: request.headers.get("x-vercel-ip-timezone"),
      isp,
      weather,
      // Only true in local dev, when there was nothing real to read —
      // never set outside `next dev`, so it never reaches a real deployment.
      sample: usedSampleCity || usedSampleIp,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

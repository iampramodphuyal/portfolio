// Server-only: does real network I/O (ipwho.is, wttr.in). Never import this
// from a client component — the browser widget instead fetches /api/geo,
// which calls resolveGeo() here so the visitor's IP never leaves our server
// for the third-party ISP lookup.

export type GeoInfo = {
  city: string | null;
  country: string | null;
  timezone: string | null;
  isp: string | null;
  weather: { tempC: number; condition: string } | null;
  sample: boolean;
};

type IpWhoIsResponse = {
  success?: boolean;
  connection?: { isp?: string | null };
};

type Weather = { tempC: number; condition: string };

// Defense-in-depth for the curl route, which renders these values straight
// into a terminal: strips control/escape bytes (which could smuggle ANSI
// sequences) while leaving real Unicode city/ISP names untouched.
function stripControlChars(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\x00-\x1f\x7f]/g, "").trim();
}

async function lookupIsp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as IpWhoIsResponse;
    const isp = data.success ? (data.connection?.isp ?? null) : null;
    return isp ? stripControlChars(isp) : null;
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
    return { tempC, condition: stripControlChars(condition) };
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

// ponytail: derive the sample from *this* machine's own timezone (via Intl,
// no header involved) rather than a hardcoded city — a hardcoded "San
// Francisco" reads as a real (wrong) location to whoever's actually running
// `next dev`, since nothing marks it as a stand-in outside the disclosure
// text. Using the real local zone means dev testing shows your own time.
const devZone = isDev ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
const devCity = devZone
  ? (devZone.split("/").pop() ?? devZone).replace(/_/g, " ").replace("Katmandu", "Kathmandu")
  : null;

export async function resolveGeo(
  headers: Headers,
  options: { skipNetworkLookups?: boolean } = {},
): Promise<GeoInfo> {
  const cityHeader = headers.get("x-vercel-ip-city");
  const usedSampleCity = !cityHeader && isDev;
  const city = cityHeader ? stripControlChars(decodeURIComponent(cityHeader)) : devCity;
  const country = headers.get("x-vercel-ip-country") ?? null;
  const timezone = headers.get("x-vercel-ip-timezone") ?? devZone;

  const forwardedFor = headers.get("x-forwarded-for");
  const detectedIp = forwardedFor?.split(",")[0]?.trim() || headers.get("x-real-ip");
  // ponytail: Next's local dev proxy reports the loopback address, which
  // isn't geolocatable — treat it as absent so the dev fallback below kicks in.
  const isLoopback = detectedIp === "::1" || detectedIp === "127.0.0.1";
  const usedSampleIp = (!detectedIp || isLoopback) && isDev;
  const ip = usedSampleIp ? "8.8.8.8" : isLoopback ? null : detectedIp;

  const [isp, weather] = options.skipNetworkLookups
    ? [null, null]
    : await Promise.all([
        ip ? lookupIsp(ip) : Promise.resolve(null),
        city ? lookupWeather(city) : Promise.resolve(null),
      ]);

  return {
    city,
    country,
    timezone,
    isp,
    weather,
    // Only true in local dev, when there was nothing real to read — never
    // set outside `next dev`, so it never reaches a real deployment.
    sample: usedSampleCity || usedSampleIp,
  };
}

import { NextRequest, NextResponse } from "next/server";
import { CURL_REWRITES } from "@/util/curl-routes";
import { site } from "@/data/site";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!userAgent.includes("curl")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname in CURL_REWRITES) {
    return NextResponse.rewrite(
      new URL(CURL_REWRITES[pathname as keyof typeof CURL_REWRITES], request.url),
    );
  }
  if (pathname.startsWith("/blog/")) {
    return NextResponse.rewrite(new URL(`/api/curl${pathname}`, request.url));
  }

  // Unknown route in curl mode: plain-text 404 instead of an HTML dump.
  // Echo the path un-decoded (percent-encoding keeps control bytes out of
  // terminals) and strip anything non-printable anyway.
  const shown = pathname.replace(/[^\x20-\x7e]/g, "").slice(0, 120);
  const routes = Object.keys(CURL_REWRITES)
    .map((path) => `  curl ${site.url}${path === "/" ? "" : path}`)
    .join("\n");

  return new NextResponse(
    `zsh: command not found: ${shown}\n\nTry one of:\n${routes}\n`,
    {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export const config = {
  // Skip API routes, Next internals, the OG image (no dot in its path —
  // must be named), and anything file-like (covers robots.txt, sitemap.xml,
  // manifest.json, favicon.ico, /resume.pdf, fonts, images).
  matcher: ["/((?!api|_next|opengraph-image|.*\\..*).*)"],
};

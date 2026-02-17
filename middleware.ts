import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  if (userAgent.includes("curl")) {
    const { pathname } = request.nextUrl;

    // Route curl requests to their API counterparts
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/api/curl", request.url));
    }
    if (pathname === "/blog") {
      return NextResponse.rewrite(new URL("/api/curl/blog", request.url));
    }
    if (pathname.startsWith("/blog/")) {
      return NextResponse.rewrite(
        new URL(`/api/curl${pathname}`, request.url),
      );
    }
    if (pathname === "/projects") {
      return NextResponse.rewrite(
        new URL("/api/curl/projects", request.url),
      );
    }
    if (pathname === "/experience") {
      return NextResponse.rewrite(
        new URL("/api/curl/experience", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blog", "/blog/:slug*", "/projects", "/experience"],
};

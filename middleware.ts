import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  if (userAgent.includes("curl")) {
    return NextResponse.rewrite(new URL("/api/curl", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};

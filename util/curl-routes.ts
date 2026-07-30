// The dual-mode route table: middleware rewrites these paths for curl
// user-agents, and the curl banner only advertises pages listed here.
// Adding a browser page without a curl counterpart? Leave it out of this
// table and the banner stays hidden there.
export const CURL_REWRITES = {
  "/": "/api/curl",
  "/projects": "/api/curl/projects",
  "/experience": "/api/curl/experience",
  "/blog": "/api/curl/blog",
  "/contact": "/api/curl/contact",
} as const satisfies Record<string, `/api/curl${string}`>;

export const isCurlRoute = (pathname: string): boolean =>
  pathname in CURL_REWRITES || pathname.startsWith("/blog/");

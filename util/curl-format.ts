import { site } from "@/data/site";

// ANSI escapes shared by every /api/curl handler.
export const C_RESET = "\x1b[0m";
export const C_BOLD = "\x1b[1m";
export const C_DIM = "\x1b[90m";
export const C_UNDERLINE = "\x1b[4m";
export const C_YELLOW = "\x1b[33m";
export const C_CYAN = "\x1b[36m";
export const C_GREEN = "\x1b[32m";
export const C_MAGENTA = "\x1b[35m";

// Inner width of the banner box and horizontal rules.
export const WIDTH = 50;

export function banner(title: string): string {
  const centered = title
    .padStart(Math.floor((WIDTH + title.length) / 2))
    .padEnd(WIDTH);
  return (
    `${C_YELLOW}${C_BOLD}` +
    `╔${"═".repeat(WIDTH)}╗\n` +
    `║${centered}║\n` +
    `╚${"═".repeat(WIDTH)}╝${C_RESET}\n\n`
  );
}

export function footer(path = ""): string {
  return (
    `${C_DIM}${"─".repeat(WIDTH)}${C_RESET}\n` +
    `${C_DIM}  ← curl ${site.url}${path}${C_RESET}\n`
  );
}

export function textResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

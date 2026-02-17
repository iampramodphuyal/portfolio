export const runtime = "nodejs";

import { blogPosts } from "@/data/blog";

const C_RESET = "\x1b[0m";
const C_BOLD = "\x1b[1m";
const C_YELLOW = "\x1b[33m";
const C_CYAN = "\x1b[36m";
const C_GREEN = "\x1b[32m";
const C_DIM = "\x1b[90m";
const C_UNDERLINE = "\x1b[4m";

export async function GET() {
  const published = blogPosts.filter((p) => p.published);

  let output = "";

  output += `${C_YELLOW}${C_BOLD}`;
  output += `╔══════════════════════════════════════════════════╗\n`;
  output += `║                    BLOG                         ║\n`;
  output += `╚══════════════════════════════════════════════════╝${C_RESET}\n\n`;

  output += `${C_DIM}Thoughts on software engineering, tools, and systems.${C_RESET}\n\n`;

  if (published.length === 0) {
    output += `${C_DIM}  No posts yet. Check back soon.${C_RESET}\n`;
  } else {
    published.forEach((post, i) => {
      const date = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(post.date));
      const tags = post.tags?.join(", ") || "";

      output += `${C_GREEN}  [${i + 1}]${C_RESET} ${C_BOLD}${post.title}${C_RESET}\n`;
      output += `${C_DIM}      ${date}${tags ? ` • ${tags}` : ""}${C_RESET}\n`;
      output += `${C_CYAN}      ${post.description}${C_RESET}\n`;
      output += `${C_DIM}      curl ${C_UNDERLINE}pramodphuyal.com.np/blog/${post.slug}${C_RESET}\n\n`;
    });
  }

  output += `${C_DIM}─────────────────────────────────────────────────${C_RESET}\n`;
  output += `${C_DIM}  ← curl pramodphuyal.com.np${C_RESET}\n`;

  return new Response(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

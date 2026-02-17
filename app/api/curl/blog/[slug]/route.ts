export const runtime = "nodejs";

import { blogPosts } from "@/data/blog";

const C_RESET = "\x1b[0m";
const C_BOLD = "\x1b[1m";
const C_YELLOW = "\x1b[33m";
const C_CYAN = "\x1b[36m";
const C_DIM = "\x1b[90m";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const post = blogPosts.find(
    (p) => p.slug === params.slug && p.published,
  );

  if (!post) {
    return new Response("Post not found.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(post.date));
  const tags = post.tags?.join(", ") || "";

  let output = "";

  output += `${C_YELLOW}${C_BOLD}`;
  output += `══════════════════════════════════════════════════\n`;
  output += `  ${post.title}\n`;
  output += `══════════════════════════════════════════════════${C_RESET}\n\n`;
  output += `${C_DIM}  ${date}${tags ? ` • ${tags}` : ""}${C_RESET}\n`;
  output += `${C_CYAN}  ${post.description}${C_RESET}\n\n`;
  output += `${C_DIM}──────────────────────────────────────────────────${C_RESET}\n\n`;
  output += post.plainText;
  output += `\n\n${C_DIM}──────────────────────────────────────────────────${C_RESET}\n`;
  output += `${C_DIM}  ← curl pramodphuyal.com.np/blog${C_RESET}\n`;

  return new Response(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

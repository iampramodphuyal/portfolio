export const runtime = "nodejs";

import { blogPosts } from "@/data/blog";
import {
  textResponse,
  footer,
  WIDTH,
  C_RESET,
  C_BOLD,
  C_CYAN,
  C_DIM,
  C_YELLOW,
} from "@/util/curl-format";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const post = blogPosts.find(
    (p) => p.slug === params.slug && p.published,
  );

  if (!post) {
    return textResponse("Post not found.\n", 404);
  }

  const date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(post.date));
  const tags = post.tags?.join(", ") || "";

  let output = "";

  output += `${C_YELLOW}${C_BOLD}`;
  output += `${"═".repeat(WIDTH)}\n`;
  output += `  ${post.title}\n`;
  output += `${"═".repeat(WIDTH)}${C_RESET}\n\n`;
  output += `${C_DIM}  ${date}${tags ? ` • ${tags}` : ""}${C_RESET}\n`;
  output += `${C_CYAN}  ${post.description}${C_RESET}\n\n`;
  output += `${C_DIM}${"─".repeat(WIDTH)}${C_RESET}\n\n`;
  output += post.plainText;
  output += `\n\n${footer("/blog")}`;

  return textResponse(output);
}

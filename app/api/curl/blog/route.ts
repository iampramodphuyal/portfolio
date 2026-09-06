export const runtime = "nodejs";

import { blogPosts } from "@/data/blog";
import { site } from "@/data/site";
import {
  banner,
  footer,
  textResponse,
  C_RESET,
  C_BOLD,
  C_CYAN,
  C_GREEN,
  C_DIM,
  C_UNDERLINE,
} from "@/util/curl-format";

export async function GET() {
  const published = blogPosts.filter((p) => p.published);

  let output = banner("BLOG");

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
      output += `${C_DIM}      curl ${C_UNDERLINE}${site.url}/blog/${post.slug}${C_RESET}\n\n`;
    });
  }

  output += footer();

  return textResponse(output);
}

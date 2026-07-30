import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/experience", "/blog", "/contact"].map(
    (path) => ({ url: `${site.url}${path}` }),
  );

  const posts = blogPosts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }));

  return [...pages, ...posts];
}

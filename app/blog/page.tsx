import Link from "next/link";
import type { Metadata } from "next";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { blogPosts } from "@/data/blog";
import type { BlogPost } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, tools, and systems.",
};

export default function BlogPage() {
  const published = blogPosts.filter((p) => p.published);
  const featured = published[0];
  const rest = published.slice(1).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Blog
          </h2>
          <p className="mt-4 text-zinc-400">
            Thoughts on software engineering, tools, and systems.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        {featured && (
          <Card>
            <Link href={`/blog/${featured.slug}`}>
              <article className="relative w-full h-full p-4 md:p-8 pb-12 md:pb-20">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-100">
                    <time dateTime={new Date(featured.date).toISOString()}>
                      {Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                      }).format(new Date(featured.date))}
                    </time>
                  </div>
                  {featured.tags && featured.tags.length > 0 && (
                    <div className="flex gap-2">
                      {featured.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  {featured.description}
                </p>
                <div className="absolute bottom-4 md:bottom-8">
                  <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>
        )}

        {rest.length > 0 && (
          <>
            <div className="hidden w-full h-px md:block bg-zinc-800" />
            <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
              <div className="grid grid-cols-1 gap-4">
                {rest
                  .filter((_, i) => i % 3 === 0)
                  .map((post) => (
                    <Card key={post.slug}>
                      <BlogArticle post={post} />
                    </Card>
                  ))}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {rest
                  .filter((_, i) => i % 3 === 1)
                  .map((post) => (
                    <Card key={post.slug}>
                      <BlogArticle post={post} />
                    </Card>
                  ))}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {rest
                  .filter((_, i) => i % 3 === 2)
                  .map((post) => (
                    <Card key={post.slug}>
                      <BlogArticle post={post} />
                    </Card>
                  ))}
              </div>
            </div>
          </>
        )}

        {published.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">No posts yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="p-4 md:p-8">
        <div className="flex justify-between gap-2 items-center">
          <span className="text-xs duration-1000 text-zinc-200 group-hover:text-white drop-shadow-orange">
            <time dateTime={new Date(post.date).toISOString()}>
              {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                new Date(post.date),
              )}
            </time>
          </span>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
          {post.title}
        </h2>
        <p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
          {post.description}
        </p>
      </article>
    </Link>
  );
}

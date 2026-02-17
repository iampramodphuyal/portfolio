import { notFound } from "next/navigation";
import { Navigation } from "../../components/nav";
import { blogPosts } from "@/data/blog";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogPosts
    .filter((p) => p.published)
    .map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug && p.published);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug && p.published);
  if (!post) notFound();

  const Content = post.content;

  return (
    <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
      <Navigation />
      <div className="px-6 pt-20 mx-auto max-w-3xl lg:px-8 md:pt-24 lg:pt-32 pb-24">
        {/* Post header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <time
              dateTime={new Date(post.date).toISOString()}
              className="text-sm text-zinc-500"
            >
              {Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
                new Date(post.date),
              )}
            </time>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((tag) => (
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
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl font-display">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-400 leading-8">
            {post.description}
          </p>
          <div className="mt-8 w-full h-px bg-zinc-800" />
        </div>

        {/* Post content */}
        <div>
          <Content />
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <a
            href="/blog"
            className="text-sm text-zinc-500 hover:text-zinc-200 duration-200"
          >
            &larr; Back to Blog
          </a>
        </div>
      </div>
    </div>
  );
}

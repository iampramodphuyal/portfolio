import Link from "next/link";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-tl from-black via-zinc-600/20 to-black font-mono">
      <div className="flex flex-col gap-2 text-sm sm:text-base">
        <p className="text-zinc-400">
          <span className="text-green-400">$ </span>
          curl {site.url.replace("https://", "")}/…
        </p>
        <p className="text-zinc-200">
          zsh: <span className="text-red-400">command not found</span>: 404
        </p>
      </div>
      <Link
        href="/"
        className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
      >
        <span className="text-green-400">$ </span>cd ~
      </Link>
    </div>
  );
}

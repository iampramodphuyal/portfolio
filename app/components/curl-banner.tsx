"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Terminal, X } from "lucide-react";
import { site } from "@/data/site";
import { isCurlRoute } from "@/util/curl-routes";

export const CurlBanner: React.FC = () => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const command = `curl ${site.url}${pathname === "/" ? "" : pathname}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (dismissed || !isCurlRoute(pathname)) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 shadow-lg shadow-black/50">
        <Terminal className="w-4 h-4 text-green-400 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-400">
            This page is also available in your terminal
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 font-mono text-xs cursor-pointer group"
          >
            <span className="text-green-400">$</span>
            <span className="text-zinc-200 group-hover:text-white duration-200">
              {command}
            </span>
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 duration-200">
              {copied ? "copied!" : "[copy]"}
            </span>
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-600 hover:text-zinc-300 duration-200 ml-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

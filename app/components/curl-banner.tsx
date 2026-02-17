"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

const DOMAIN = "pramodphuyal.com.np";

export const CurlBanner: React.FC = () => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const command = `curl ${DOMAIN}${pathname === "/" ? "" : pathname}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center py-2 bg-zinc-950/80 backdrop-blur border-t border-zinc-800/50">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 duration-200 cursor-pointer"
      >
        <span className="text-zinc-600">$</span>
        <span>{command}</span>
        <span className="text-zinc-700 text-[10px]">
          {copied ? "copied!" : "click to copy"}
        </span>
      </button>
    </div>
  );
};

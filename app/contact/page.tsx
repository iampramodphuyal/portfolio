import { Github, Mail, Linkedin, FileText, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { socials, type SocialIcon } from "@/data/socials";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

const icons: Record<SocialIcon, LucideIcon> = {
  linkedin: Linkedin,
  mail: Mail,
  github: Github,
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 mx-auto">
        <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
          {socials.map((s) => {
            const Icon = icons[s.icon];
            return (
              <Card key={s.label}>
                <Link
                  href={s.href}
                  target="_blank"
                  className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
                >
                  <span
                    className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
                    <Icon size={20} />
                  </span>
                  <div className="z-10 flex flex-col items-center w-full">
                    <span className="text-sm lg:text-lg font-medium duration-150 xl:text-xl text-zinc-200 group-hover:text-white font-display text-center">
                      {s.handle}
                    </span>
                    <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                      {s.label}
                    </span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
        <Link
          href="/resume.pdf"
          target="_blank"
          className="flex items-center gap-2 mt-16 text-sm duration-500 text-zinc-500 hover:text-zinc-300"
        >
          <FileText className="w-4 h-4" />
          View my resume
        </Link>
      </div>
    </div>
  );
}

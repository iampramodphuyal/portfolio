// Single source of truth for site identity. Consumed by app pages, curl
// handlers, and scripts/generate-curl-config.ts — keep it dependency-free.
export const site = {
  name: "Pramod Phuyal",
  title: "Software Engineer",
  description:
    "Software engineer building reliable systems and terminal-inspired tools.",
  bio: [
    "Hi, I’m Pramod — dev focused on Python, TypeScript, and a little Bash.",
    "I enjoy building minimal, efficient, terminal-inspired tools.",
  ],
  url: "https://pramodphuyal.com.np",
  repo: "https://github.com/iampramodphuyal/portfolio",
  email: "pramod.phuyal@outlook.com",
} as const;

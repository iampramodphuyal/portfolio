export const runtime = "nodejs";

import { projects } from "@/data/projects";

const C_RESET = "\x1b[0m";
const C_BOLD = "\x1b[1m";
const C_YELLOW = "\x1b[33m";
const C_CYAN = "\x1b[36m";
const C_GREEN = "\x1b[32m";
const C_DIM = "\x1b[90m";
const C_UNDERLINE = "\x1b[4m";

export async function GET() {
  const published = projects.filter((p) => p.published);

  let output = "";

  output += `${C_YELLOW}${C_BOLD}`;
  output += `╔══════════════════════════════════════════════════╗\n`;
  output += `║                  PROJECTS                       ║\n`;
  output += `╚══════════════════════════════════════════════════╝${C_RESET}\n\n`;

  output += `${C_DIM}Some of the projects are from work and some are on my own time.${C_RESET}\n\n`;

  if (published.length === 0) {
    output += `${C_DIM}  No projects yet.${C_RESET}\n`;
  } else {
    published.forEach((project, i) => {
      const date = project.date
        ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
            new Date(project.date),
          )
        : "SOON";

      output += `${C_GREEN}  [${i + 1}]${C_RESET} ${C_BOLD}${project.title}${C_RESET}\n`;
      output += `${C_DIM}      ${date}${C_RESET}\n`;
      output += `${C_CYAN}      ${project.description}${C_RESET}\n`;
      if (project.url) {
        output += `      ${C_GREEN}${C_UNDERLINE}${project.url}${C_RESET}\n`;
      }
      if (project.repository && project.repository !== project.url) {
        output += `      ${C_DIM}repo: ${C_UNDERLINE}${project.repository}${C_RESET}\n`;
      }
      output += `\n`;
    });
  }

  output += `${C_DIM}─────────────────────────────────────────────────${C_RESET}\n`;
  output += `${C_DIM}  ← curl pramodphuyal.com.np${C_RESET}\n`;

  return new Response(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const runtime = "nodejs";

import { projects } from "@/data/projects";
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
  const published = projects.filter((p) => p.published);

  let output = banner("PROJECTS");

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
      if (project.proprietary) {
        output += `      ${C_DIM}(proprietary — no public repo)${C_RESET}\n`;
      }
      if (project.url) {
        output += `      ${C_GREEN}${C_UNDERLINE}${project.url}${C_RESET}\n`;
      }
      if (project.repository && project.repository !== project.url) {
        output += `      ${C_DIM}repo: ${C_UNDERLINE}${project.repository}${C_RESET}\n`;
      }
      output += `\n`;
    });
  }

  output += footer();

  return textResponse(output);
}

export const runtime = "nodejs";

import { experience } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import {
  banner,
  footer,
  textResponse,
  C_RESET,
  C_BOLD,
  C_CYAN,
  C_GREEN,
  C_DIM,
  C_YELLOW,
  C_MAGENTA,
} from "@/util/curl-format";

export async function GET() {
  let output = banner("EXPERIENCE");

  output += `${C_DIM}My professional journey and education.${C_RESET}\n\n`;

  // Work
  output += `${C_YELLOW}${C_BOLD}  ── Work ──${C_RESET}\n\n`;
  experience.forEach((exp) => {
    output += `  ${C_BOLD}${exp.company}${C_RESET} ${C_DIM}(${exp.startDate} - ${exp.endDate})${C_RESET}\n`;
    output += `  ${C_MAGENTA}${exp.role}${C_RESET}\n`;
    output += `  ${C_CYAN}${exp.description}${C_RESET}\n\n`;
  });

  // Certifications
  output += `${C_YELLOW}${C_BOLD}  ── Certifications ──${C_RESET}\n\n`;
  certifications.forEach((cert) => {
    output += `  ${C_BOLD}${cert.institution}${C_RESET} ${C_DIM}(${cert.startDate} - ${cert.endDate})${C_RESET}\n`;
    output += `  ${C_GREEN}${cert.program}${C_RESET}\n\n`;
  });

  // Education
  output += `${C_YELLOW}${C_BOLD}  ── Education ──${C_RESET}\n\n`;
  education.forEach((edu) => {
    output += `  ${C_BOLD}${edu.institution}${C_RESET} ${C_DIM}(${edu.startDate} - ${edu.endDate})${C_RESET}\n`;
    output += `  ${C_GREEN}${edu.program}${C_RESET}\n\n`;
  });

  output += footer();

  return textResponse(output);
}

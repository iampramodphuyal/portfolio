export const runtime = "nodejs";

import { experience } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";

const C_RESET = "\x1b[0m";
const C_BOLD = "\x1b[1m";
const C_YELLOW = "\x1b[33m";
const C_CYAN = "\x1b[36m";
const C_GREEN = "\x1b[32m";
const C_DIM = "\x1b[90m";
const C_MAGENTA = "\x1b[35m";

export async function GET() {
  let output = "";

  output += `${C_YELLOW}${C_BOLD}`;
  output += `╔══════════════════════════════════════════════════╗\n`;
  output += `║                 EXPERIENCE                      ║\n`;
  output += `╚══════════════════════════════════════════════════╝${C_RESET}\n\n`;

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

  output += `${C_DIM}─────────────────────────────────────────────────${C_RESET}\n`;
  output += `${C_DIM}  ← curl pramodphuyal.com.np${C_RESET}\n`;

  return new Response(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const runtime = "nodejs";

import { socials, type SocialIcon } from "@/data/socials";
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
  C_MAGENTA,
} from "@/util/curl-format";

const icons: Record<SocialIcon, string> = {
  linkedin: "🔗",
  mail: "✉️",
  github: "🐙",
};

export async function GET() {
  let output = banner("CONTACT");

  output += `${C_DIM}Let's connect! Reach out through any of these channels.${C_RESET}\n\n`;

  socials.forEach((s) => {
    output += `  ${icons[s.icon]}  ${C_MAGENTA}${C_BOLD}${s.label}${C_RESET}\n`;
    output += `      ${C_CYAN}${s.handle}${C_RESET}\n`;
    output += `      ${C_GREEN}${C_UNDERLINE}${s.href}${C_RESET}\n\n`;
  });

  output += footer();

  return textResponse(output);
}

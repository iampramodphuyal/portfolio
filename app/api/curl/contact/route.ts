export const runtime = "nodejs";

const C_RESET = "\x1b[0m";
const C_BOLD = "\x1b[1m";
const C_YELLOW = "\x1b[33m";
const C_CYAN = "\x1b[36m";
const C_GREEN = "\x1b[32m";
const C_DIM = "\x1b[90m";
const C_UNDERLINE = "\x1b[4m";
const C_MAGENTA = "\x1b[35m";

const socials = [
  {
    label: "LinkedIn",
    handle: "pramod-phuyal",
    url: "https://www.linkedin.com/in/pramod-phuyal/",
    icon: "🔗",
  },
  {
    label: "Email",
    handle: "pramod.phuyal@outlook.com",
    url: "mailto:pramod.phuyal@outlook.com",
    icon: "✉️",
  },
  {
    label: "Github",
    handle: "iampramodphuyal",
    url: "https://github.com/iampramodphuyal",
    icon: "🐙",
  },
];

export async function GET() {
  let output = "";

  output += `${C_YELLOW}${C_BOLD}`;
  output += `╔══════════════════════════════════════════════════╗\n`;
  output += `║                  CONTACT                        ║\n`;
  output += `╚══════════════════════════════════════════════════╝${C_RESET}\n\n`;

  output += `${C_DIM}Let's connect! Reach out through any of these channels.${C_RESET}\n\n`;

  socials.forEach((s) => {
    output += `  ${s.icon}  ${C_MAGENTA}${C_BOLD}${s.label}${C_RESET}\n`;
    output += `      ${C_CYAN}${s.handle}${C_RESET}\n`;
    output += `      ${C_GREEN}${C_UNDERLINE}${s.url}${C_RESET}\n\n`;
  });

  output += `${C_DIM}─────────────────────────────────────────────────${C_RESET}\n`;
  output += `${C_DIM}  ← curl https://pramodphuyal.com.np${C_RESET}\n`;

  return new Response(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

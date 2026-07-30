type ProjectBase = {
  title: string;
  description: string;
  date?: string;
  published: boolean;
};

// Proprietary work has no public links — that's a stated fact, not an
// inference from missing URLs (unreleased personal projects also lack links).
export type Project =
  | (ProjectBase & { proprietary?: false; url?: string; repository?: string })
  | (ProjectBase & { proprietary: true; url?: never; repository?: never });

export const projects: Project[] = [
  {
    title: "Portfolio",
    description:
      "My personal portfolio website built with Next.js, Tailwind CSS, and TypeScript. Showcases my projects, experience, and skills.",
    date: "2024-12-01",
    url: "https://pramodphuyal.com.np",
    repository: "https://github.com/iampramodphuyal/portfolio",
    published: true,
  },
  {
    title: "Dotfiles",
    description:
      "Cross-platform dotfiles supporting both Linux (Arch/Fedora with Hyprland) and macOS. Managed with GNU Stow, featuring Neovim (NvChad), Kitty, Ghostty, Starship, Tmux, and Catppuccin theme.",
    date: "2024-12-11",
    url: "https://github.com/iampramodphuyal/dotfiles",
    repository: "https://github.com/iampramodphuyal/dotfiles",
    published: true,
  },
  // TODO(pramod): review the two drafts below — check wording and scale
  // claims against reality, then flip published to true.
  {
    title: "Healthcare Provider Data Platform",
    description:
      "Distributed scraping platform extracting healthcare-provider directory data (NPIs, specialties, locations) across US insurance payer networks. Per-network crawler monorepo orchestrated on an Azure VM fleet with pm2, feeding an automated QA pipeline before every delivery. Built at Beena (AudioBee).",
    date: "2026-01-01",
    proprietary: true,
    published: false,
  },
  {
    title: "Data QA & Comparison Tooling",
    description:
      "Quality-assurance system for large-scale scraped datasets: run-over-run comparisons, field-level error scoring, sampling workflows, and automated verification of provider records against live directories. Surfaces regressions before they reach clients. Built at Beena (AudioBee).",
    date: "2026-03-01",
    proprietary: true,
    published: false,
  },
];

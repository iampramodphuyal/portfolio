export type Project = {
  title: string;
  description: string;
  date?: string;
  url?: string;
  repository?: string;
  published: boolean;
};

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
  {
    title: "Project Three",
    description: "Description of your third project goes here.",
    date: "2025-01-01",
    repository: "https://github.com/iampramodphuyal/",
    published: false,
  },
  {
    title: "Project Four",
    description: "Description of your fourth project goes here.",
    date: "2025-01-01",
    repository: "https://github.com/iampramodphuyal/",
    published: false,
  },
  {
    title: "Project Five",
    description: "Description of your fifth project goes here.",
    date: "2025-01-01",
    repository: "https://github.com/iampramodphuyal/",
    published: false,
  },
  {
    title: "Project Six",
    description: "Description of your sixth project goes here.",
    date: "2025-01-01",
    repository: "https://github.com/iampramodphuyal/",
    published: false,
  },
];

import { JSX } from "react";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  tags?: string[];
  /** Browser-rendered JSX content */
  content: () => JSX.Element;
  /** Plain text content for curl/terminal output */
  plainText: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "dotfiles-cross-platform-setup",
    title: "Setting Up Cross-Platform Dotfiles with GNU Stow",
    description:
      "How I unified my Linux (Hyprland) and macOS development environments into a single dotfiles repository managed with GNU Stow.",
    date: "2024-12-11",
    published: true,
    tags: ["linux", "macos", "dotfiles", "terminal"],
    plainText: `Setting Up Cross-Platform Dotfiles with GNU Stow
==================================================

Managing configuration files across multiple machines and operating
systems used to be a constant source of frustration. After years of
manually syncing configs, I finally built a unified dotfiles
repository that handles both Linux and macOS seamlessly using GNU Stow.

## The Problem

I run Hyprland on Arch Linux at my workstation and macOS on my laptop.
The tools overlap significantly - Neovim, Kitty, Zsh, Tmux - but the
platform-specific details (Homebrew paths, clipboard commands, window
manager configs) differ enough to cause headaches.

## The Solution: Layered Directories

The repository is split into three layers:

  - common/  -- everything that works on both platforms
  - linux/   -- Hyprland, Waybar, Rofi, Swaync
  - macos/   -- Brewfile and system preferences script

## Installation

GNU Stow symlinks each directory into your home folder:

  $ git clone https://github.com/iampramodphuyal/dotfiles ~/dotfiles
  $ cd ~/dotfiles && ./install.sh

The installer detects your platform, stows the appropriate directories,
sets up Oh My Zsh, and installs packages. A single script handles both
operating systems without any manual branching.

Source: https://github.com/iampramodphuyal/dotfiles`,
    content: () => (
      <div className="space-y-6">
        <p className="text-zinc-400 leading-8">
          Managing configuration files across multiple machines and operating
          systems used to be a constant source of frustration. After years of
          manually syncing configs, I finally built a unified dotfiles repository
          that handles both Linux and macOS seamlessly using{" "}
          <a
            href="https://www.gnu.org/software/stow/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 underline underline-offset-4 hover:text-white duration-200"
          >
            GNU Stow
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-zinc-100 font-display pt-4">
          The Problem
        </h2>
        <p className="text-zinc-400 leading-8">
          I run Hyprland on Arch Linux at my workstation and macOS on my laptop.
          The tools overlap significantly — Neovim, Kitty, Zsh, Tmux — but the
          platform-specific details (Homebrew paths, clipboard commands, window
          manager configs) differ enough to cause headaches.
        </p>

        <h2 className="text-2xl font-bold text-zinc-100 font-display pt-4">
          The Solution: Layered Directories
        </h2>
        <p className="text-zinc-400 leading-8">
          The repository is split into three layers:
        </p>
        <ul className="space-y-2 text-zinc-400">
          <li className="flex gap-2">
            <span className="text-zinc-500 mt-1">—</span>
            <span>
              <span className="text-zinc-200 font-medium">common/</span> —
              everything that works on both platforms (Neovim, Tmux, Zsh,
              Starship)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-500 mt-1">—</span>
            <span>
              <span className="text-zinc-200 font-medium">linux/</span> —
              Hyprland, Waybar, Rofi, Swaync
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-500 mt-1">—</span>
            <span>
              <span className="text-zinc-200 font-medium">macos/</span> —
              Brewfile and system preferences script
            </span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-zinc-100 font-display pt-4">
          Installation
        </h2>
        <p className="text-zinc-400 leading-8">
          GNU Stow symlinks each directory into your home folder. The entire
          setup comes down to:
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
          <p className="text-zinc-500 mb-1"># Clone and install everything</p>
          <p>
            git clone https://github.com/iampramodphuyal/dotfiles ~/dotfiles
          </p>
          <p>cd ~/dotfiles && ./install.sh</p>
        </div>

        <p className="text-zinc-400 leading-8">
          The installer detects your platform, stows the appropriate directories,
          sets up Oh My Zsh, and installs packages. A single script handles both
          operating systems without any manual branching on your part.
        </p>
      </div>
    ),
  },
];

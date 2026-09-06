import { site } from "./site";

export type SocialIcon = "linkedin" | "mail" | "github";

export type Social = {
  label: string;
  handle: string;
  href: string;
  icon: SocialIcon;
};

export const socials: Social[] = [
  {
    label: "LinkedIn",
    handle: "pramod-phuyal",
    href: "https://www.linkedin.com/in/pramod-phuyal/",
    icon: "linkedin",
  },
  {
    label: "Email",
    handle: site.email,
    href: `mailto:${site.email}`,
    icon: "mail",
  },
  {
    label: "GitHub",
    handle: "iampramodphuyal",
    href: "https://github.com/iampramodphuyal",
    icon: "github",
  },
];

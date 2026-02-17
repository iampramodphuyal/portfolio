export type Certification = {
  institution: string;
  program: string;
  startDate: string;
  endDate: string;
  logo: string;
};

export const certifications: Certification[] = [
  {
    institution: "Anthropic",
    program: "Claude Code in Action",
    startDate: "Jan 2026",
    endDate: "Jan 2026",
    logo: "/images/anthropic.svg",
  },
  {
    institution: "Udemy",
    program: "Data Engineering Essentials using SQL, Python, and PySpark",
    startDate: "Dec 2022",
    endDate: "Dec 2022",
    logo: "/images/udemy.svg",
  },
  {
    institution: "Codetantra",
    program: "Python Programming",
    startDate: "Jan 2019",
    endDate: "Mar 2019",
    logo: "/images/codetantra.png",
  },
];

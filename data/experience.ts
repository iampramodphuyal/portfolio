export type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  logo: string;
};

// TODO(pramod): add concrete numbers where they exist (networks covered,
// records processed, clients served, SLA/uptime) — outcomes beat duties.
export const experience: Experience[] = [
  {
    company: "Beena",
    role: "Software Engineer",
    startDate: "Dec 2025",
    endDate: "Present",
    description:
      "Building an AI-first automation platform and a distributed healthcare-data extraction system — per-network crawlers running across an Azure VM fleet, with an automated QA pipeline that scores every dataset before it ships.",
    logo: "/images/beena.png",
  },
  {
    company: "Grepsr",
    role: "Service Delivery Engineer",
    startDate: "May 2022",
    endDate: "Dec 2025",
    description:
      "Owned end-to-end delivery of web data pipelines for enterprise clients over 3.5 years — scoping, extraction, quality assurance, and reliable delivery against agreed schedules.",
    logo: "/images/grepsr.png",
  },
  {
    company: "Xelwel",
    role: "Backend Developer",
    startDate: "Nov 2021",
    endDate: "May 2022",
    description:
      "Built and maintained backend services and APIs powering production web applications.",
    logo: "/images/xelwel.png",
  },
];

export type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  logo: string;
};

export const experience: Experience[] = [
  {
    company: "Grepsr",
    role: "Service Delivery Engineer",
    startDate: "May 2022",
    endDate: "Present",
    description:
      "Working as a Service Delivery Engineer, ensuring reliable data delivery pipelines and maintaining service quality for clients.",
    logo: "/images/grepsr.png",
  },
  {
    company: "Xelwel",
    role: "Backend Developer",
    startDate: "Nov 2021",
    endDate: "May 2022",
    description:
      "Developed and maintained backend services, APIs, and server-side logic to support web applications.",
    logo: "/images/xelwel.png",
  },
];

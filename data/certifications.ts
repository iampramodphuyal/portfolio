export type Certification = {
  institution: string;
  program: string;
  startDate: string;
  endDate: string;
  logo: string;
};

export const certifications: Certification[] = [
  {
    institution: "Codetantra",
    program: "Python Programming",
    startDate: "Jan 2019",
    endDate: "Mar 2019",
    logo: "/images/codetantra.png",
  },
];

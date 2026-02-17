export type Education = {
  institution: string;
  program: string;
  startDate: string;
  endDate: string;
  logo: string;
};

export const education: Education[] = [
  {
    institution: "ACME Engineering College",
    program: "Computer Engineering",
    startDate: "Dec 2016",
    endDate: "Dec 2020",
    logo: "/images/acme.png",
  },
  {
    institution: "Codetantra",
    program: "Python Programming",
    startDate: "Jan 2019",
    endDate: "Mar 2019",
    logo: "/images/codetantra.png",
  },
  {
    institution: "Prerana",
    program: "+2 Science",
    startDate: "Jul 2013",
    endDate: "Sep 2015",
    logo: "/images/prerana.jpg",
  },
];

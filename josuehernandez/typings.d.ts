declare type Experience = {
  title: string;
  company: string;
  companyURL: string;
  companyLogo: string;
  location: string;
  type: string;
  date: string;
  description: string;
  skills: string[];
};

declare type Education = {
    school: string;
    schoolURL: string;
    schoolLogo: string;
    schoolLocation: string;
    degree: string;
    major: string;
    minor: string;
    date: string;
    description: string;
    activitiesandsocieties: string[];
  };

  declare type Project = {
    title: string;
    description: string;
    link: {
      href: string;
      label: string;
    };
    logo: {
      src: string;
      alt: string;
    };
  };

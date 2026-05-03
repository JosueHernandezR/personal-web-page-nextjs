export interface ProjectPostCategory {
  title: string;
  href: string;
}

export interface ProjectPostAuthor {
  name: string;
  role: string;
  href: string;
  imageUrl: string;
}

export interface ProjectPost {
  id: number;
  title: string;
  href: string;
  description: string;
  imageUrl: string;
  date: string;
  datetime: string;
  category: ProjectPostCategory;
  author: ProjectPostAuthor;
}

export interface Experience {
  title: string;
  company: string;
  companyURL: string;
  companyLogo: string;
  location: string;
  type: string;
  date: string;
  description: string;
  skills: string[];
} 
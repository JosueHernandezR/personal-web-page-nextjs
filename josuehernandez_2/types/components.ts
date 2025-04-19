import { SVGProps } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationLink {
  href: string;
  label: string;
}

export interface CardProps extends BaseComponentProps {
  title: string;
  description?: string;
  href?: string;
  icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
}

export interface ExperienceCardProps extends CardProps {
  company: string;
  role: string;
  period: string;
  technologies: string[];
}

export interface EducationCardProps extends CardProps {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface AvatarProps extends BaseComponentProps {
  large?: boolean;
  src?: string;
  alt?: string;
}

export interface ContainerProps extends BaseComponentProps {
  [key: string]: any;
}

export interface SocialLinkProps extends SVGProps<SVGSVGElement> {
  href: string;
  label: string;
} 
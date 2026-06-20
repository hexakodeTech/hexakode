
export interface NavLink {
  label: string;
  href: string;
}

export interface Technology {
  name: string;
  category: string;
  iconName: string; // The Lucide Icon component name or static visual identifier
}

export interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
  highlighted: boolean;
  href: string;
  iconName: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  tags: string[];
  href: string;
}

export interface ProcessStep {
  stepNumber: string; // e.g., "01"
  title: string;
  description: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

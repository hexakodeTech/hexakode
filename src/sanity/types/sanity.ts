export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SanitySEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  openGraphImage?: SanityImage;
  canonicalUrl?: string;
}

export interface SanitySiteSettings {
  _id: string;
  _type: "siteSettings";
  companyName: string;
  tagline?: string;
  logo?: SanityImage;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  footerText?: string;
  seo?: SanitySEO;
}

export interface SanityHomePage {
  _id: string;
  _type: "homePage";
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroButtons?: {
    label: string;
    url: string;
    style: "primary" | "secondary";
  }[];
  technologies?: {
    name: string;
    category?: string;
    iconName?: string;
  }[];
  featuredServices?: SanityService[];
  featuredProjects?: SanityPortfolio[];
  ctaSection?: {
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonLabel?: string;
    ctaButtonUrl?: string;
  };
  seo?: SanitySEO;
}

export interface SanityService {
  _id: string;
  _type: "service";
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: unknown; // Portable Text block structure
  icon?: string;
  features?: string[];
  technologies?: string[];
  displayOrder?: number;
  status: "draft" | "published";
  seo?: SanitySEO;
}

export interface SanityPortfolio {
  _id: string;
  _type: "portfolio";
  projectName: string;
  slug: string;
  category: "Web" | "Mobile" | "UI/UX" | "Software" | string;
  client?: string;
  duration?: string;
  shortDescription: string;
  fullDescription?: unknown; // Portable Text block structure
  challenge?: string;
  solution?: string;
  technologies?: string[];
  results?: string[];
  featuredImage: SanityImage;
  galleryImages?: SanityImage[];
  status: "draft" | "published";
  featured: boolean;
  seo?: SanitySEO;
}

export interface SanityTestimonial {
  _id: string;
  _type: "testimonial";
  clientName: string;
  company: string;
  position?: string;
  photo?: SanityImage;
  rating: number;
  testimonial: string;
  displayOrder?: number;
  published: boolean;
}

export interface SanityNavigation {
  _id: string;
  _type: "navigation";
  label: string;
  url: string;
  order: number;
  openInNewTab: boolean;
}

export interface SanityFooter {
  _id: string;
  _type: "footer";
  sectionName: string;
  links?: {
    label: string;
    url: string;
  }[];
  socialLinks?: {
    platform: "linkedin" | "instagram" | "facebook" | "github" | "twitter" | string;
    url: string;
  }[];
  copyrightText?: string;
}

import { groq } from "next-sanity";

// Site Settings Query
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  companyName,
  tagline,
  logo,
  email,
  phone,
  address,
  linkedin,
  instagram,
  facebook,
  github,
  footerText,
  seo {
    metaTitle,
    metaDescription,
    keywords,
    openGraphImage,
    canonicalUrl
  }
}`;

// Home Page Query
export const homePageQuery = groq`*[_type == "homePage"][0] {
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroButtons[] {
    label,
    url,
    style
  },
  technologies[] {
    name,
    category,
    iconName
  },
  featuredServices[]-> {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    icon,
    features,
    technologies,
    displayOrder,
    status
  },
  featuredProjects[]-> {
    _id,
    projectName,
    "slug": slug.current,
    category,
    client,
    duration,
    shortDescription,
    featuredImage,
    featured
  },
  ctaSection {
    ctaTitle,
    ctaDescription,
    ctaButtonLabel,
    ctaButtonUrl
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    openGraphImage,
    canonicalUrl
  }
}`;

// Services Query
export const servicesQuery = groq`*[_type == "service" && status == "published"] | order(displayOrder asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  fullDescription,
  icon,
  features,
  technologies,
  displayOrder,
  status,
  seo {
    metaTitle,
    metaDescription,
    keywords,
    openGraphImage,
    canonicalUrl
  }
}`;

// Service By Slug Query
export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug && status == "published"][0] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  fullDescription,
  icon,
  features,
  technologies,
  displayOrder,
  status,
  seo {
    metaTitle,
    metaDescription,
    keywords,
    openGraphImage,
    canonicalUrl
  }
}`;

// Portfolio Query
export const portfolioQuery = groq`*[_type == "portfolio" && status == "published"] | order(_createdAt desc) {
  _id,
  projectName,
  "slug": slug.current,
  category,
  client,
  duration,
  shortDescription,
  fullDescription,
  challenge,
  solution,
  technologies,
  results,
  featuredImage,
  galleryImages,
  status,
  featured,
  seo {
    metaTitle,
    metaDescription,
    keywords,
    openGraphImage,
    canonicalUrl
  }
}`;

// Project By Slug Query
export const projectBySlugQuery = groq`*[_type == "portfolio" && slug.current == $slug && status == "published"][0] {
  _id,
  projectName,
  "slug": slug.current,
  category,
  client,
  duration,
  shortDescription,
  fullDescription,
  challenge,
  solution,
  technologies,
  results,
  featuredImage,
  galleryImages,
  status,
  featured,
  seo {
    metaTitle,
    metaDescription,
    keywords,
    openGraphImage,
    canonicalUrl
  }
}`;

// Testimonials Query
export const testimonialsQuery = groq`*[_type == "testimonial" && published == true] | order(displayOrder asc) {
  _id,
  clientName,
  company,
  position,
  photo,
  rating,
  testimonial,
  displayOrder,
  published
}`;

// Navigation Query
export const navigationQuery = groq`*[_type == "navigation"] | order(order asc) {
  _id,
  label,
  url,
  order,
  openInNewTab
}`;

// Footer Query
export const footerQuery = groq`*[_type == "footer"] {
  _id,
  sectionName,
  links[] {
    label,
    url
  },
  socialLinks[] {
    platform,
    url
  },
  copyrightText
}`;

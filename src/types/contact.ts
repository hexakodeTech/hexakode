export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactDetail {
  id: string;
  label: string;
  value: string;
  type: "email" | "phone" | "location";
  href: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: "linkedin" | "instagram" | "facebook" | "twitter" | "github";
  color?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget: string;
  message: string;
}

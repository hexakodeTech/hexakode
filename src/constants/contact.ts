import { FAQItem, ContactDetail, SocialLink } from "../types/contact";

export const PROJECT_TYPES = [
  { value: "web_dev", label: "Web Development" },
  { value: "mobile_dev", label: "Mobile App Development" },
  { value: "ui_ux", label: "UI/UX Design" },
  { value: "custom_software", label: "Custom Software" },
  { value: "api_integration", label: "API Integration" },
  { value: "cloud_solutions", label: "Cloud Solutions" },
  { value: "other", label: "Other" },
];

export const BUDGET_RANGES = [
  { value: "25k-50k", label: "₹25,000 – ₹50,000" },
  { value: "50k-100k", label: "₹50,000 – ₹1,00,000" },
  { value: "100k-500k", label: "₹1,00,000 – ₹5,00,000" },
  { value: "500k_plus", label: "₹5,00,000+" },
  { value: "not_sure", label: "Not Sure Yet" },
];

export const CONTACT_DETAILS: ContactDetail[] = [
  {
    id: "cd1",
    label: "Email Us",
    value: "contact@hexakode.in",
    type: "email",
    href: "mailto:contact@hexakode.in",
  },
  {
    id: "cd2",
    label: "Call Us",
    value: "+91 XXXXX XXXXX",
    type: "phone",
    href: "tel:+91XXXXXXXXXX",
  },
  {
    id: "cd3",
    label: "Our Office",
    value: "Kerala, India",
    type: "location",
    href: "https://maps.google.com/?q=Kerala,+India",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "sl1",
    platform: "LinkedIn",
    url: "https://linkedin.com",
    iconName: "linkedin",
  },
  {
    id: "sl2",
    platform: "Instagram",
    url: "https://instagram.com",
    iconName: "instagram",
  },
  {
    id: "sl3",
    platform: "Facebook",
    url: "https://facebook.com",
    iconName: "facebook",
  },
  {
    id: "sl4",
    platform: "X",
    url: "https://x.com",
    iconName: "twitter",
  },
  {
    id: "sl5",
    platform: "GitHub",
    url: "https://github.com",
    iconName: "github",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq1",
    question: "How does the project scoping process work?",
    answer: "We begin with a discovery discussion to understand your goals, requirements, and expected outcomes. Based on that, we provide a roadmap and project estimate.",
  },
  {
    id: "faq2",
    question: "What is your typical project timeline?",
    answer: "Timelines vary depending on complexity. Most projects take between 4 and 12 weeks from planning to launch.",
  },
  {
    id: "faq3",
    question: "Do you provide ongoing support?",
    answer: "Yes. We offer maintenance and support plans to ensure your solution remains secure, optimized, and up to date.",
  },
  {
    id: "faq4",
    question: "Can we hire a dedicated development team?",
    answer: "Absolutely. We provide dedicated developer and engineering team engagement models based on project needs.",
  },
];

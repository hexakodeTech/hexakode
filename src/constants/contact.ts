import { FAQItem, ContactDetail, SocialLink } from "../types/contact";

export const PROJECT_TYPES = [
  { value: "website-development", label: "Website Development" },
  { value: "mobile-app-development", label: "Mobile App Development" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "ecommerce-development", label: "E-commerce Development" },
  { value: "custom-software-development", label: "Custom Software Development" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "other", label: "Other" },
];

export const BUDGET_RANGES = [
  { value: "25k-50k", label: "₹25,000 – ₹50,000" },
  { value: "50k-100k", label: "₹50,000 – ₹1,00,000" },
  { value: "100k-500k", label: "₹1,00,000 – ₹5,00,000" },
  { value: "500k_plus", label: "₹5,00,000+" },
  { value: "not_sure", label: "Not Sure Yet" },
];

export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/search?kgmid=%2Fg%2F11npyfhq8b&hl=ml-IN&q=HexaKode&shem=epsd1%2Cesd2e%2Cltae%2Crimspwouoe%2Csdpie&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm5%2F1&kgs=73fee9171bc13cab";

export const CONTACT_DETAILS: ContactDetail[] = [
  {
    id: "cd-location",
    label: "Location",
    value: "Kerala, India",
    type: "location",
    href: GOOGLE_BUSINESS_PROFILE_URL,
    description: "Service Area: Kerala, India (Remote-first)",
    isExternal: true,
  },
  {
    id: "cd-phone",
    label: "Phone",
    value: "+91 95398 28694",
    type: "phone",
    href: "tel:+919539828694",
  },
  {
    id: "cd-email",
    label: "Email",
    value: "contact@hexakode.in",
    type: "email",
    href: "mailto:contact@hexakode.in",
  },
  {
    id: "cd-website",
    label: "Website",
    value: "https://hexakode.in",
    type: "website",
    href: "https://hexakode.in",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "sl1",
    platform: "LinkedIn",
    url: "https://in.linkedin.com/company/hexakodeteh",
    iconName: "linkedin",
    color: "#0A66C2",
  },
  {
    id: "sl2",
    platform: "Instagram",
    url: "https://www.instagram.com/hexakode_tech/",
    iconName: "instagram",
    color: "#E4405F",
  },
  {
    id: "sl3",
    platform: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61589246312714",
    iconName: "facebook",
    color: "#1877F2",
  },
  {
    id: "sl4",
    platform: "X (Twitter)",
    url: "https://x.com/HexaKode98190",
    iconName: "twitter",
    color: "#FFFFFF",
  },
  {
    id: "sl5",
    platform: "GitHub",
    url: "https://github.com/hexakode",
    iconName: "github",
    color: "#FFFFFF",
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

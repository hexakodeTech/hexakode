import { PolicyMeta, PolicySection } from "@/types/legal";

export const cookieMeta: PolicyMeta = {
  title: "Cookie Policy",
  lastUpdated: "June 2026",
  company: "HexaKode",
  website: "https://www.hexakode.in",
  email: "contact@hexakode.in",
};

export const cookieSections: PolicySection[] = [
  {
    id: "what-are-cookies",
    number: 1,
    title: "What Are Cookies?",
    intro:
      "Cookies are small text files stored on your device when you visit a website. They help websites:",
    items: [
      { type: "bullet", text: "Remember preferences" },
      { type: "bullet", text: "Improve performance" },
      { type: "bullet", text: "Analyze traffic" },
      { type: "bullet", text: "Enhance security" },
      { type: "bullet", text: "Deliver a better user experience" },
      {
        type: "paragraph",
        text: "Cookies do not typically contain personally identifiable information by themselves.",
      },
    ],
  },
  {
    id: "how-we-use-cookies",
    number: 2,
    title: "How We Use Cookies",
    intro: "HexaKode uses cookies to:",
    items: [
      { type: "bullet", text: "Ensure website functionality" },
      { type: "bullet", text: "Remember user preferences" },
      { type: "bullet", text: "Improve performance" },
      { type: "bullet", text: "Measure website usage" },
      { type: "bullet", text: "Improve user experience" },
      { type: "bullet", text: "Enhance security" },
      { type: "bullet", text: "Diagnose technical issues" },
    ],
  },
  {
    id: "types-of-cookies",
    number: 3,
    title: "Types of Cookies We Use",
    subsections: [
      {
        heading: "Essential Cookies",
        items: [
          {
            type: "paragraph",
            text: "Required for the website to function properly. Without these cookies, certain parts of the website may not function correctly.",
          },
          { type: "bullet", text: "Session management" },
          { type: "bullet", text: "Security protection" },
          { type: "bullet", text: "Form functionality" },
          { type: "bullet", text: "Navigation preferences" },
        ],
      },
      {
        heading: "Performance Cookies",
        items: [
          {
            type: "paragraph",
            text: "Help us understand how visitors interact with our website.",
          },
          { type: "bullet", text: "Page performance metrics" },
          { type: "bullet", text: "Load times" },
          { type: "bullet", text: "Error tracking" },
          { type: "bullet", text: "User interaction analytics" },
        ],
      },
      {
        heading: "Analytics Cookies",
        items: [
          {
            type: "paragraph",
            text: "Collect anonymous usage information to help us improve our website.",
          },
          { type: "bullet", text: "Page visits" },
          { type: "bullet", text: "User journeys" },
          { type: "bullet", text: "Device information" },
          { type: "bullet", text: "Traffic sources" },
          {
            type: "paragraph",
            text: "Potential providers: Google Analytics, Google Search Console, and similar analytics tools.",
          },
        ],
      },
      {
        heading: "Functional Cookies",
        items: [
          {
            type: "paragraph",
            text: "Remember user preferences to improve the browsing experience.",
          },
          { type: "bullet", text: "Theme preferences" },
          { type: "bullet", text: "Language settings" },
          { type: "bullet", text: "Form preferences" },
          { type: "bullet", text: "UI customization options" },
        ],
      },
    ],
  },
  {
    id: "third-party-cookies",
    number: 4,
    title: "Third-Party Cookies",
    intro:
      "Some cookies may be placed by trusted third-party services integrated into our website:",
    items: [
      { type: "bullet", text: "Google Analytics" },
      { type: "bullet", text: "Google Tag Manager" },
      { type: "bullet", text: "Google Maps" },
      { type: "bullet", text: "Embedded content providers" },
      { type: "bullet", text: "Marketing tools (if introduced)" },
      {
        type: "paragraph",
        text: "These providers may process information according to their own privacy policies.",
      },
    ],
  },
  {
    id: "information-collected",
    number: 5,
    title: "Information Collected Through Cookies",
    intro: "Cookies may collect:",
    items: [
      { type: "bullet", text: "Browser type" },
      { type: "bullet", text: "Device type" },
      { type: "bullet", text: "Operating system" },
      { type: "bullet", text: "Pages visited" },
      { type: "bullet", text: "Session duration" },
      { type: "bullet", text: "Referral source" },
      { type: "bullet", text: "General geographic region" },
      { type: "bullet", text: "Website interactions" },
      {
        type: "paragraph",
        text: "We do not use cookies to collect sensitive personal information without consent.",
      },
    ],
  },
  {
    id: "managing-cookies",
    number: 6,
    title: "Managing Cookies",
    intro: "Most web browsers allow users to:",
    items: [
      { type: "bullet", text: "View cookies" },
      { type: "bullet", text: "Delete cookies" },
      { type: "bullet", text: "Block cookies" },
      { type: "bullet", text: "Restrict cookies" },
      {
        type: "paragraph",
        text: "You can manage cookie preferences through your browser settings (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, and others).",
      },
      {
        type: "paragraph",
        text: "Disabling certain cookies may affect website functionality.",
      },
    ],
  },
  {
    id: "cookie-retention",
    number: 7,
    title: "Cookie Retention",
    subsections: [
      {
        heading: "Session Cookies",
        items: [
          {
            type: "paragraph",
            text: "Automatically removed when the browser is closed.",
          },
        ],
      },
      {
        heading: "Persistent Cookies",
        items: [
          {
            type: "paragraph",
            text: "Remain on your device until they expire, are deleted manually, or are removed by browser settings. Retention periods vary depending on the purpose of the cookie.",
          },
        ],
      },
    ],
  },
  {
    id: "policy-changes",
    number: 8,
    title: "Changes to This Cookie Policy",
    intro:
      "HexaKode may update this Cookie Policy periodically to reflect:",
    items: [
      { type: "bullet", text: "Legal requirements" },
      { type: "bullet", text: "Technical changes" },
      { type: "bullet", text: "New services" },
      { type: "bullet", text: "Improved practices" },
      {
        type: "paragraph",
        text: "Updated versions will be published on this page.",
      },
    ],
  },
  {
    id: "related-policies",
    number: 9,
    title: "Related Policies",
    intro: "Users should also review our related policies:",
    items: [
      {
        type: "internalLink",
        text: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        type: "internalLink",
        text: "Terms of Service",
        href: "/terms-of-service",
      },
      {
        type: "paragraph",
        text: "These documents work together to explain how information is collected, processed, and protected across all HexaKode services.",
      },
    ],
  },
  {
    id: "contact-us",
    number: 10,
    title: "Contact Us",
    intro:
      "If you have questions regarding this Cookie Policy, please contact:",
    items: [
      { type: "paragraph", text: "HexaKode" },
      {
        type: "email",
        text: "contact@hexakode.in",
        href: "mailto:contact@hexakode.in",
      },
      {
        type: "link",
        text: "www.hexakode.in",
        href: "https://www.hexakode.in",
      },
    ],
  },
];

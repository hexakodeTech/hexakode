import { PolicyMeta, PolicySection } from "@/types/legal";

export const termsMeta: PolicyMeta = {
  title: "Terms of Service",
  lastUpdated: "June 2026",
  company: "HexaKode",
  website: "https://www.hexakode.in",
  email: "contact@hexakode.in",
};

export const termsSections: PolicySection[] = [
  {
    id: "company-information",
    number: 1,
    title: "Company Information",
    intro:
      "HexaKode is a software engineering company that provides digital solutions including:",
    items: [
      { type: "bullet", text: "Web Development" },
      { type: "bullet", text: "Mobile App Development" },
      { type: "bullet", text: "SaaS Platforms" },
      { type: "bullet", text: "UI/UX Design" },
      { type: "bullet", text: "API Integrations" },
      { type: "bullet", text: "Cloud Solutions" },
      { type: "bullet", text: "Custom Software Development" },
    ],
  },
  {
    id: "acceptance-of-terms",
    number: 2,
    title: "Acceptance of Terms",
    intro:
      "By using our website or engaging our services, you confirm that:",
    items: [
      { type: "bullet", text: "You are legally capable of entering into a binding agreement." },
      { type: "bullet", text: "Information provided by you is accurate." },
      { type: "bullet", text: "You will use the website lawfully." },
    ],
  },
  {
    id: "services",
    number: 3,
    title: "Services",
    intro: "HexaKode may provide:",
    items: [
      { type: "bullet", text: "Consulting Services" },
      { type: "bullet", text: "Software Development Services" },
      { type: "bullet", text: "Design Services" },
      { type: "bullet", text: "Maintenance Services" },
      { type: "bullet", text: "Technical Support" },
      { type: "bullet", text: "Project-Based Deliverables" },
      {
        type: "paragraph",
        text: "Specific project details, timelines, pricing, and deliverables may be governed by separate contracts, proposals, or service agreements.",
      },
    ],
  },
  {
    id: "user-responsibilities",
    number: 4,
    title: "User Responsibilities",
    subsections: [
      {
        heading: "Users agree to",
        items: [
          { type: "bullet", text: "Provide accurate information." },
          { type: "bullet", text: "Maintain confidentiality of credentials." },
          { type: "bullet", text: "Avoid unlawful activities." },
          { type: "bullet", text: "Respect intellectual property rights." },
          { type: "bullet", text: "Avoid attempts to disrupt services." },
        ],
      },
      {
        heading: "Users must not",
        items: [
          { type: "bullet", text: "Upload malicious code." },
          { type: "bullet", text: "Attempt unauthorized access." },
          { type: "bullet", text: "Perform fraudulent activities." },
          { type: "bullet", text: "Abuse website functionality." },
        ],
      },
    ],
  },
  {
    id: "intellectual-property",
    number: 5,
    title: "Intellectual Property",
    subsections: [
      {
        heading: "Ownership",
        items: [
          {
            type: "paragraph",
            text: "Unless otherwise agreed in writing, HexaKode retains ownership of proprietary tools, frameworks, templates, methodologies, and internal assets. Clients retain ownership of materials they provide. Ownership of final deliverables may transfer according to the signed project agreement.",
          },
        ],
      },
      {
        heading: "Website Content",
        items: [
          {
            type: "paragraph",
            text: "All website content — including logos, branding, graphics, text, and design assets — remains the property of HexaKode unless stated otherwise.",
          },
        ],
      },
    ],
  },
  {
    id: "quotes-proposals",
    number: 6,
    title: "Quotes & Project Proposals",
    intro: "Project estimates and proposals:",
    items: [
      { type: "bullet", text: "Are provided for informational purposes." },
      { type: "bullet", text: "May change based on scope adjustments." },
      {
        type: "bullet",
        text: "Do not constitute a binding agreement until accepted by both parties.",
      },
      {
        type: "paragraph",
        text: "Additional requirements may result in revised pricing and timelines.",
      },
    ],
  },
  {
    id: "payments",
    number: 7,
    title: "Payments",
    intro: "Where applicable:",
    items: [
      { type: "bullet", text: "Payments must be made according to agreed terms." },
      { type: "bullet", text: "Late payments may result in service suspension." },
      {
        type: "bullet",
        text: "Project delivery may be delayed until outstanding invoices are cleared.",
      },
      {
        type: "paragraph",
        text: "Detailed payment terms may be specified in individual project agreements.",
      },
    ],
  },
  {
    id: "third-party-services",
    number: 8,
    title: "Third-Party Services",
    intro: "Projects may integrate with third-party services such as:",
    items: [
      { type: "bullet", text: "Google Services" },
      { type: "bullet", text: "Cloud Providers" },
      { type: "bullet", text: "Payment Gateways" },
      { type: "bullet", text: "Analytics Platforms" },
      { type: "bullet", text: "APIs" },
      {
        type: "paragraph",
        text: "HexaKode is not responsible for outages, limitations, or policy changes of third-party providers.",
      },
    ],
  },
  {
    id: "service-availability",
    number: 9,
    title: "Service Availability",
    intro: "While HexaKode strives for reliable service:",
    items: [
      { type: "bullet", text: "Continuous availability is not guaranteed." },
      { type: "bullet", text: "Maintenance may occur periodically." },
      { type: "bullet", text: "Temporary interruptions may occur." },
      {
        type: "paragraph",
        text: "We reserve the right to modify or discontinue services when necessary.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    number: 10,
    title: "Limitation of Liability",
    intro:
      "To the fullest extent permitted by law, HexaKode shall not be liable for:",
    items: [
      { type: "bullet", text: "Indirect damages" },
      { type: "bullet", text: "Consequential damages" },
      { type: "bullet", text: "Business interruption" },
      { type: "bullet", text: "Data loss" },
      { type: "bullet", text: "Revenue loss" },
      { type: "bullet", text: "Lost profits" },
      {
        type: "paragraph",
        text: "Total liability shall not exceed the amount paid for the specific service giving rise to the claim.",
      },
    ],
  },
  {
    id: "warranties-disclaimer",
    number: 11,
    title: "Warranties Disclaimer",
    intro:
      'Services and website content are provided "AS IS" and "AS AVAILABLE". HexaKode makes no guarantees regarding:',
    items: [
      { type: "bullet", text: "Uninterrupted operation" },
      { type: "bullet", text: "Error-free functionality" },
      { type: "bullet", text: "Third-party integrations" },
      { type: "bullet", text: "Future compatibility" },
      {
        type: "paragraph",
        text: "Except where explicitly agreed in writing.",
      },
    ],
  },
  {
    id: "termination",
    number: 12,
    title: "Termination",
    intro: "We may suspend or terminate access if:",
    items: [
      { type: "bullet", text: "Terms are violated." },
      { type: "bullet", text: "Fraudulent activity is detected." },
      { type: "bullet", text: "Required by law." },
      { type: "bullet", text: "Necessary to protect our business or users." },
    ],
  },
  {
    id: "confidentiality",
    number: 13,
    title: "Confidentiality",
    items: [
      {
        type: "paragraph",
        text: "Information shared during project discussions may be treated as confidential. Separate NDA agreements may provide additional protection where required.",
      },
    ],
  },
  {
    id: "privacy",
    number: 14,
    title: "Privacy",
    items: [
      {
        type: "paragraph",
        text: "Use of the website is also governed by our Privacy Policy. Users should review the Privacy Policy alongside these Terms to fully understand how their information is handled.",
      },
    ],
  },
  {
    id: "governing-law",
    number: 15,
    title: "Governing Law",
    items: [
      {
        type: "paragraph",
        text: "These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the appropriate courts in Kerala, India.",
      },
    ],
  },
  {
    id: "changes-to-terms",
    number: 16,
    title: "Changes to Terms",
    items: [
      {
        type: "paragraph",
        text: "HexaKode may revise these Terms periodically. Updated versions will be published on this page.",
      },
      {
        type: "paragraph",
        text: "Continued use of the website constitutes acceptance of the updated Terms.",
      },
    ],
  },
  {
    id: "contact-information",
    number: 17,
    title: "Contact Information",
    intro: "For questions regarding these Terms, please contact us:",
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

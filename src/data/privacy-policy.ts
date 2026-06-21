import { PolicyMeta, PolicySection } from "@/types/legal";

export const privacyMeta: PolicyMeta = {
  title: "Privacy Policy",
  lastUpdated: "June 2026",
  company: "HexaKode",
  website: "https://www.hexakode.in",
  email: "contact@hexakode.in",
};

export const privacySections: PolicySection[] = [
  {
    id: "information-we-collect",
    number: 1,
    title: "Information We Collect",
    intro:
      "We may collect the following information when you visit our website or interact with our services:",
    subsections: [
      {
        heading: "Personal Information",
        items: [
          { type: "bullet", text: "Name" },
          { type: "bullet", text: "Email Address" },
          { type: "bullet", text: "Phone Number" },
          { type: "bullet", text: "Company Name" },
          { type: "bullet", text: "Project Information" },
          { type: "bullet", text: "Communication Preferences" },
        ],
      },
      {
        heading: "Technical Information",
        items: [
          { type: "bullet", text: "IP Address" },
          { type: "bullet", text: "Browser Type" },
          { type: "bullet", text: "Device Information" },
          { type: "bullet", text: "Operating System" },
          { type: "bullet", text: "Referral Source" },
          { type: "bullet", text: "Website Usage Data" },
        ],
      },
      {
        heading: "Form Submissions",
        items: [
          {
            type: "paragraph",
            text: "When you submit Contact Forms, Demo Requests, or Project Enquiries, we collect the information you voluntarily provide.",
          },
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    number: 2,
    title: "How We Use Your Information",
    intro: "We use collected information to:",
    items: [
      { type: "bullet", text: "Respond to enquiries" },
      { type: "bullet", text: "Schedule demonstrations" },
      { type: "bullet", text: "Provide quotations" },
      { type: "bullet", text: "Deliver requested services" },
      { type: "bullet", text: "Improve website performance and user experience" },
      { type: "bullet", text: "Analyze website traffic" },
      { type: "bullet", text: "Communicate updates and announcements" },
      { type: "bullet", text: "Prevent fraud and abuse" },
    ],
  },
  {
    id: "cookies",
    number: 3,
    title: "Cookies & Tracking Technologies",
    intro:
      "Our website may use the following types of cookies to understand how visitors interact with our website and improve overall performance:",
    items: [
      { type: "bullet", text: "Essential Cookies" },
      { type: "bullet", text: "Analytics Cookies" },
      { type: "bullet", text: "Performance Cookies" },
      {
        type: "paragraph",
        text: "Users may disable cookies through their browser settings. Disabling certain cookies may affect the functionality of some features.",
      },
    ],
  },
  {
    id: "data-security",
    number: 4,
    title: "Data Storage & Security",
    intro:
      "We implement industry-standard security measures to protect your information against:",
    items: [
      { type: "bullet", text: "Unauthorized access" },
      { type: "bullet", text: "Data alteration" },
      { type: "bullet", text: "Disclosure" },
      { type: "bullet", text: "Destruction" },
      {
        type: "paragraph",
        text: "While we strive to protect personal information, no internet transmission can be guaranteed to be completely secure. We encourage you to use secure networks when submitting sensitive information.",
      },
    ],
  },
  {
    id: "third-party",
    number: 5,
    title: "Third-Party Services",
    intro: "We may use trusted third-party services including:",
    items: [
      { type: "bullet", text: "Google Analytics" },
      { type: "bullet", text: "Google Workspace" },
      { type: "bullet", text: "Cloud Hosting Providers" },
      { type: "bullet", text: "Email Communication Providers" },
      { type: "bullet", text: "CRM Platforms" },
      { type: "bullet", text: "Payment Providers (if introduced in future)" },
      {
        type: "paragraph",
        text: "These providers may process information according to their own privacy policies. We encourage you to review the privacy policies of any third-party services you interact with.",
      },
    ],
  },
  {
    id: "data-sharing",
    number: 6,
    title: "Data Sharing",
    intro:
      "HexaKode does not sell personal information. We may share information only when:",
    items: [
      { type: "bullet", text: "Required by law" },
      { type: "bullet", text: "Necessary to provide services" },
      { type: "bullet", text: "Required for security investigations" },
      {
        type: "bullet",
        text: "Necessary for business operations through trusted service providers",
      },
    ],
  },
  {
    id: "data-retention",
    number: 7,
    title: "Data Retention",
    intro:
      "We retain personal information only as long as necessary to:",
    items: [
      { type: "bullet", text: "Fulfill service obligations" },
      { type: "bullet", text: "Meet legal requirements" },
      { type: "bullet", text: "Resolve disputes" },
      { type: "bullet", text: "Maintain business records" },
      {
        type: "paragraph",
        text: "Information may be securely deleted when no longer required for the purposes outlined above.",
      },
    ],
  },
  {
    id: "your-rights",
    number: 8,
    title: "Your Rights",
    intro:
      "Depending on your jurisdiction, you may have the right to:",
    items: [
      { type: "bullet", text: "Access your information" },
      { type: "bullet", text: "Correct inaccurate information" },
      { type: "bullet", text: "Request deletion" },
      { type: "bullet", text: "Withdraw consent" },
      { type: "bullet", text: "Restrict processing" },
      { type: "bullet", text: "Request data portability" },
      {
        type: "paragraph",
        text: "Requests may be submitted through our contact email. We will respond within a reasonable timeframe in accordance with applicable law.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    number: 9,
    title: "Children's Privacy",
    items: [
      {
        type: "paragraph",
        text: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.",
      },
    ],
  },
  {
    id: "international",
    number: 10,
    title: "International Users",
    items: [
      {
        type: "paragraph",
        text: "Information may be processed and stored in countries where our service providers operate. By using our website, you consent to such transfers where legally permitted. We ensure that any cross-border data transfers are handled in compliance with applicable privacy regulations.",
      },
    ],
  },
  {
    id: "policy-changes",
    number: 11,
    title: "Changes to This Policy",
    items: [
      {
        type: "paragraph",
        text: "HexaKode may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. Changes become effective immediately upon publication on this page.",
      },
      {
        type: "paragraph",
        text: "We encourage users to review this page regularly to stay informed about how we protect your information.",
      },
    ],
  },
  {
    id: "contact",
    number: 12,
    title: "Contact Us",
    intro:
      "For privacy-related questions or to exercise your rights, please contact us:",
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

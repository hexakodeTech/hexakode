import React from "react";
import { Metadata } from "next";
import ServiceLandingPageTemplate from "@/components/services/ServiceLandingPageTemplate";
import Footer from "@/components/layout/Footer";
import { getPublishedProjects } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";
import { Project } from "@/types/home";

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "UI UX Design Company in Kerala | UI UX Designers | HexaKode",
  description:
    "Looking for a top UI UX Design Company in Kerala? HexaKode creates beautiful, intuitive, and WCAG-accessible digital interfaces in Figma to boost engagement.",
  path: "/services/ui-ux-design",
  image: "/og-ui-ux-design.png",
  imageAlt: "HexaKode UI/UX and Product Design Services",
  keywords: [
    "UI UX Design Company in Kerala",
    "UI UX Design Company in Palakkad",
    "UI UX Design Company Near Me",
    "UI UX Designers Kerala",
    "User Experience Design",
    "User Interface Design",
    "Mobile App UI Design",
    "Dashboard UI Design",
    "SaaS UI Design",
    "Website UI Design",
    "Figma Designers",
    "Product Design Company",
    "UX Research",
    "UI Design Services Kerala",
  ],
});

const CHALLENGES = [
  {
    title: "Cognitive Overload & Confusing User Flows",
    description: "When web platforms lack clear navigational paths, users struggle to find basic features. This cognitive friction leads to user frustration, platform abandonment, and extremely low user retention rates.",
    iconName: "compass",
  },
  {
    title: "High Checkout & Lead Abandonment",
    description: "Confusing onboarding checkouts, input fields without clear error validations, and poor page layouts create checkout friction. This causes potential leads to abandon forms, directly hurting your business revenue.",
    iconName: "shopping-cart",
  },
  {
    title: "Fragmented UI Layouts & Inconsistent Branding",
    description: "Designing pages on the fly without a centralized design component library results in a fragmented visual interface. Screens look different, text styles clash, and users lose trust in your product's professional quality.",
    iconName: "layout-grid",
  },
  {
    title: "Accessibility Violations (Excluding Users)",
    description: "Ignoring basic accessibility standards (WCAG AA/AAA) such as proper color contrast, keyboard navigable tabs, and screen-readable labels excludes users with disabilities and risks compliance penalties.",
    iconName: "eye-off",
  },
];

const WHY_CHOOSE_POINTS = [
  {
    title: "Data-Driven UX Research",
    desc: "We do not guess layouts. We conduct user interviews, compile competitor benchmarks, define user journey mappings, and establish layout rules based on real behavioral patterns.",
  },
  {
    title: "Figma Component Systems",
    desc: "We construct robust, tokenized design systems in Figma. This includes custom typography, global color palettes, spacing variables, and reusable components that make development handoff seamless.",
  },
  {
    title: "Accessibility-First Focus",
    desc: "We design products with accessibility in mind. We strictly audit color contrast ratios, button target sizes, keyboard focus rings, and screen-reader headings to align with WCAG standards.",
  },
  {
    title: "Seamless Developer Handoff",
    desc: "We bridge the gap between design and code. We export comprehensive interactive prototypes, export production assets, and map layout tokens, preventing design translation errors.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Research",
    iconName: "search",
    duration: "2–3 Days",
    summary: "Conducting user research and competitor analysis.",
    bullets: [
      "Conduct user interviews & surveys",
      "Map user empathy & behavior models",
      "Audit competitor UI/UX layouts & friction points",
      "Identify core accessibility & feature requirements"
    ],
    deliverables: [
      "User Research Report",
      "User Persona Profile Cards",
      "Competitor UX Audit Sheet"
    ],
    businessValue: "Aligns design strategy with actual user needs, preventing expensive redesigns."
  },
  {
    title: "Structure",
    iconName: "clipboard-list",
    duration: "2–3 Days",
    summary: "Defining user flows and logical sitemaps.",
    bullets: [
      "Outline sitemap navigation blocks",
      "Map step-by-step user task flows",
      "Design card sorting workshops",
      "Plan logic and structural layouts"
    ],
    deliverables: [
      "Information Architecture Sitemap",
      "User Flow Diagrams",
      "Content Hierarchy Maps"
    ],
    businessValue: "Ensures users can navigate intuitively and find information with minimal effort."
  },
  {
    title: "Wireframes",
    iconName: "palette",
    duration: "3–4 Days",
    summary: "Creating low-fidelity layout wireframes.",
    bullets: [
      "Sketch digital screen wireframes",
      "Verify content structure & visual density",
      "Test primary action placements & zones",
      "Iterate layouts based on usability feedback"
    ],
    deliverables: [
      "Low-Fidelity Figma Wireframes",
      "Clickable Structural Wireframes",
      "Usability Feedback Checklist"
    ],
    businessValue: "Validates layout structural concepts quickly before investing time in high-fidelity visuals."
  },
  {
    title: "Design System",
    iconName: "code",
    duration: "3 Days",
    summary: "Establishing branding components and typography.",
    bullets: [
      "Define color palettes & typography grids",
      "Design button states & form input states",
      "Configure responsive spacing systems",
      "Build reusable component asset libraries"
    ],
    deliverables: [
      "Reusable UI Kit Library",
      "Branding Style Guidelines",
      "Figma Variables Workspace"
    ],
    businessValue: "Guarantees a consistent brand experience across pages and speeds up future engineering."
  },
  {
    title: "High-Fidelity",
    iconName: "test-tube",
    duration: "1 Week",
    summary: "Designing complete, beautiful, and modern screens.",
    bullets: [
      "Apply style guides to wireframe layouts",
      "Source high-quality media & icons",
      "Configure dark & light display modes",
      "Ensure color contrast accessibility (WCAG)"
    ],
    deliverables: [
      "High-Fidelity Figma Screens",
      "Production-Ready Visual Assets",
      "Design Specification Documents"
    ],
    businessValue: "Attracts users with premium visual aesthetics and drives higher conversions."
  },
  {
    title: "Prototypes",
    iconName: "rocket",
    duration: "3 Days",
    summary: "Building interactive, high-fidelity user flows.",
    bullets: [
      "Link screens with click/hover navigation flows",
      "Animate micro-interactions & gestures",
      "Prepare prototype files for usability tests",
      "Run validation checks on real screens"
    ],
    deliverables: [
      "Interactive Figma Prototypes",
      "Interaction Spec Documents",
      "Video Walkthrough Demos"
    ],
    businessValue: "Simulates the final application, allowing you to test usability with real users."
  },
  {
    title: "Handoff",
    iconName: "wrench",
    duration: "1–2 Days",
    summary: "Preparing assets and specifications for development.",
    bullets: [
      "Document hover, focus, and error states",
      "Export images, SVGs, and animations",
      "Run developer walk-through sessions",
      "Validate initial coding matches mockup"
    ],
    deliverables: [
      "Figma Handoff Workspace",
      "Exported Assets ZIP Package",
      "Component Specs Documentation"
    ],
    businessValue: "Streamlines translation from Figma mockup to code, reducing developer bugs."
  }
];

const TECHNOLOGIES = [
  {
    name: "Figma Design & Tokens",
    reason: "Figma is our primary design workspace. We build component design systems using Figma variables and layout tokens, guaranteeing that visual design parameters transfer seamlessly to frontend Tailwind CSS configurations.",
  },
  {
    name: "Interactive Prototypes",
    reason: "We construct clickable, flow-mapped prototypes. This allows stakeholders and users to interact with features, transitions, and user flows before engineering teams write a single line of backend code.",
  },
  {
    name: "Information Architecture",
    reason: "We structure sitemaps, data directories, and system relationships carefully. This streamlines navigation pathways, reducing the total amount of clicks a user requires to perform actions.",
  },
  {
    name: "UX Research & Interviews",
    reason: "We gather quantitative data and conduct user interviews. By analyzing user feedback, we locate cognitive blockers and solve usability friction before visual layout steps.",
  },
  {
    name: "WCAG Accessibility Audits",
    reason: "We strictly check color contrast ratios, font sizing guidelines, minimum clickable area variables, and screen reader labels. This ensures your platform complies with global WCAG regulations.",
  },
  {
    name: "Design Systems Construction",
    reason: "We build centralized design libraries. This defines button styles, input components, card models, grids, and icon maps, ensuring visual consistency across your product growth.",
  },
  {
    name: "Framer Animations Draft",
    reason: "For complex visual micro-interactions, custom modal transitions, and dashboard animations, we draft movement parameters in design specs to guide developer implementation.",
  },
  {
    name: "Tailwind CSS Mapping",
    reason: "We align color variables and grid layouts with Tailwind CSS configurations. This means developers can build pixel-perfect copies of designs in React and Next.js codes.",
  },
];

const BENEFITS = [
  {
    title: "Boost User Conversion Rates",
    desc: "By removing transaction friction, simplifying form designs, and positioning CTAs strategically, we help increase purchase and lead conversions.",
  },
  {
    title: "Halve Development Time",
    desc: "A centralized Figma component design library cuts frontend coding loops in half, as developers build with modular, pre-mapped parameters.",
  },
  {
    title: "Strengthen Customer Trust",
    desc: "Consistency in colors, fonts, layouts, and animations creates a polished brand aesthetic that builds consumer trust and retention.",
  },
];

const FAQS = [
  {
    question: "What is your UI/UX design process?",
    answer: "Our UI/UX design workflow follows a structured methodology: User Research & Competitor Benchmarking -> Information Architecture Mapping -> Wireframing (UX Layouts) -> Visual UI Design (Typography, Colors, Branding) -> Clickable Interactive Prototyping -> Usability Testing -> Developer Handoff.",
  },
  {
    question: "Why is UI/UX design important for my product's business success?",
    answer: "UI/UX design directly impacts user conversion and retention metrics. A confusing interface or slow navigation frustrates users, leading to high abandonment rates. A custom, intuitive design streamlines product usage, increases purchase rates, and builds brand loyalty.",
  },
  {
    question: "Do you conduct user research and usability testing?",
    answer: "Yes, user research is core to our process. We interview stakeholders, gather feedback, audit competitor layouts, map user personas, and test high-fidelity clickable prototypes with actual users to locate usability friction before coding starts.",
  },
  {
    question: "What design tools do you use for wireframing and prototyping?",
    answer: "We primarily utilize Figma. It is the industry standard for collaborative user interface design. We build design systems, configure token variables, draw wireframes, build high-fidelity visual screens, and link interactive clickable prototypes in Figma.",
  },
  {
    question: "How do you ensure the design is accessible (WCAG compliant)?",
    answer: "We incorporate WCAG standards into our design files. We test color contrast ratios using analyzer plug-ins, design large touch targets for mobile (minimum 44x44 pixels), verify screen reader structural grids, and define clear focus states for keyboard users.",
  },
  {
    question: "Can you design UI/UX for both mobile apps and web platforms?",
    answer: "Yes, absolutely. We design interfaces for web dashboards, responsive websites, SaaS platforms, native iOS (Apple Human Interface Guidelines), Android apps (Material Design), and custom desktop system tools, optimizing layouts for every platform.",
  },
  {
    question: "Do you provide a design system or component library?",
    answer: "Yes, every custom project includes a tokenized design system library in Figma. This includes centralized styles for buttons, input fields, navigation blocks, global color tokens, typographies, icons, and layout parameters to ensure brand consistency.",
  },
  {
    question: "How do you collaborate with developers during the handoff process?",
    answer: "We ensure developer handoffs are seamless. We configure layout grids, define CSS/Tailwind variables, export visual assets in multiple formats, organize Figma screens, and maintain communication during coding phases to resolve visual layout issues.",
  },
  {
    question: "Can you improve or redesign my existing application's user interface?",
    answer: "Yes, we specialize in UI/UX redesigns. We audit your existing application to locate usability bottlenecks, run contrast checks, map user friction points, and deliver a modernized visual interface while preserving key brand parameters.",
  },
  {
    question: "How long does the UI/UX design phase typically take?",
    answer: "Timeline spans depend on complexity. A corporate website UI project takes 2 to 4 weeks. Designing complex SaaS dashboards, mobile apps, or multi-role software portals with 20+ screens typically requires 6 to 10 weeks from discovery to developer handoff.",
  },
];

export default async function UiUxDesignPage() {
  let mappedProjects: Project[] = [];
  try {
    const dbProjects = await getPublishedProjects();
    const uiuxProjects = dbProjects.filter((p) => mapDbCategoryToPublic(p.category) === "UI/UX").slice(0, 6);
    
    mappedProjects = uiuxProjects.map((p) => {
      const publicCategory = mapDbCategoryToPublic(p.category);
      return {
        id: p.id,
        title: p.title,
        category: publicCategory,
        imageUrl: p.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
        tags: p.technologies.map((t) => t.name),
        href: `/portfolio/${p.slug}`,
        description: p.shortDescription,
        featured: p.featured,
      };
    });
  } catch (error) {
    console.error("Error loading projects for UI/UX Design page:", error);
  }

  return (
    <ServiceLandingPageTemplate
      badge="UI/UX DESIGN KERALA"
      h1="UI UX Design"
      heroDescription="Design products that people love. We combine deep user research, wireframing, and interactive prototyping to build beautiful, intuitive, and accessible digital interfaces that drive business conversions and engagement."
      serviceName="UI/UX Design"
      serviceUrl="/services/ui-ux-design"
      serviceType="UI/UX & Product Design"
      serviceImage="/og-ui-ux-design.png"
      metaDescription="Looking for a top UI UX Design Company in Kerala? HexaKode creates beautiful, intuitive, and WCAG-accessible digital interfaces in Figma to boost engagement."
      challenges={CHALLENGES}
      whyChooseDesc="We do not sketch generic visuals. We study actual user behavior to engineer clear, accessible component-based design systems."
      whyChoosePoints={WHY_CHOOSE_POINTS}
      processSteps={PROCESS_STEPS}
      technologies={TECHNOLOGIES}
      benefits={BENEFITS}
      faqs={FAQS}
      projects={mappedProjects}
      footer={<Footer />}
    />
  );
}

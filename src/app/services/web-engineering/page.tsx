import React from "react";
import { Metadata } from "next";
import ServiceLandingPageTemplate from "@/components/services/ServiceLandingPageTemplate";
import Footer from "@/components/layout/Footer";
import { getPublishedProjects } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";
import { Project } from "@/types/home";

export const metadata: Metadata = {
  title: "Web Engineering Company in Kerala | Web Developers | HexaKode",
  description:
    "Looking for a premier Web Engineering Company in Kerala? HexaKode designs custom, responsive, and SEO-friendly web applications using React, Next.js, and headless CMS.",
  keywords: [
    "Web Engineering Company in Kerala",
    "Web Engineering Services",
    "Website Development Company in Kerala",
    "Web Development Company Kerala",
    "Website Designers Kerala",
    "Custom Web Engineering",
    "Business Web Applications",
    "Responsive Web Design",
    "SEO Friendly Web Engineering",
    "Next.js Development Company",
    "Web Engineering Services Kerala",
  ],
  alternates: {
    canonical: "/services/web-engineering",
  },
  openGraph: {
    title: "Web Engineering Company in Kerala | HexaKode",
    description:
      "HexaKode delivers high-performance web engineering solutions designed for scale using React, Next.js, and headless CMS.",
    url: "/services/web-engineering",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Engineering Company in Kerala | HexaKode",
    description:
      "HexaKode delivers high-performance web engineering solutions designed for scale using React, Next.js, and headless CMS.",
  },
};

const CHALLENGES = [
  {
    title: "Lack of Search Engine Visibility",
    description:
      "Many local businesses in Kerala fail to reach potential customers simply because their legacy websites lack structural SEO optimization, causing them to rank behind competitors on search engine result pages.",
    iconName: "globe",
  },
  {
    title: "Sluggish Loading Speeds & High Bounce Rates",
    description:
      "Websites built on bloated templates or outdated page builders experience extreme load-time lags. In today's fast-paced web, a one-second delay causes users to leave, resulting in high bounce rates and lost conversions.",
    iconName: "gauge",
  },
  {
    title: "Low User Conversion & Ineffective Lead Capturing",
    description:
      "A website is your online salesperson. If your layout lacks intuitive navigation, clear call-to-actions (CTAs), or user-friendly input fields, visitors will drop off, leading to zero sales conversions or business leads.",
    iconName: "trending-down",
  },
  {
    title: "Frequent Downtime & Security Vulnerabilities",
    description:
      "WordPress sites and generic databases require constant patch updates, plugin maintenance, and are highly vulnerable to hacking. Without dedicated engineering, legacy sites present high security risks and downtime.",
    iconName: "shield-alert",
  },
];

const WHY_CHOOSE_POINTS = [
  {
    title: "Blazing Fast Performance",
    desc: "We build modern React and Next.js platforms using Server-Side Rendering (SSR) and Static Site Generation (SSG). This results in near-instantaneous page loading speeds and perfect Core Web Vitals scorecards.",
  },
  {
    title: "Technical SEO Integrated",
    desc: "We build SEO-friendly web architectures from day one. By generating semantic HTML structure, proper meta headers, automated sitemaps, and Schema.org structured data, we ensure search engines crawl and rank your pages.",
  },
  {
    title: "Headless CMS Control",
    desc: "We decouple your visual interface from content management. By integrating headless platforms like Sanity CMS or Strapi, we give your business teams total editing freedom while keeping your code clean and secure.",
  },
  {
    title: "Scalable Cloud Hosting",
    desc: "We host websites on global serverless CDN networks like Vercel and AWS. This means your platform requires zero manual server maintenance, scales automatically during traffic spikes, and boasts a 99.99% uptime guarantee.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Discovery",
    iconName: "search",
    duration: "1–2 Days",
    summary: "Understanding your business goals and market landscape.",
    bullets: [
      "Identify core business goals",
      "Profile target customer audience",
      "Audit competitor websites & features",
      "Clarify specific technical integrations",
    ],
    deliverables: [
      "Requirement Analysis Document",
      "Project Scope Definition",
      "Site Architecture Map",
    ],
    businessValue: "Eliminates scope creep and aligns technical specifications with actual business goals.",
  },
  {
    title: "Planning",
    iconName: "clipboard-list",
    duration: "2–3 Days",
    summary: "Creating a concrete roadmap and technical blueprint.",
    bullets: [
      "Determine database schema & API layers",
      "Select third-party integrations & CMS",
      "Establish milestones & sprint schedules",
      "Prepare staging environment architecture",
    ],
    deliverables: [
      "Technical Architecture Diagram",
      "Milestone Timeline & Schedule",
      "Work Breakdown Structure",
    ],
    businessValue: "Guarantees resource availability and provides transparency on project delivery schedules.",
  },
  {
    title: "UI/UX Design",
    iconName: "palette",
    duration: "1 Week",
    summary: "Crafting modern, custom, and conversion-focused screens.",
    bullets: [
      "Sketch layout wireframes & flows",
      "Create bespoke design system tokens",
      "Design high-fidelity desktop & mobile UI",
      "Build interactive Figma prototypes",
    ],
    deliverables: [
      "Figma Design File Access",
      "Interactive User Prototypes",
      "Component Design System",
    ],
    businessValue: "Establishes a premium brand aesthetic and optimizes visual elements for higher user conversion rates.",
  },
  {
    title: "Development",
    iconName: "code",
    duration: "2–3 Weeks",
    summary: "Coding clean, fast, and structured Next.js code.",
    bullets: [
      "Configure semantic Next.js frontend pages",
      "Write type-safe TypeScript code blocks",
      "Integrate headless CMS database schema",
      "Build responsive Tailwind CSS layouts",
    ],
    deliverables: [
      "Staging Deployment Access",
      "Version-Controlled Git Repo",
      "Configured Headless CMS Interface",
    ],
    businessValue: "Delivers a fast, highly secure, and editable site that scales without server management.",
  },
  {
    title: "Testing",
    iconName: "test-tube",
    duration: "3–4 Days",
    summary: "Validating performance, security, and responsiveness.",
    bullets: [
      "Run Lighthouse & Core Web Vitals checks",
      "Test responsiveness on mobile & desktop",
      "Perform security & data leak audits",
      "Validate third-party API payloads",
    ],
    deliverables: [
      "Performance Score Reports",
      "Cross-Browser Audit Sheets",
      "QA Verification Checklist",
    ],
    businessValue: "Ensures error-free operation and top-tier speed scores to improve Google Search rankings.",
  },
  {
    title: "Deployment",
    iconName: "rocket",
    duration: "1 Day",
    summary: "Launching to production on serverless edge CDNs.",
    bullets: [
      "Link custom domain with Vercel/AWS CDN",
      "Generate public sitemap & robots file",
      "Configure SSL certificates & DNS routing",
      "Inject structured schema metadata",
    ],
    deliverables: [
      "Live Production Website URL",
      "Registered Sitemap Index",
      "Google Analytics Dashboard Setup",
    ],
    businessValue: "Launches your website globally on CDN servers, ensuring near-instant page load speeds.",
  },
  {
    title: "Support",
    iconName: "wrench",
    duration: "Ongoing",
    summary: "Providing proactive monitoring and performance updates.",
    bullets: [
      "Monitor uptime & API health checks",
      "Configure periodic security updates",
      "Deliver custom feature enhancements",
      "Optimize loading speeds as content grows",
    ],
    deliverables: [
      "Monthly Maintenance Reports",
      "Dedicated Slack Channels Support",
      "Proactive Bug Hotfixes",
    ],
    businessValue: "Protects your investment by keeping the platform secure, optimized, and adapted to user needs.",
  },
];

const TECHNOLOGIES = [
  {
    name: "Next.js",
    reason:
      "Next.js is the React framework for the web. It enables static site generation (SSG) and server-side rendering (SSR), yielding superior load speeds and top-tier SEO performance compared to single-page client apps.",
  },
  {
    name: "React",
    reason:
      "React is a component-driven JavaScript library. It lets our engineers build modular, reusable visual blocks that make the interface fast, scalable, and easy to maintain over long-term product lifecycles.",
  },
  {
    name: "TypeScript",
    reason:
      "TypeScript adds static type definitions on top of JavaScript. By checking code rules during compile-time, it prevents production crashes, improves developer productivity, and guarantees enterprise-grade stability.",
  },
  {
    name: "Tailwind CSS",
    reason:
      "Tailwind is a utility-first styling framework. It allows us to build custom responsive grids, fluid animations, and premium dark/light interfaces without bloated styling sheets or slow runtime execution times.",
  },
  {
    name: "Sanity CMS",
    reason:
      "Sanity is a real-time headless content platform. We configure custom editor workspaces, allowing your marketing team to edit homepage layouts and landing copy without modifying the core Next.js application code.",
  },
  {
    name: "Supabase & Firebase",
    reason:
      "We utilize serverless database layers to handle user profiles, real-time sync, auth rules, and cloud assets. This reduces custom server overhead and guarantees secure, instant read/write transactions.",
  },
  {
    name: "Node.js",
    reason:
      "For complex backend endpoints and database queries, we run high-performance asynchronous Node.js runtimes. This processes bulk transactional workloads securely and handles custom API logic.",
  },
  {
    name: "Vercel & AWS Edge",
    reason:
      "We deploy websites to edge caches. Pages are served instantly from the geographic location closest to your users, guaranteeing fast load times whether they browse from Palakkad, Kochi, or abroad.",
  },
];

const BENEFITS = [
  {
    title: "Rank Higher on Search Engines",
    desc: "Our technical SEO optimizations, schema marks, and semantic codes align with Google's quality crawlers, elevating your local search visibility.",
  },
  {
    title: "Zero Server Maintenance Overhead",
    desc: "Since pages are rendered statically and hosted on edge CDNs, you never have to deal with manual server restarts, CPU overloads, or configuration issues.",
  },
  {
    title: "Uncompromising Loading Speeds",
    desc: "By removing render-blocking assets, compiling script sizes, and optimizing image files, we achieve lightning-fast loading speeds on mobile devices.",
  },
];

const FAQS = [
  {
    question: "Why does my business need professional web engineering?",
    answer:
      "A professional website acts as your primary digital storefront. It builds trust, communicates your brand value, and ensures that customers looking for your services on Google or social media find a secure, credible platform instead of a broken generic page.",
  },
  {
    question: "How much does web engineering cost in Kerala?",
    answer:
      "The cost of developing a custom web engineering platform depends entirely on the features, integrations, page volume, and CMS requirements. Custom Next.js projects require dedicated engineering but offer extreme long-term value, high security, and near-zero hosting costs compared to heavy subscription templates.",
  },
  {
    question: "How long does it take to build a custom web platform?",
    answer:
      "Timeline spans depend on complexity. A custom corporate or business landing page project typically takes 2 to 4 weeks. Larger web applications with backend portals, client dashboards, or advanced database integrations may take 6 to 12 weeks from discovery to final deploy.",
  },
  {
    question: "What is the difference between custom web engineering and a template site?",
    answer:
      "Template-based websites (like generic WordPress or Wix) contain bloated, pre-written code, resulting in slow load speeds, poor security, and restrictive layout changes. Custom Next.js sites are coded from scratch, resulting in flawless performance, custom designs, robust security, and top-tier SEO flexibility.",
  },
  {
    question: "Will my website be mobile-friendly and responsive?",
    answer:
      "Yes, 100%. We employ mobile-first CSS grids and fluid layouts. Every screen is meticulously tested on multiple physical mobile screens, tablets, and wide-screen desktops to ensure readability and flawless interaction transitions.",
  },
  {
    question: "How do you ensure my website is optimized for SEO?",
    answer:
      "We configure structural technical SEO. This includes writing clean semantic HTML code, setting custom titles and descriptions for every page, automating sitemap generation, indexing robots directives, and implementing JSON-LD breadcrumb and service schema codes.",
  },
  {
    question: "Do you provide headless CMS integration?",
    answer:
      "Yes. We integrate headless CMS platforms like Sanity CMS. This gives your business team a user-friendly dashboard to edit text, post blogs, and update media. The content is compiled statically at build-time, preserving high speed.",
  },
  {
    question: "Can you migrate my legacy site to Next.js or React?",
    answer:
      "Absolutely. We specialize in legacy migrations. We will extract your current database contents, redesign the visual assets, build a high-performance React/Next.js frontend, and configure 301 redirects to ensure your legacy search engine ranks are preserved.",
  },
  {
    question: "Do you offer maintenance and support after launch?",
    answer:
      "Yes. Our partnership continues post-launch. We provide regular code audits, next-gen library upgrades, performance optimizations, bug fixes, and feature expansions to ensure your platform scales alongside your company's growth.",
  },
  {
    question: "How do we get started with your web engineering services?",
    answer:
      "Simply book a free consultation or fill out the contact form. Our engineering team will arrange a discovery call to discuss your goals, review technical requirements, and deliver a tailored roadmap and quotation.",
  },
];

export default async function WebEngineeringPage() {
  let mappedProjects: Project[] = [];
  try {
    const dbProjects = await getPublishedProjects();
    const webProjects = dbProjects.filter((p) => mapDbCategoryToPublic(p.category) === "Web").slice(0, 6);

    mappedProjects = webProjects.map((p) => {
      const publicCategory = mapDbCategoryToPublic(p.category);
      return {
        id: p.id,
        title: p.title,
        category: publicCategory,
        imageUrl:
          p.coverImage ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
        tags: p.technologies.map((t) => t.name),
        href: `/portfolio/${p.slug}`,
        description: p.shortDescription,
        featured: p.featured,
      };
    });
  } catch (error) {
    console.error("Error loading projects for Web Engineering page:", error);
  }

  return (
    <ServiceLandingPageTemplate
      badge="WEB ENGINEERING KERALA"
      h1="Web Engineering"
      heroDescription="We build fast, high-performance, and SEO-friendly web applications that convert visitors into customers. Leverage our React, Next.js, and headless CMS expertise to grow your digital presence with speed and scale."
      serviceName="Web Engineering"
      serviceUrl="/services/web-engineering"
      metaDescription="Looking for a premier Web Engineering Company in Kerala? HexaKode designs custom, responsive, and SEO-friendly web applications using React, Next.js, and headless CMS."
      challenges={CHALLENGES}
      whyChooseDesc="At HexaKode, we do not believe in cheap templates. We write bespoke, performance-tuned React and Next.js codes tailored to your business operations."
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

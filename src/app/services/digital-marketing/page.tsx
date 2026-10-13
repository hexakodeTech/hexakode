import React from "react";
import { Metadata } from "next";
import ServiceLandingPageTemplate from "@/components/services/ServiceLandingPageTemplate";
import Footer from "@/components/layout/Footer";
import { getPublishedProjects } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";
import { Project } from "@/types/home";

export const metadata: Metadata = {
  title: "Digital Marketing Company in Kerala | SEO & Ads | HexaKode",
  description:
    "HexaKode provides data-driven Digital Marketing services in Kerala including Technical SEO, Google Ads, Local SEO, Social Media Marketing & conversion campaigns.",
  keywords: [
    "Digital Marketing Kerala",
    "Digital Marketing Company Kerala",
    "SEO Services Kerala",
    "Local SEO Kerala",
    "Social Media Marketing Kerala",
    "Google Ads Kerala",
    "Performance Marketing Kerala",
    "Online Marketing Kerala",
    "Website SEO",
    "Technical SEO",
    "Content Marketing",
    "Instagram Marketing",
    "Facebook Ads",
    "Search Engine Optimization",
    "Digital Growth",
    "Marketing Agency Kerala",
  ],
  alternates: {
    canonical: "/services/digital-marketing",
  },
  openGraph: {
    title: "Digital Marketing Company in Kerala | SEO & Ads | HexaKode",
    description:
      "Drive qualified leads and accelerate revenue with data-driven SEO, Google Ads, local search, and performance marketing strategies in Kerala.",
    url: "/services/digital-marketing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Company in Kerala | SEO & Ads | HexaKode",
    description:
      "Drive qualified leads and accelerate revenue with data-driven SEO, Google Ads, local search, and performance marketing strategies in Kerala.",
  },
};

const CHALLENGES = [
  {
    title: "Invisible on Search Engines & Local Google Maps",
    description:
      "Many local Kerala businesses lose valuable leads because their website lacks structured technical SEO and local Google Maps optimization, causing potential customers to find competitors instead.",
    iconName: "search",
  },
  {
    title: "High Ad Spend with Low Conversion Rates",
    description:
      "Running ad campaigns without landing page optimization or conversion tracking leads to wasted budget. Without precise audience targeting, cost-per-lead spikes while conversion numbers remain flat.",
    iconName: "trending-down",
  },
  {
    title: "Inconsistent Social Media Reach & Engagement",
    description:
      "Posting irregularly without a cohesive content strategy fails to build brand authority. Modern audiences require engaging visuals, targeted social campaigns, and strategic community management.",
    iconName: "users",
  },
  {
    title: "Lack of Accurate Analytics & Unclear ROI Tracking",
    description:
      "Without properly configured Google Analytics 4, Google Search Console, and conversion tracking pixels, businesses operate blind—unable to identify which channels generate real business revenue.",
    iconName: "activity",
  },
];

const WHY_CHOOSE_POINTS = [
  {
    title: "Transparent Reporting",
    desc: "We provide clear, real-time dashboards and detailed monthly performance reports so you always know your traffic growth, conversion rates, and return on ad spend (ROAS).",
  },
  {
    title: "Data-Driven Decisions",
    desc: "Every strategy is backed by user behavioral metrics, search intent data, and competitor analysis—never guesses or vanity metrics like un-targeted impressions.",
  },
  {
    title: "Local Kerala Business Expertise",
    desc: "We understand the nuances of the local market in Kerala as well as international digital channels, crafting localized campaigns that resonate with regional customers.",
  },
  {
    title: "SEO Best Practices & Technical Rigor",
    desc: "Our engineering background ensures your website passes Core Web Vitals, mobile usability audits, schema structured data, and modern Google search guidelines.",
  },
  {
    title: "Continuous Optimization",
    desc: "Digital marketing is never set-and-forget. We perform ongoing A/B testing, keyword refinement, ad copy tweaks, and bid adjustments to continuously lower customer acquisition costs.",
  },
  {
    title: "ROI-Focused Campaigns",
    desc: "Our ultimate objective is growing your revenue. We design end-to-end sales funnels that turn search engine clicks and ad views into qualified inbound leads and phone calls.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Discovery",
    iconName: "search",
    duration: "1–2 Days",
    summary: "Auditing your current online footprint, target market, and revenue goals.",
    bullets: [
      "Analyze current organic traffic & search ranks",
      "Evaluate existing Google Ads & social accounts",
      "Define target customer personas & local demographics",
      "Establish primary conversion KPIs & baseline metrics",
    ],
    deliverables: [
      "Digital Marketing Health Audit",
      "Competitor Landscape Report",
      "Target Audience Definition Sheet",
    ],
    businessValue: "Identifies quick-win growth opportunities and establishes benchmarks for measuring marketing ROI.",
  },
  {
    title: "Market Research",
    iconName: "compass",
    duration: "2–3 Days",
    summary: "Deep-diving into high-intent keywords, search volume, and ad positioning.",
    bullets: [
      "Identify high-converting transactional keywords",
      "Map user search intent across buyer journey stages",
      "Analyze competitor ad copy & bidding strategies",
      "Uncover untapped local search opportunities in Kerala",
    ],
    deliverables: [
      "Comprehensive Keyword Strategy Map",
      "Ad Competitor Intelligence Brief",
      "Content Gap Analysis",
    ],
    businessValue: "Ensures marketing spend is concentrated on keywords and channels with the highest purchase intent.",
  },
  {
    title: "Strategy Formulation",
    iconName: "clipboard-list",
    duration: "2–3 Days",
    summary: "Building a multi-channel digital roadmap tailored to your growth goals.",
    bullets: [
      "Structure multi-tier sales & lead capture funnels",
      "Plan SEO content calendars & location page maps",
      "Design Google Search & Display campaign budgets",
      "Outline Instagram & Facebook creative ad concepts",
    ],
    deliverables: [
      "Multi-Channel Digital Strategy Document",
      "Content & Ad Creative Calendar",
      "Conversion Tracking Blueprint",
    ],
    businessValue: "Provides a structured execution roadmap connecting every ad dollar to concrete business milestones.",
  },
  {
    title: "Campaign Setup",
    iconName: "rocket",
    duration: "3–5 Days",
    summary: "Configuring technical tracking, ad accounts, and landing page funnels.",
    bullets: [
      "Implement GA4, Google Tag Manager & Meta Pixel",
      "Build high-converting responsive landing pages",
      "Set up Google Ads search groups & keyword match types",
      "Optimize Google Business Profile & local citations",
    ],
    deliverables: [
      "Fully Configured Ad Accounts & Funnels",
      "Verified Conversion Pixel Event Setup",
      "Optimized Google Business Profile",
    ],
    businessValue: "Guarantees 100% accurate tracking and high-converting touchpoints prior to launching paid campaigns.",
  },
  {
    title: "Continuous Optimization",
    iconName: "gauge",
    duration: "Ongoing",
    summary: "Relentlessly testing and tweaking campaigns to maximize performance.",
    bullets: [
      "A/B test ad copy, headlines, and call-to-actions",
      "Refine keyword bids & eliminate negative keywords",
      "Optimize website landing page conversion rates",
      "Expand backlink acquisition & technical SEO fixes",
    ],
    deliverables: [
      "Weekly Campaign Optimization Logs",
      "A/B Test Outcome Analysis",
      "Refined Keyword & Placement Exclusions",
    ],
    businessValue: "Consistently lowers your customer acquisition cost (CAC) and boosts return on ad spend over time.",
  },
  {
    title: "Monthly Reporting",
    iconName: "activity",
    duration: "Monthly",
    summary: "Delivering transparent performance insights and strategic growth reviews.",
    bullets: [
      "Review organic search rankings & traffic growth",
      "Detail lead acquisition counts & cost per lead",
      "Present transparent ad spend vs revenue generated",
      "Plan next month's strategic expansion priorities",
    ],
    deliverables: [
      "Executive Marketing Performance Dashboard",
      "Monthly Lead & Sales Conversion Audit",
      "Strategic Growth Recommendations",
    ],
    businessValue: "Provides total accountability and clear evidence of business revenue growth attributable to marketing.",
  },
];

const TECHNOLOGIES = [
  {
    name: "Search Engine Optimization (SEO)",
    reason:
      "We execute end-to-end technical, on-page, and off-page SEO strategies to secure top organic ranks on Google. From site speed tuning and schema markup to backlinks and content optimization, we drive high-intent organic traffic that grows steadily over time.",
  },
  {
    name: "Local SEO & Google Business Profile",
    reason:
      "Dominate local search results in Kerala. We optimize your Google Business Profile, manage local directory citations, create targeted location landing pages, and build review strategies to get your business featured prominently on Google Maps.",
  },
  {
    name: "Google Ads (PPC & Remarketing)",
    reason:
      "Capture immediate high-intent buyers searching for your services. We create data-driven Search Ads, Display banners, and smart Remarketing campaigns with strict budget controls and conversion tracking to maximize ROI.",
  },
  {
    name: "Social Media Marketing",
    reason:
      "Build brand authority and engage your audience across Instagram, Facebook, and LinkedIn. We produce eye-catching graphic content, run laser-targeted audience campaigns, and manage customer interactions that build brand loyalty.",
  },
  {
    name: "Content Marketing & Copywriting",
    reason:
      "High-quality content drives search engines and converts users. We author authoritative SEO blog articles, landing page copy, service guides, and email newsletters that establish your company as an industry leader.",
  },
  {
    name: "Analytics & Conversion Tracking",
    reason:
      "We configure Google Analytics 4, Google Search Console, Tag Manager, and custom conversion event pixels. Every campaign metric is tracked with surgical precision so you know exactly which keywords and ads generate sales.",
  },
];

const BENEFITS = [
  {
    title: "Predictable Lead Generation Pipeline",
    desc: "Transform your digital channels into a continuous source of qualified inbound leads and customer calls.",
  },
  {
    title: "Dominant Local Search Visibility",
    desc: "Ensure regional customers in Kerala and nearby areas find your business first when searching for relevant services.",
  },
  {
    title: "Maximized Ad Budget Efficiency",
    desc: "Eliminate wasted budget on non-converting keywords with active campaign optimization and conversion funnel tuning.",
  },
];

const FAQS = [
  {
    question: "How long does SEO take to show measurable results?",
    answer:
      "Organic SEO is a long-term compound growth engine. Technical fixes and local Google Business Profile improvements often yield noticeable local visibility boosts within 4 to 8 weeks. Comprehensive organic ranking growth on competitive keywords typically takes 3 to 6 months. However, once established, organic rankings deliver sustainable, low-cost leads for years.",
  },
  {
    question: "How much does digital marketing cost in Kerala?",
    answer:
      "Digital marketing costs vary depending on the scope of services required—such as whether you need full-service SEO, Google Ads management, social media content creation, or a combination. HexaKode offers flexible, transparent packages tailored to small local businesses as well as growing enterprises. Contact us for a custom quote aligned with your revenue goals.",
  },
  {
    question: "Is Google Ads better than organic SEO?",
    answer:
      "Both channels complement each other. Google Ads provides immediate traffic and lead flow within hours of launch, making it ideal for immediate sales or seasonal offers. Organic SEO builds long-term domain authority and delivers sustained, free organic leads without ongoing cost-per-click charges. We often recommend a hybrid strategy for maximum ROI.",
  },
  {
    question: "Do you provide monthly marketing analytics reports?",
    answer:
      "Yes, 100%. Transparency is one of our core pillars. Every month, you receive a detailed, easy-to-understand performance report highlighting organic traffic growth, keyword ranks, Google Ads performance, leads generated, and cost per acquisition.",
  },
  {
    question: "Can you help local Kerala businesses rank on Google Maps?",
    answer:
      "Absolutely. Local SEO is one of our key specialties. We optimize your Google Business Profile, manage local citations, implement geo-targeted schema markup, and assist in building authentic customer review strategies to rank your business in local Google Maps search packs.",
  },
  {
    question: "Do you manage social media accounts like Instagram and Facebook?",
    answer:
      "Yes. Our social media marketing services include strategy formulation, content calendar creation, high-quality graphic posts, video reels, targeted social ad campaigns (Meta Ads), and community engagement management.",
  },
  {
    question: "What is technical SEO and why is it important?",
    answer:
      "Technical SEO refers to backend website optimizations that help search engine bots crawl, index, and understand your website efficiently. This includes optimizing site loading speed (Core Web Vitals), mobile responsiveness, SSL security, XML sitemaps, canonical tags, and structured JSON-LD schema data.",
  },
  {
    question: "How do you measure the ROI of a digital marketing campaign?",
    answer:
      "We measure ROI by tracking concrete conversion events—such as form submissions, phone call clicks, booking confirmations, and direct online sales—against total campaign spend (ad spend + management fees). We focus on business growth metrics like Cost Per Lead (CPL) and Return on Ad Spend (ROAS).",
  },
  {
    question: "Will digital marketing work for B2B companies?",
    answer:
      "Yes. B2B digital marketing relies heavily on targeted technical SEO, professional LinkedIn marketing, content authority assets (case studies, whitepapers), and high-intent Google Search ads. We help B2B companies connect directly with decision-makers.",
  },
  {
    question: "How do we get started with HexaKode digital marketing services?",
    answer:
      "Getting started is simple. Book a free consultation or contact our team. We will conduct a baseline digital audit of your business, analyze your market competitors, and present a custom growth strategy during a discovery call.",
  },
];

export default async function DigitalMarketingPage() {
  let mappedProjects: Project[] = [];
  try {
    const dbProjects = await getPublishedProjects();
    const featuredProjects = dbProjects.slice(0, 6);

    mappedProjects = featuredProjects.map((p) => {
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
    console.error("Error loading projects for Digital Marketing page:", error);
  }

  return (
    <ServiceLandingPageTemplate
      badge="DIGITAL MARKETING KERALA"
      h1="Digital Marketing"
      heroDescription="Grow your business with data-driven digital marketing. We help ambitious companies attract qualified customers through technical SEO, local search optimization, Google Ads, social media marketing, and high-converting sales funnels."
      serviceName="Digital Marketing & SEO"
      serviceUrl="/services/digital-marketing"
      metaDescription="HexaKode provides data-driven Digital Marketing services in Kerala including Technical SEO, Google Ads, Local SEO, Social Media Marketing & conversion campaigns."
      challenges={CHALLENGES}
      whyChooseDesc="At HexaKode, we do not rely on vanity impressions. We execute data-backed marketing strategies engineered to increase inbound lead flow and maximize your return on investment."
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

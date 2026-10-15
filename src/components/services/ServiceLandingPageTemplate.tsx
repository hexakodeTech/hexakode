"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, CheckCircle, Globe, Gauge, TrendingDown, ShieldAlert, Smartphone, Activity, Layers, Users, Compass, ShoppingCart, LayoutGrid, EyeOff, Search, ClipboardList, Palette, Code, TestTube, Rocket, Wrench, TrendingUp, Target, Megaphone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import Card from "../ui/Card";
import ProjectCard from "../common/ProjectCard";
import PrimaryButton from "../common/PrimaryButton";
import { cn } from "@/lib/utils";
import { useDemoModal } from "../common/DemoModal";
import { Project } from "@/types/home";
import { fadeUp, staggerContainer } from "@/lib/motion";
import CTASection from "./CTASection";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { constructServiceJsonLd, constructFaqPageJsonLd, safeJsonLdStringify } from "@/lib/seo";

export interface Challenge {
  title: string;
  description: string;
  iconName: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  gauge: Gauge,
  "trending-down": TrendingDown,
  "shield-alert": ShieldAlert,
  smartphone: Smartphone,
  activity: Activity,
  layers: Layers,
  users: Users,
  compass: Compass,
  "shopping-cart": ShoppingCart,
  "layout-grid": LayoutGrid,
  "eye-off": EyeOff,
  search: Search,
  "clipboard-list": ClipboardList,
  palette: Palette,
  code: Code,
  "test-tube": TestTube,
  rocket: Rocket,
  wrench: Wrench,
  "trending-up": TrendingUp,
  target: Target,
  megaphone: Megaphone,
};

export interface Technology {
  name: string;
  reason: string;
  highlights?: string[];
  whyWeUse?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  iconName: string;
  duration: string;
  summary: string;
  bullets: string[];
  deliverables: string[];
  businessValue: string;
}

export interface ServiceLandingPageTemplateProps {
  badge: string;
  h1: string;
  heroDescription: string;
  serviceName: string;
  serviceUrl: string;
  metaDescription: string;
  serviceType?: string;
  serviceImage?: string;
  
  challenges: Challenge[];
  whyChooseDesc: string;
  whyChoosePoints: { title: string; desc: string }[];
  processSteps: ProcessStep[];
  technologies: Technology[];
  benefits: { title: string; desc: string }[];
  faqs: FAQItem[];
  
  projects: Project[]; // Already filtered by the caller
  otherServices?: { name: string; url: string }[];
  footer?: React.ReactNode;
}

const SERVICE_INFOS = {
  "/services/web-development": {
    name: "Website Development",
    desc: "High-performance web apps built with Next.js & React.",
    iconName: "globe",
  },
  "/services/mobile-app-development": {
    name: "Mobile App Development",
    desc: "Cross-platform Android & iOS apps powered by Flutter.",
    iconName: "smartphone",
  },
  "/services/ui-ux-design": {
    name: "UI/UX Design",
    desc: "Intuitive research, wireframes, and design systems in Figma.",
    iconName: "compass",
  },
  "/services/digital-marketing": {
    name: "Digital Marketing",
    desc: "SEO, Google Ads, local search & performance campaigns that generate qualified leads.",
    iconName: "trending-up",
  },
};

const SERVICE_PARAM_MAP: Record<string, string> = {
  "/services/web-development": "website-development",
  "/services/mobile-app-development": "mobile-app-development",
  "/services/ui-ux-design": "ui-ux-design",
  "/services/digital-marketing": "digital-marketing",
};

const SERVICE_TYPE_DEFAULTS: Record<string, string> = {
  "/services/web-development": "Website Development & Web Engineering",
  "/services/mobile-app-development": "Mobile Application Development",
  "/services/ui-ux-design": "UI/UX & Product Design",
  "/services/digital-marketing": "Digital Marketing & Technical SEO",
};

const SERVICE_IMAGE_DEFAULTS: Record<string, string> = {
  "/services/web-development": "https://hexakode.in/og-web-development.png",
  "/services/mobile-app-development": "https://hexakode.in/og-mobile-development.png",
  "/services/ui-ux-design": "https://hexakode.in/og-ui-ux-design.png",
  "/services/digital-marketing": "https://hexakode.in/og-digital-marketing.png",
};

const INDUSTRIES = [
  { name: "Manufacturing", icon: "🏭", desc: "Automating factory floors and supply chains." },
  { name: "Healthcare", icon: "🏥", desc: "Compliant applications and patient portals." },
  { name: "Retail & E-commerce", icon: "🛍️", desc: "High-performance storefronts and shopping experiences." },
  { name: "Education", icon: "🎓", desc: "Learning management systems and school trackers." },
  { name: "Hospitality", icon: "🏨", desc: "Reservation platforms and booking engines." },
  { name: "Startups", icon: "🚀", desc: "Rapid prototyping and scalable infrastructure." },
  { name: "Government", icon: "🏛️", desc: "Secure public services and citizen portals." },
  { name: "Professional Services", icon: "💼", desc: "Enterprise operations and dashboard managers." },
];

export default function ServiceLandingPageTemplate({
  badge,
  h1,
  heroDescription,
  serviceName,
  serviceUrl,
  metaDescription,
  serviceType,
  serviceImage,
  challenges,
  whyChooseDesc,
  whyChoosePoints,
  processSteps,
  technologies,
  benefits,
  faqs,
  projects,
  footer,
}: ServiceLandingPageTemplateProps) {
  const { openDemoModal } = useDemoModal();
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  // Dynamically calculate related services to display
  const relatedServices = Object.entries(SERVICE_INFOS)
    .filter(([url]) => url !== serviceUrl)
    .map(([url, info]) => ({
      url,
      ...info,
    }));

  const serviceQueryParam = SERVICE_PARAM_MAP[serviceUrl] || "";
  const contactHref = serviceQueryParam ? `/contact?service=${serviceQueryParam}` : "/contact";
  const hasPortfolio = projects && projects.length > 0;

  // JSON-LD Structured Data
  const effectiveServiceType =
    serviceType || SERVICE_TYPE_DEFAULTS[serviceUrl] || serviceName;
  const effectiveServiceImage =
    serviceImage || SERVICE_IMAGE_DEFAULTS[serviceUrl];

  const serviceSchema = constructServiceJsonLd({
    name: serviceName,
    url: serviceUrl,
    description: metaDescription || heroDescription,
    serviceType: effectiveServiceType,
    image: effectiveServiceImage,
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: serviceName, href: serviceUrl },
  ];

  const faqSchema = constructFaqPageJsonLd({
    path: serviceUrl,
    faqs: faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  });

  return (
    <>
      {/* Dynamic JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-[32px] md:pt-[20px]">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 md:py-32 overflow-hidden bg-white">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-[80px] pointer-events-none" />

          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 text-left">
                {/* Visible Breadcrumbs & BreadcrumbList JSON-LD */}
                <Breadcrumbs items={breadcrumbItems} className="mb-6" />

                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-secondary-container text-primary border border-secondary-container/80">
                  {badge}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-dark tracking-tight leading-tight">
                  {h1}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-500 font-normal leading-relaxed max-w-3xl">
                  {heroDescription}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => openDemoModal({ source: `${serviceName} Hero`, inquiryType: "Technical Discovery Call" })}
                    className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 bg-primary text-on-primary hover:shadow-lg transition-all duration-300 btn-shimmer text-base font-semibold cursor-pointer"
                  >
                    Book a Free Consultation
                  </button>
                  {hasPortfolio && (
                    <a
                      href="#portfolio"
                      className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 border border-outline-variant/40 text-navy-dark hover:bg-slate-50 transition-all duration-300 text-base font-semibold cursor-pointer"
                    >
                      View Our Work
                    </a>
                  )}
                </div>
                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-6">
                  <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Trusted Technology Partner
                  </p>
                  <div className="flex gap-4 text-sm font-bold text-navy-dark/70 items-center">
                    <span>⚡ ISO compliant standards</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>🤝 100% transparent delivery</span>
                  </div>
                </div>
              </div>

              {/* Graphic Visual Block */}
              <div className="lg:col-span-4 hidden lg:flex justify-center relative">
                <div className="w-72 h-72 rounded-2xl bg-gradient-to-tr from-primary/10 to-secondary/10 border border-outline-variant/30 flex items-center justify-center p-8 relative shadow-premium-hover">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl -z-10" />
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                      ✓
                    </div>
                    <p className="font-bold text-navy-dark text-lg">Production Ready</p>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      We optimize every line of code for performance, security, and responsive layouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* BUSINESS CHALLENGES */}
        <Section id="challenges" variant="muted" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Common Business Challenges We Address"
                  subtitle="We help companies navigate technical roadblocks to unlock business growth and capture their market potential."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {challenges.map((challenge, idx) => {
                  const ChallengeIcon = ICON_MAP[challenge.iconName] || Globe;
                  return (
                    <motion.div key={idx} variants={fadeUp} className="h-full">
                      <Card
                        variant="light"
                        className="p-8 h-full flex flex-col items-start border-outline-variant/30 hover:border-secondary/40 transition-all duration-300"
                      >
                        <div className="text-secondary mb-6 inline-block p-3 rounded-xl bg-secondary-container text-primary border border-secondary-container/50">
                          <ChallengeIcon className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-lg font-bold text-navy-dark mb-3 tracking-tight">
                          {challenge.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {challenge.description}
                        </p>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* WHY HEXAKODE */}
        <Section id="why-hexakode" variant="white" spacing="large">
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Why Partner with HexaKode?"
                  subtitle={whyChooseDesc}
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {whyChoosePoints.map((point, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <div className="p-8 h-full bg-white rounded-2xl border border-slate-100 flex flex-col justify-start hover-lift hover-glow">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 font-bold text-sm">
                        ✓
                      </div>
                      <h3 className="text-lg font-bold text-navy-dark mb-3 tracking-tight">
                        {point.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* DEVELOPMENT PROCESS */}
        <Section id="process" variant="muted" spacing="large" className="border-t border-outline-variant/10">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Our Engineering Process"
                  subtitle="How we guide your custom solution from discovery to continuous long-term support."
                  align="center"
                  theme="light"
                />
              </motion.div>

              {/* Desktop Timeline Layout */}
              <div className="hidden md:block w-full mt-8">
                {/* Horizontal Progress Tracker */}
                <div
                  role="tablist"
                  aria-label="Engineering process steps"
                  className="relative flex justify-between items-center w-full max-w-4xl mx-auto mb-20 outline-none"
                  onKeyDown={(e) => {
                    let nextIndex = activeIndex;
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      nextIndex = (activeIndex + 1) % processSteps.length;
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      nextIndex = (activeIndex - 1 + processSteps.length) % processSteps.length;
                    } else {
                      return;
                    }
                    setActiveIndex(nextIndex);
                    const buttons = e.currentTarget.querySelectorAll("button");
                    (buttons[nextIndex] as HTMLElement)?.focus();
                  }}
                >
                  {/* Connector Bar Background */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                  
                  {/* Connector Bar Active Progress */}
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300 ease-out"
                    style={{
                      width: `${(activeIndex / (processSteps.length - 1)) * 100}%`,
                    }}
                  />
                  
                  {/* Step Buttons */}
                  {processSteps.map((step, idx) => {
                    const StepIcon = ICON_MAP[step.iconName] || Globe;
                    const isActive = activeIndex === idx;
                    const isCompleted = idx < activeIndex;
                    
                    return (
                      <button
                        key={idx}
                        role="tab"
                        id={`process-tab-${idx}`}
                        aria-selected={isActive}
                        aria-controls={`process-panel-${idx}`}
                        onClick={() => setActiveIndex(idx)}
                        className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20",
                            isActive
                              ? "bg-primary border-primary text-white shadow-premium scale-110"
                              : isCompleted
                              ? "bg-white border-primary text-primary"
                              : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600"
                          )}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="absolute top-14 text-center w-32 left-1/2 -translate-x-1/2">
                          <span
                            className={cn(
                              "text-xs font-semibold block transition-colors duration-200",
                              isActive ? "text-primary font-bold" : "text-slate-500"
                            )}
                          >
                            {step.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Content Panel */}
                <div className="relative min-h-[350px] w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      id={`process-panel-${activeIndex}`}
                      role="tabpanel"
                      aria-labelledby={`process-tab-${activeIndex}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-premium max-w-4xl mx-auto w-full text-left"
                    >
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl md:text-5xl font-extrabold text-slate-200 select-none">
                            {String(activeIndex + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3 className="text-2xl font-bold text-navy-dark">
                              {processSteps[activeIndex].title}
                            </h3>
                            <p className="text-slate-500 text-sm mt-0.5 font-medium">
                              {processSteps[activeIndex].summary}
                            </p>
                          </div>
                        </div>
                        
                        {/* Estimated Duration Badge */}
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary-container text-primary border border-secondary-container/50">
                          <span>⏱</span>
                          <span>{processSteps[activeIndex].duration}</span>
                        </span>
                      </div>

                      {/* Grid of details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Key Activities */}
                        <div>
                          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
                            Key Activities
                          </p>
                          <ul className="space-y-3">
                            {processSteps[activeIndex].bullets.map((bullet, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm">
                                <span className="text-secondary font-bold select-none mt-0.5">✔</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Right Column: Deliverables & Business Value */}
                        <div className="flex flex-col justify-between gap-6">
                          <div>
                            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
                              Deliverables
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                              {processSteps[activeIndex].deliverables.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100/50 text-slate-700 font-semibold"
                                >
                                  <span className="text-emerald-500 font-bold">✔</span>
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Business Value Box */}
                          <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                            <p className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1">
                              Why this matters
                            </p>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                              {processSteps[activeIndex].businessValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile Timeline Layout (Vertical Accordion) */}
              <div className="block md:hidden w-full mt-6">
                <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
                  {processSteps.map((step, idx) => {
                    const StepIcon = ICON_MAP[step.iconName] || Globe;
                    const isOpen = activeIndex === idx;
                    
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-2xl border transition-all duration-300 bg-white overflow-hidden",
                          isOpen
                            ? "border-primary shadow-premium"
                            : "border-slate-100 shadow-sm hover:border-slate-200"
                        )}
                      >
                        {/* Accordion Header */}
                        <button
                          type="button"
                          onClick={() => setActiveIndex(isOpen ? -1 : idx)}
                          className="w-full flex justify-between items-center p-5 text-left outline-none cursor-pointer"
                          aria-expanded={isOpen}
                          aria-controls={`step-accordion-content-${idx}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs shrink-0 transition-colors",
                                isOpen
                                  ? "bg-primary border-primary text-white"
                                  : "bg-slate-50 border-slate-200 text-slate-500"
                              )}
                            >
                              <StepIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase">
                                Step {idx + 1}
                              </span>
                              <p className="font-bold text-navy-dark text-base">
                                {step.title}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-secondary-container text-primary border border-secondary-container/40 shrink-0">
                              {step.duration}
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300",
                                isOpen ? "rotate-180 text-primary" : ""
                              )}
                            />
                          </div>
                        </button>

                        {/* Accordion Content */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`step-accordion-content-${idx}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{
                                height: "auto",
                                opacity: 1,
                                transition: { height: { duration: 0.25, ease: "easeOut" }, opacity: { duration: 0.2 } },
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                                transition: { height: { duration: 0.2, ease: "easeIn" }, opacity: { duration: 0.15 } },
                              }}
                              className="overflow-hidden border-t border-slate-100"
                            >
                              <div className="p-5 text-left bg-slate-50/40">
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                                  {step.summary}
                                </p>
                                
                                {/* Activities */}
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                                  Key Activities
                                </p>
                                <ul className="space-y-2 mb-4">
                                  {step.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx} className="flex items-start gap-2 text-slate-600 text-xs">
                                      <span className="text-secondary font-bold">✔</span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* Deliverables */}
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                                  Deliverables
                                </p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {step.deliverables.map((item, dIdx) => (
                                    <span
                                      key={dIdx}
                                      className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded bg-white border border-slate-100 text-slate-700 font-semibold"
                                    >
                                      <span className="text-emerald-500 font-bold">✔</span>
                                      {item}
                                    </span>
                                  ))}
                                </div>

                                {/* Business Value */}
                                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                                  <p className="text-[9px] font-bold text-primary tracking-wider uppercase mb-1">
                                    Why this matters
                                  </p>
                                  <p className="text-slate-600 text-xs font-medium leading-relaxed">
                                    {step.businessValue}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom CTA Block */}
              <div className="flex flex-col items-center justify-center text-center mt-16 bg-slate-50/50 rounded-3xl p-8 md:p-10 border border-slate-100/60 max-w-2xl mx-auto relative overflow-hidden w-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl pointer-events-none" />
                <h3 className="font-bold text-navy-dark text-lg md:text-xl mb-4 tracking-tight">
                  Ready to start your project?
                </h3>
                <PrimaryButton
                  href={contactHref}
                >
                  Start Your Project
                </PrimaryButton>
              </div>

            </motion.div>
          </Container>
        </Section>

        {/* TECHNOLOGIES SECTION */}
        <Section id="technologies" variant="white" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Core Technologies We Leverage"
                  subtitle="We select stable, modern, and highly performance-optimized stacks specifically suited for your service's demands."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {technologies.map((tech, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <div className="p-8 h-full bg-slate-50/50 rounded-2xl border border-slate-100/80 flex flex-col justify-start hover:shadow-premium transition-all duration-300">
                      <h3 className="text-xl font-bold text-navy-dark mb-3 tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        {tech.name}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        {tech.reason}
                      </p>
                      
                      {tech.highlights && tech.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                          {tech.highlights.map((h, hIdx) => (
                            <span key={hIdx} className="text-[10px] font-semibold bg-primary/5 text-primary border border-primary/10 rounded-full px-2.5 py-0.5">
                              {h}
                            </span>
                          ))}
                        </div>
                      )}

                      {tech.whyWeUse && (
                        <div className="mt-2 pt-3 border-t border-slate-100 text-xs text-slate-500 italic leading-relaxed">
                          {tech.whyWeUse}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* INDUSTRIES WE SERVE */}
        <Section id="industries" variant="muted" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Industries We Serve"
                  subtitle="Engineering solutions designed to handle complex workflows across key economic sectors."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {INDUSTRIES.map((ind, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <Card
                      variant="light"
                      className="p-6 h-full flex flex-col items-center text-center border-outline-variant/30 hover:border-secondary/40 transition-all duration-300"
                    >
                      <span className="text-3xl mb-4 select-none">{ind.icon}</span>
                      <h3 className="text-base font-bold text-navy-dark mb-2 tracking-tight">
                        {ind.name}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {ind.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* BENEFITS SECTION */}
        <Section id="benefits" variant="white" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Business Outcomes & Benefits"
                  subtitle="Invest in tech that delivers clear, measurable performance metrics and conversions."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4"
              >
                {benefits.map((benefit, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <div className="p-8 h-full bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-start">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-navy-dark mb-3 tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* PORTFOLIO GRID SECTION (Automatically Filtered) */}
        {hasPortfolio && (
          <Section id="portfolio" variant="muted" spacing="large">
            <Container>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col"
              >
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
                >
                  <SectionHeading
                    title={`Our Latest ${serviceName} Projects`}
                    subtitle={`A detailed selection of our production-ready ${serviceName.toLowerCase()} solutions.`}
                    align="left"
                    theme="light"
                    className="mb-0 max-w-2xl"
                  />
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center text-sm font-semibold text-slate-800 nav-link-underline py-1 group shrink-0 self-start sm:self-auto"
                  >
                    View All Work
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4"
                >
                  {projects.map((project) => (
                    <motion.div key={project.id} variants={fadeUp} className="h-full">
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* View All Portfolio button after projects grid */}
                <motion.div variants={fadeUp} className="flex justify-center mt-12">
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 border border-outline-variant/40 text-navy-dark hover:bg-slate-50 transition-all duration-300 text-base font-semibold group cursor-pointer"
                    prefetch={true}
                  >
                    <span>View All Portfolio</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </motion.div>
            </Container>
          </Section>
        )}

        {/* TOPICAL INTERNAL LINKING MODULE */}
        <Section id="related-services" variant="muted" spacing="large" className="border-t border-outline-variant/10">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Related Services"
                  subtitle="Explore our other engineering capabilities to accelerate your business goals."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4"
              >
                {relatedServices.map((serv, index) => {
                  const IconComponent = ICON_MAP[serv.iconName] || Globe;
                  return (
                    <motion.div key={index} variants={fadeUp} className="h-full">
                      <Link href={serv.url} className="flex flex-col h-full select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl" prefetch={true}>
                        <Card
                          variant="light"
                          className="h-full border-outline-variant/30 hover:border-secondary/40 flex flex-col p-8 justify-between hover-lift hover-glow w-full"
                        >
                          <div>
                            <div className="text-secondary mb-6 inline-block p-3 rounded-xl bg-secondary-container text-primary border border-secondary-container/50">
                              <IconComponent className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-navy-dark mb-3 tracking-tight group-hover:text-primary transition-colors">
                              {serv.name}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                              {serv.desc}
                            </p>
                          </div>
                          <span className="inline-flex items-center text-secondary hover:text-primary text-sm font-semibold transition-colors duration-200 mt-auto">
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* FAQ ACCORDION SECTION */}
        <Section id="faq" variant="white" spacing="large" className="border-t border-outline-variant/20">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  badge="FAQs"
                  title="Frequently Asked Questions"
                  subtitle="Quick, educational answers scoping real customer concerns and tech stack details."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="max-w-3xl mx-auto w-full mt-4 space-y-4"
              >
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaqIndex === idx;
                  return (
                    <details
                      key={idx}
                      name="service-faq"
                      open={isOpen}
                      className="group rounded-xl border border-outline-variant/30 bg-white/70 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-secondary/35 shadow-sm open:border-secondary/40"
                    >
                      <summary
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFaq(idx);
                        }}
                        id={`faq-btn-${idx}`}
                        aria-controls={`faq-content-${idx}`}
                        className="w-full flex justify-between items-center px-6 py-5 text-left font-headline-sm text-[16px] md:text-[18px] font-semibold text-navy-dark hover:text-primary transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-secondary/5 list-none [&::-webkit-details-marker]:hidden"
                      >
                        <span className="pr-4">{faq.question}</span>
                        <ChevronDown
                          className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ease-in-out group-open:rotate-180 group-open:text-secondary"
                          aria-hidden="true"
                        />
                      </summary>

                      <div
                        id={`faq-content-${idx}`}
                        role="region"
                        aria-labelledby={`faq-btn-${idx}`}
                        className="px-6 pb-6 pt-1 text-on-surface-variant font-body-md leading-relaxed border-t border-outline-variant/10 bg-slate-50/20"
                      >
                        {faq.answer}
                      </div>
                    </details>
                  );
                })}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* COMPACT CTA SECTION LINKING TO CENTRAL CONTACT PAGE */}
        <CTASection
          title="Ready to Build Your Next Project?"
          description="Transform your ideas into a fast, scalable, SEO-friendly digital product."
          primaryBtnText="Start Your Project"
          primaryBtnHref={contactHref}
          secondaryBtnText="Book a Free Consultation"
          className="border-t border-outline-variant/20"
        />

      </main>

      {footer}
    </>
  );
}

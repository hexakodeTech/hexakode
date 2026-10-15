"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  DollarSign,
  Palette,
  TrendingUp,
  Smartphone,
  Zap,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  Layers,
  Calendar,
} from "lucide-react";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import TechnologyChip from "../common/TechnologyChip";
import { fadeUp, staggerContainer } from "@/lib/motion";

import { COMPANY_STATS } from "@/constants/stats";

// 1. Feature Cards Data (6 Cards)
const FEATURES = [
  {
    id: "transparent-pricing",
    title: "Transparent Pricing",
    description:
      "No hidden costs. Every proposal clearly outlines deliverables, timelines, and pricing.",
    icon: DollarSign,
  },
  {
    id: "modern-ui-ux",
    title: "Modern UI/UX",
    description:
      "Interfaces designed for usability, accessibility, and higher customer engagement.",
    icon: Palette,
  },
  {
    id: "seo-ready",
    title: "SEO-Ready Websites",
    description:
      "Every website follows modern SEO best practices with clean structure and fast loading.",
    icon: TrendingUp,
  },
  {
    id: "mobile-first",
    title: "Mobile-First Development",
    description:
      "Optimised for phones, tablets, and desktops from the beginning.",
    icon: Smartphone,
  },
  {
    id: "fast-delivery",
    title: "Fast Delivery",
    description:
      "Efficient development process that helps launch your business faster.",
    icon: Zap,
  },
  {
    id: "ongoing-support",
    title: "Ongoing Support",
    description:
      "We continue supporting, maintaining, and improving your product after launch.",
    icon: HeartHandshake,
  },
];

// 2. Trust Metrics Data (4 Cards)
const METRICS = [
  {
    id: "projects",
    targetNumber: COMPANY_STATS.completedProjects.value,
    suffix: COMPANY_STATS.completedProjects.suffix,
    label: COMPANY_STATS.completedProjects.label,
    subtext: COMPANY_STATS.completedProjects.subtext,
    tags: [...COMPANY_STATS.completedProjects.tags],
    icon: CheckCircle2,
  },
  {
    id: "technologies",
    targetNumber: COMPANY_STATS.technologiesUsed.value,
    suffix: COMPANY_STATS.technologiesUsed.suffix,
    label: COMPANY_STATS.technologiesUsed.label,
    subtext: COMPANY_STATS.technologiesUsed.subtext,
    tags: [...COMPANY_STATS.technologiesUsed.tags],
    icon: Layers,
  },
  {
    id: "industries",
    targetNumber: COMPANY_STATS.industriesServed.value,
    suffix: COMPANY_STATS.industriesServed.suffix,
    label: COMPANY_STATS.industriesServed.label,
    subtext: COMPANY_STATS.industriesServed.subtext,
    tags: [...COMPANY_STATS.industriesServed.tags],
    icon: Users,
  },
  {
    id: "satisfaction",
    targetNumber: COMPANY_STATS.clientSatisfaction.value,
    suffix: COMPANY_STATS.clientSatisfaction.suffix,
    label: COMPANY_STATS.clientSatisfaction.label,
    subtext: COMPANY_STATS.clientSatisfaction.subtext,
    icon: Award,
  },
];

// 3. Technologies Data with SVGs
const TECH_LOGOS = [
  {
    name: "Next.js",
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16.5L10 8.5V16H8.5V7.5H10L15.5 15V7.5H17V16.5H16Z" />
      </svg>
    ),
  },
  {
    name: "React",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#61DAFB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "React Native",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#61DAFB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" />
        <ellipse cx="12" cy="12" rx="4" ry="1.8" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="1.8" transform="rotate(150 12 12)" />
      </svg>
    ),
  },
  {
    name: "Flutter",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#02569B]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.3 2L5 11.3l3 3L17.3 5h-3zM14.3 11L8 17.3l3 3 3.1-3.1 3.2 3.1h3l-4.7-4.7L20.3 11h-6z" />
      </svg>
    ),
  },
  {
    name: "Firebase",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#FFCA28]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.89 15.67L8.25 2.28a.5.5 0 0 1 .95 0l1.6 4.93zM13.5 12.19l-2-6.19a.5.5 0 0 0-.95 0l-2.4 7.42zM19.89 16.63L12 21.15a.5.5 0 0 1-.5 0l-8-4.52a.5.5 0 0 1 0-.87l8-4.52a.5.5 0 0 1 .5 0l8 4.52a.5.5 0 0 1 0 .87z" />
      </svg>
    ),
  },
  {
    name: "Supabase",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#3ECF8E]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.35 2.05c-.37-.47-1.12-.22-1.12.38v8.07H3.92c-.67 0-1.04.78-.62 1.3l8.65 10.15c.37.47 1.12.22 1.12-.38v-8.07h8.31c.67 0 1.04-.78.62-1.3L13.35 2.05z" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    renderIcon: () => (
      <div className="w-4.5 h-4.5 bg-[#3178C6] text-white text-[9px] font-extrabold flex items-center justify-center rounded-sm font-sans select-none">
        TS
      </div>
    ),
  },
  {
    name: "Tailwind CSS",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#5FA04E]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2zm-1 15.6l-4-2.4V11l4 2.4v4.2zm0-5.5l-4-2.4 4-2.4 4 2.4-4 2.4zm5 3.1l-4 2.4V13l4-2.4v4.2z" />
      </svg>
    ),
  },
  {
    name: "Sanity CMS",
    renderIcon: () => (
      <svg className="w-5 h-5 text-[#F03E2F]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.5 13.5h-7v-2h7v2zm2-4h-9v-2h9v2zm0-4h-9V6.5h9V8.5z" />
      </svg>
    ),
  },
  {
    name: "Anime.js",
    renderIcon: () => (
      // Anime.js official wordmark "A" mark in brand red
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#FF5E42" />
        <path
          d="M12 4.5L4.5 19.5h4l1.75-3.75h3.5L15.5 19.5h4L12 4.5zm0 5.25l1.5 3.25h-3L12 9.75z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: "Framer Motion",
    renderIcon: () => (
      // Framer official "F" logomark
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#0055FF" />
        <path d="M6 4h12v6h-6L6 4z" fill="white" />
        <path d="M6 10h6l6 6H6V10z" fill="white" fillOpacity="0.7" />
        <path d="M6 16h6l-6 4v-4z" fill="white" fillOpacity="0.4" />
      </svg>
    ),
  },
];

// Helper Component for Count-up animation with prefers-reduced-motion check
function CountUpNumber({
  target,
  suffix = "",
  duration = 1400,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    // Check reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const frameId = requestAnimationFrame(() => setCount(target));
      return () => cancelAnimationFrame(frameId);
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Ease out quartic formula for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, target, duration]);

  return (
    <span ref={containerRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function WhyChooseHexaKode() {
  return (
    <Section
      id="why-choose"
      variant="white"
      spacing="large"
      className="border-y border-outline-variant/30 relative"
    >
      {/* Background Enhancements: Ambient blurred gradient circles & subtle radial grid */}
      <div className="absolute top-1/4 right-0 w-[420px] h-[420px] bg-primary/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[380px] h-[380px] bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#0066FF_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-16 md:gap-24"
        >
          {/* Section Header */}
          <motion.div variants={fadeUp}>
            <SectionHeading
              badge="Why Choose HexaKode"
              title="Why Businesses Choose HexaKode"
              subtitle="Build confidence by showing why clients trust HexaKode to design, develop, and grow their digital products."
              align="center"
              theme="light"
            />
          </motion.div>

          {/* Feature Cards Grid (Desktop: 3 cols x 2 rows, Tablet: 2 cols, Mobile: 1 col) */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {FEATURES.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={fadeUp}
                  className="h-full"
                >
                  <div className="group relative h-full bg-white rounded-2xl border border-slate-200/80 p-7 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/50 flex flex-col items-start overflow-hidden">
                    {/* Soft hover glow */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-300 pointer-events-none" />

                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] group-hover:scale-105">
                      <IconComponent
                        className="w-6 h-6 transition-colors duration-300"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="text-xl font-bold text-navy-dark mb-3 group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust Metrics Row */}
          <motion.div
            variants={staggerContainer}
            className="pt-4 border-t border-slate-100"
          >
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-secondary-container text-primary border border-secondary-container/80 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> PROVEN TRACK RECORD
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-navy-dark tracking-tight">
                Our Impact in Numbers
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {METRICS.map((metric) => {
                const MetricIcon = metric.icon;
                return (
                  <motion.div
                    key={metric.id}
                    variants={fadeUp}
                    className="bg-slate-50/70 rounded-2xl border border-slate-200/70 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl md:text-4xl font-extrabold text-navy-dark group-hover:text-primary transition-colors duration-200">
                          <CountUpNumber
                            target={metric.targetNumber}
                            suffix={metric.suffix}
                            duration={1400}
                          />
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-white text-primary border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform duration-300">
                          <MetricIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                        </div>
                      </div>

                      <p className="text-base font-bold text-navy-dark mb-1">
                        {metric.label}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {metric.subtext}
                      </p>
                    </div>

                    {/* Tag list previews for technologies and industries */}
                    {metric.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-200/60">
                        {metric.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-medium text-slate-600 shadow-2xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Technology Logos Showcase */}
          <motion.div variants={fadeUp} className="pt-2">
            <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-8 md:p-12 text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-secondary-container text-primary border border-secondary-container/80 mb-3">
                TECH STACK
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-navy-dark tracking-tight mb-3">
                Technologies We Use
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
                We build modern, scalable, and high-performance digital products using trusted technologies chosen for reliability, security, and long-term maintainability.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl">
                {TECH_LOGOS.map((tech) => (
                  <TechnologyChip
                    key={tech.name}
                    technology={tech}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Banner Card */}
          <motion.div variants={fadeUp} className="pt-2">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0F1E38] to-[#0A1224] p-8 md:p-14 border border-white/10 shadow-2xl overflow-hidden">
              {/* Background ambient glow & highlights */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/25 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 md:gap-10">
                <div className="max-w-2xl text-left">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-cyan-300 border border-white/15 mb-4">
                    <Calendar className="w-3.5 h-3.5" /> FREE STRATEGY SESSION
                  </span>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                    Ready to Build Your Next Digital Product?
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    Book a free strategy session and discover how HexaKode can help
                    your business grow with modern web and mobile solutions.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-primary/50 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1528] transition-all duration-300 group"
                  >
                    <span>Book a Free 30-Minute Consultation</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/portfolio"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white border border-white/20 text-sm font-semibold hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1528] transition-all duration-300"
                  >
                    <span>View Our Work</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

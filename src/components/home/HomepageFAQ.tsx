"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/motion";
import Link from "next/link";
import { constructFaqPageJsonLd, safeJsonLdStringify } from "@/lib/seo";

const FAQ_ITEMS = [
  {
    question: "What services does HexaKode provide?",
    answerText: "We design and develop custom websites, high-performance mobile applications, business management systems, enterprise software, custom UI/UX solutions, and cloud-based digital products tailored to your business needs.",
    answer: (
      <span>
        We design and develop custom{" "}
        <Link href="/services/web-development" className="text-secondary font-semibold hover:underline" prefetch={true}>
          websites
        </Link>
        , high-performance{" "}
        <Link href="/services/mobile-app-development" className="text-secondary font-semibold hover:underline" prefetch={true}>
          mobile applications
        </Link>
        , business management systems, enterprise software, custom{" "}
        <Link href="/services/ui-ux-design" className="text-secondary font-semibold hover:underline" prefetch={true}>
          UI/UX solutions
        </Link>
        , and cloud-based digital products tailored to your business needs.
      </span>
    ),
  },
  {
    question: "How long does it take to complete a project?",
    answerText: "Project timelines depend on complexity. Small business websites are typically completed within 2–4 weeks, while larger web applications and mobile apps may take several weeks to a few months.",
    answer: (
      <span>
        Project timelines depend on complexity. Small business websites are typically completed within 2–4 weeks, while larger web applications and mobile apps may take several weeks to a few months.
      </span>
    ),
  },
  {
    question: "Do you develop mobile applications for Android and iOS?",
    answerText: "Yes. We build high-performance cross-platform mobile applications using Flutter, enabling a single codebase for both Android and iOS while maintaining a native-like experience.",
    answer: (
      <span>
        Yes. We build high-performance cross-platform{" "}
        <Link href="/services/mobile-app-development" className="text-secondary font-semibold hover:underline" prefetch={true}>
          mobile applications
        </Link>{" "}
        using Flutter, enabling a single codebase for both Android and iOS while maintaining a native-like experience.
      </span>
    ),
  },
  {
    question: "Can you redesign or improve my existing website?",
    answerText: "Absolutely. We modernize outdated websites with improved design, better performance, enhanced security, and SEO best practices while preserving your existing business content where possible.",
    answer: (
      <span>
        Absolutely. We modernize outdated websites with improved design, better performance, enhanced security, and SEO best practices while preserving your existing business content where possible.
      </span>
    ),
  },
  {
    question: "Will my website be SEO-friendly?",
    answerText: "Yes. Every website we develop follows modern technical SEO practices, including semantic HTML, structured metadata, optimized performance, responsive design, and clean URLs to improve search visibility.",
    answer: (
      <span>
        Yes. Every{" "}
        <Link href="/services/web-development" className="text-secondary font-semibold hover:underline" prefetch={true}>
          website we develop
        </Link>{" "}
        follows modern technical SEO practices, including semantic HTML, structured metadata, optimized performance, responsive design, and clean URLs to improve search visibility.
      </span>
    ),
  },
  {
    question: "Do you provide ongoing maintenance and support?",
    answerText: "Yes. We offer post-launch maintenance, security updates, performance monitoring, bug fixes, and feature enhancements to keep your digital products running smoothly.",
    answer: (
      <span>
        Yes. We offer post-launch maintenance, security updates, performance monitoring, bug fixes, and feature enhancements to keep your digital products running smoothly.
      </span>
    ),
  },
  {
    question: "How much does a website or mobile app cost?",
    answerText: "Every project is unique. Pricing depends on the scope, features, and business requirements. Contact us for a free consultation and a customized quotation.",
    answer: (
      <span>
        Every project is unique. Pricing depends on the scope, features, and business requirements. Contact us for a free consultation and a customized quotation.
      </span>
    ),
  },
  {
    question: "How do I get started with HexaKode?",
    answerText: "Simply book a free consultation or contact us through our website. We'll discuss your goals, understand your requirements, and recommend the best solution for your business.",
    answer: (
      <span>
        Simply book a free consultation or contact us through our website. We&apos;ll discuss your goals, understand your requirements, and recommend the best solution for your business.
      </span>
    ),
  },
];

export default function HomepageFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Generate structured FAQ JSON-LD data
  const faqJsonLd = constructFaqPageJsonLd({
    path: "/",
    faqs: FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: item.answerText,
    })),
  });

  return (
    <Section id="faq" variant="muted" spacing="large" className="border-b border-outline-variant/30">
      {/* JSON-LD Schema structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }}
      />

      {/* Subtle absolute glowing decorative graphic */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(13,196,234,0.04)_0%,transparent_70%)] pointer-events-none filter blur-2xl z-0" />

      <Container className="relative z-10">
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
              subtitle="Find answers to some of the most common questions about our services, development process, pricing, and support."
              align="center"
              theme="light"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="max-w-3xl mx-auto w-full mt-4 space-y-4"
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeIndex === idx;
              return (
                <details
                  key={idx}
                  name="homepage-faq"
                  open={isOpen}
                  className="group rounded-xl border border-outline-variant/30 bg-white/70 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-secondary/35 shadow-sm open:border-secondary/40"
                >
                  <summary
                    onClick={(e) => {
                      e.preventDefault();
                      toggleAccordion(idx);
                    }}
                    id={`faq-btn-${idx}`}
                    aria-controls={`faq-content-${idx}`}
                    className="w-full flex justify-between items-center px-6 py-5 text-left font-headline-sm text-[16px] md:text-[18px] font-semibold text-navy-dark hover:text-primary transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-secondary/5 list-none [&::-webkit-details-marker]:hidden"
                  >
                    <span className="pr-4">{item.question}</span>
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
                    {item.answer}
                  </div>
                </details>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

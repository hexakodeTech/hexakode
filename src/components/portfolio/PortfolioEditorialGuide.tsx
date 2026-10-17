import React from "react";
import Link from "next/link";
import Container from "../ui/Container";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { ArrowRight, Laptop, Smartphone, CheckCircle, Database, Gauge } from "lucide-react";

export default function PortfolioEditorialGuide() {
  return (
    <Section id="portfolio-guide" variant="surface-container-low" spacing="medium" className="py-16 md:py-24 border-t border-outline-variant/10">
      <Container>
        {/* Section 1: Portfolio Overview */}
        <div className="max-w-4xl mx-auto mb-16">
          <SectionHeading
            badge="Engineering Insights"
            title="Understanding Our Engineering Portfolio: From Vision to Production"
            subtitle="Every project in our portfolio represents a real business challenge solved with purpose-built software."
            align="left"
            titleSize="lg"
          />
          <div className="text-on-surface-variant font-body-md space-y-4 leading-relaxed">
            <p>
              When evaluating a development studio, screenshots alone do not convey the engineering rigor required to support daily operations. At HexaKode, our portfolio illustrates how modern technologies are orchestrated to solve concrete commercial problems. Rather than assembling generic templates or fragile site builders, we architect bespoke digital platforms that balance intuitive usability with robust backend stability.
            </p>
            <p>
              Our featured case studies highlight two primary categories of digital challenges: customer-facing brand experiences that drive conversions, and high-security internal mobile systems that automate operational workflows. Operating as a remote-first engineering team based in Kerala, India, we collaborate closely with businesses worldwide to deliver transparent communication, high performance, and complete intellectual property ownership.
            </p>
            <p>
              By publishing verifiable project architectures and operational workflows, we give prospective clients transparent insight into how HexaKode operates. From early discovery wireframes through production deployment, our engineering philosophy ensures your software remains modular, performant, and resilient under real-world business demands.
            </p>
          </div>
        </div>

        {/* Section 2: Case Studies in Practice */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background mb-6 tracking-tight">
            Case Studies in Practice: Real-World Architecture &amp; Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold font-headline-sm text-primary mb-2">
                  Operational Mobile Engineering
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  In the <Link href="/portfolio/revopz-internal-management-system" className="text-secondary font-semibold hover:underline">REVOPZ Internal Management System</Link>, HexaKode developed a secure cross-platform mobile application utilizing React Native, Expo, and Cloud Firestore. Built to streamline manufacturing workflows, it features camera-based barcode scanning, serial number verification, batch unit registration, and role-based permissions to eliminate paper errors.
                </p>
              </div>
              <Link
                href="/services/mobile-app-development"
                className="text-xs font-bold uppercase tracking-wider text-primary hover:text-secondary inline-flex items-center gap-1.5 transition-colors"
              >
                Explore Mobile App Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Laptop className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold font-headline-sm text-primary mb-2">
                  High-Performance Web Platforms
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  For the <Link href="/portfolio/revopz-website" className="text-secondary font-semibold hover:underline">Revopz Corporate Website</Link>, our team engineered a responsive digital platform built on Next.js and Firebase. It combines a comprehensive product catalog, warranty registration portal, and customer inquiry management with sub-second page loads and search engine optimization.
                </p>
              </div>
              <Link
                href="/services/web-development"
                className="text-xs font-bold uppercase tracking-wider text-primary hover:text-secondary inline-flex items-center gap-1.5 transition-colors"
              >
                Explore Web Engineering <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 3: Architecture Influences & Technical Selection */}
        <div className="max-w-4xl mx-auto mb-16 bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background mb-4 tracking-tight">
            How Project Requirements Shape Technical Architecture
          </h2>
          <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
            Technology selection at HexaKode is always driven by specific project constraints rather than developer preferences. When scoping software, we evaluate core operational parameters:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm text-on-surface-variant mb-6">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">Real-Time vs. Static</strong>
                Internal factory tools require low-latency database updates, while public websites prioritize edge caching and SEO indexing.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">Scalable Maintainability</strong>
                Strict TypeScript interfaces and modular components ensure future developers can extend features without breaking logic.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Gauge className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">Speed &amp; Accessibility</strong>
                Optimizing Core Web Vitals, semantic markup, and responsive layouts guarantees fluid experiences across desktop and mobile screens.
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed border-t border-outline-variant/10 pt-4">
            Learn more about our architectural standards in our comprehensive <Link href="/blog/web-engineering-a-complete-guide-to-building-modern-scalable-web-applications" className="text-secondary font-semibold hover:underline">web engineering guide</Link> or examine our approach to <Link href="/services/ui-ux-design" className="text-secondary font-semibold hover:underline">UI/UX design systems</Link>.
          </p>
        </div>

        {/* Section 4: Scoping Your Next Project */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background mb-4 tracking-tight">
              How to Scope Your Digital Product with HexaKode
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
              To scope a similar software product for your organization, preparing a few key details helps our engineers deliver an accurate roadmap and architectural proposal:
            </p>
            <ul className="space-y-2.5 text-sm text-on-surface-variant mb-6 list-disc list-inside">
              <li><strong>Core Business Objectives:</strong> What operational friction, manual bottleneck, or customer need should this software resolve?</li>
              <li><strong>Key Functional Requirements:</strong> Specific user journeys, permissions, scanning capabilities, or administrative controls.</li>
              <li><strong>Target Users &amp; Devices:</strong> Whether users interact via desktop browsers, field mobile devices, or both environments.</li>
              <li><strong>Timeline &amp; Investment Expectations:</strong> Planned rollout milestones and realistic budget tiers, as outlined in our <Link href="/blog/how-much-does-a-business-website-cost-in-kerala" className="text-secondary font-semibold hover:underline">website pricing guide</Link>.</li>
            </ul>
            <p className="text-sm text-slate-500 border-t border-outline-variant/10 pt-4 leading-relaxed">
              Read about our remote-first team on our <Link href="/about" className="text-secondary font-semibold hover:underline">about page</Link>, review our full list of <Link href="/services" className="text-secondary font-semibold hover:underline">engineering services</Link>, or connect with us directly on our <Link href="/contact" className="text-secondary font-semibold hover:underline">contact page</Link> to schedule an initial technical consultation.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

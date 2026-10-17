import React from "react";
import Link from "next/link";
import Container from "../ui/Container";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { MessageSquare, FileCheck2, UserCheck, CheckSquare2 } from "lucide-react";

export default function ContactEnquiryGuide() {
  return (
    <Section id="enquiry-guide" variant="surface-container-low" spacing="medium" className="py-16 md:py-20 border-t border-outline-variant/10">
      <Container>
        {/* Section 1: What Happens After You Reach Out */}
        <div className="max-w-4xl mx-auto mb-16">
          <SectionHeading
            badge="Direct Collaboration"
            title="What to Expect When You Contact HexaKode"
            subtitle="Connect directly with our engineering founders without navigating agency gatekeepers or aggressive sales pitches."
            align="left"
            titleSize="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                1. Technical Review
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Your enquiry is reviewed directly by our founders, <Link href="/about" className="text-secondary font-semibold hover:underline">Navaneeth and Prajosh</Link>, who evaluate technical feasibility, database needs, and architectural requirements.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                2. Discovery Session
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We schedule a focused technical consultation to clarify user journeys, database schemas, third-party integrations, and milestone timelines.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                3. Clear Proposal
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                You receive a transparent technical proposal detailing scope, technology choices, and deliverables, adhering to our <Link href="/blog/hexakode-5-client-promises" className="text-secondary font-semibold hover:underline">5 client promises</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: What Information Helps Us Scope Your Project */}
        <div className="max-w-4xl mx-auto mb-16 bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background mb-4 tracking-tight">
            Helpful Information to Include in Your Enquiry
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
            To help our engineering team prepare actionable technical recommendations prior to our introductory call, sharing a few foundational details is immensely valuable:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-on-surface-variant">
            <div className="flex items-start gap-3">
              <CheckSquare2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">Business Objectives:</strong>
                What specific workflow bottleneck, customer friction, or revenue goal should this digital solution address?
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckSquare2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">Key Workflows &amp; Roles:</strong>
                Are there specialized admin dashboards, mobile barcode scanners, or external API connections required?
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckSquare2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">Existing Infrastructure:</strong>
                Do you have an active codebase, Figma prototypes, or database, or is this a ground-up development?
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckSquare2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">Target Timeline &amp; Budget:</strong>
                Having an estimated launch timeline and budget range helps us suggest realistic delivery milestones.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Preparing Your Project Details & Choosing Services */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background tracking-tight">
              Unsure Which Engineering Service Fits Your Business?
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              If you have an idea or operational challenge but are uncertain about the right technology stack, we are here to assist. Different business goals require different architectural approaches:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-on-surface-variant pt-2">
              <div className="p-4 rounded-xl bg-slate-50/50 border border-outline-variant/10">
                <strong className="text-primary block font-semibold mb-1">Corporate Presence &amp; Web Applications</strong>
                Explore our <Link href="/services/web-development" className="text-secondary font-semibold hover:underline">custom web development</Link> for scalable Next.js platforms or review typical market pricing in our <Link href="/blog/how-much-does-a-business-website-cost-in-kerala" className="text-secondary font-semibold hover:underline">website cost guide</Link>.
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 border border-outline-variant/10">
                <strong className="text-primary block font-semibold mb-1">Mobile &amp; Operational Tools</strong>
                Explore our <Link href="/services/mobile-app-development" className="text-secondary font-semibold hover:underline">mobile app development</Link> or examine our work on the <Link href="/portfolio/revopz-internal-management-system" className="text-secondary font-semibold hover:underline">REVOPZ scanning app</Link>.
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 border border-outline-variant/10">
                <strong className="text-primary block font-semibold mb-1">Product Wireframing &amp; UX Systems</strong>
                Discover our <Link href="/services/ui-ux-design" className="text-secondary font-semibold hover:underline">UI/UX design services</Link> to validate interactive prototypes before initiating software engineering.
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 border border-outline-variant/10">
                <strong className="text-primary block font-semibold mb-1">Search Traffic &amp; Acquisition</strong>
                Learn how our <Link href="/services/digital-marketing" className="text-secondary font-semibold hover:underline">digital marketing solutions</Link> combine technical SEO and performance campaigns to generate leads.
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 border-t border-outline-variant/10 pt-4 leading-relaxed">
              Operating remotely from Kerala, India across Indian Standard Time, we support clients globally. You can also review completed case studies in our <Link href="/portfolio" className="text-secondary font-semibold hover:underline">project portfolio</Link> or learn more about our engineering standards on our <Link href="/services" className="text-secondary font-semibold hover:underline">services hub</Link>.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

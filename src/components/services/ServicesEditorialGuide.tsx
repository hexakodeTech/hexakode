import React from "react";
import Link from "next/link";
import Container from "../ui/Container";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { CheckCircle2, HelpCircle, Layers, ShieldCheck, Compass } from "lucide-react";

export default function ServicesEditorialGuide() {
  return (
    <Section id="service-guide" variant="surface-container-low" spacing="medium" className="py-16 md:py-24 border-t border-outline-variant/10">
      <Container>
        {/* Section 1: Business Problems We Solve */}
        <div className="max-w-4xl mx-auto mb-14">
          <SectionHeading
            badge="Business Value"
            title="Solving Real Business Challenges Through Engineering"
            subtitle="Software should eliminate operational bottlenecks and deliver durable commercial returns."
            align="left"
            titleSize="lg"
          />
          <div className="text-on-surface-variant font-body-md space-y-4 leading-relaxed">
            <p>
              Growing businesses frequently outgrow basic website builders and fragile templates. Off-the-shelf platforms struggle when user traffic surges, while generic plugins introduce security vulnerabilities and slow response times. HexaKode engineers production-grade digital solutions designed for operational longevity. Whether automating manual inventory workflows, improving mobile conversion funnels, or modernizing legacy infrastructure, we eliminate technical debt so your team can focus on growth.
            </p>
          </div>
        </div>

        {/* Section 2: Service Selection Guidance */}
        <div className="max-w-4xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background mb-6 tracking-tight">
            Choosing the Right Service for Your Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-base font-bold font-headline-sm text-primary mb-2">
                Custom Web Platforms
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Choose our <Link href="/services/web-development" className="text-secondary font-semibold hover:underline">web development services</Link> for high-performance corporate platforms, SaaS portals, and database-driven applications built on Next.js and TypeScript.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-base font-bold font-headline-sm text-primary mb-2">
                Cross-Platform Mobile Apps
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Partner with our <Link href="/services/mobile-app-development" className="text-secondary font-semibold hover:underline">mobile app developers</Link> when workflows require on-the-go utility, offline access, or device hardware integration, as proven in our <Link href="/portfolio/revopz-internal-management-system" className="text-secondary font-semibold hover:underline">REVOPZ management app</Link>.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-base font-bold font-headline-sm text-primary mb-2">
                UI/UX Systems &amp; Prototyping
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Select our <Link href="/services/ui-ux-design" className="text-secondary font-semibold hover:underline">UI/UX design services</Link> to simplify complex user journeys, build reusable design systems, and validate interactive Figma prototypes prior to full-scale development.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-base font-bold font-headline-sm text-primary mb-2">
                Digital Marketing &amp; Technical SEO
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Engage our <Link href="/services/digital-marketing" className="text-secondary font-semibold hover:underline">digital marketing team</Link> for organic search visibility, speed audits, and targeted campaigns that convert prospective visitors into active clients.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Process */}
        <div className="max-w-4xl mx-auto mb-14 bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background mb-4 tracking-tight">
            Our Transparent Delivery Process
          </h2>
          <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
            As detailed on our <Link href="/about" className="text-secondary font-semibold hover:underline">about page</Link>, HexaKode operates on an engineer-led model where clients communicate directly with technical builders. We follow four structured milestones:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-on-surface-variant">
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">1. Discovery &amp; Scoping</strong>
                Defining requirements, schemas, and architecture before code begins.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">2. Component Engineering</strong>
                Writing modular, strictly typed code backed by version control.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">3. Quality Audits</strong>
                Ensuring mobile usability, Core Web Vitals speed, and accessibility.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-background block font-semibold">4. Launch &amp; Handover</strong>
                Production deployment, complete IP transfer, and long-term support.
              </div>
            </div>
          </div>
          <p className="mt-5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-outline-variant/10 pt-4">
            Review our engineering standards in <Link href="/blog/hexakode-5-client-promises" className="text-secondary font-semibold hover:underline">HexaKode&apos;s 5 client promises</Link> or examine verified case studies in our <Link href="/portfolio" className="text-secondary font-semibold hover:underline">portfolio</Link>.
          </p>
        </div>

        {/* Section 4: Services FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline-md text-on-background mb-6 tracking-tight">
            Services Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
                How are projects estimated and priced?
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We provide milestone-based estimates with clearly defined technical deliverables. Review our practical breakdown of investment tiers in our <Link href="/blog/how-much-does-a-business-website-cost-in-kerala" className="text-secondary font-semibold hover:underline">website cost guide</Link>.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
                Do clients retain full code ownership?
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Yes. Clients retain 100% intellectual property and code ownership upon completion. We deliver clean repositories alongside complete infrastructure setup instructions.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 shadow-sm">
              <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
                How do we initiate a project discussion?
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Submit your initial requirements through our <Link href="/contact" className="text-secondary font-semibold hover:underline">contact page</Link> to schedule an introductory technical discovery consultation directly with our engineering founders.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

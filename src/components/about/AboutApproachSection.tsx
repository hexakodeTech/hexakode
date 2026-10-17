import React from "react";
import Link from "next/link";
import Section from "../ui/Section";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { Code2, Users2 } from "lucide-react";

export default function AboutApproachSection() {
  return (
    <Section variant="surface-container-low" spacing="medium" className="py-16 md:py-20 border-t border-outline-variant/10">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            badge="Engineering Philosophy"
            title="How We Approach Digital Product Engineering"
            subtitle="Bridging the divide between non-technical business vision and high-performance software architecture."
            align="left"
            titleSize="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-lg font-bold font-headline-sm text-primary mb-2">
                Usability, Speed &amp; Maintainability
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We believe exceptional software is invisible to the end user—it simply works without friction. Across our <Link href="/services/web-development" className="text-secondary font-semibold hover:underline">web engineering</Link> and <Link href="/services/ui-ux-design" className="text-secondary font-semibold hover:underline">UI/UX design</Link>, we prioritize clean code, accessibility, and high performance rather than short-lived visual fads.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Users2 className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-lg font-bold font-headline-sm text-primary mb-2">
                Who We Partner With
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                HexaKode collaborates best with ambitious founders, operational leaders, and growing enterprises looking for dependable digital partners. Whether launching a new platform or modernizing existing tools, our clients value direct engineer access over agency bureaucracy.
              </p>
            </div>
          </div>

          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-primary mb-1">
                Explore Our Proven Work
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
                See how our remote-first engineering team delivered practical solutions like the <Link href="/portfolio/revopz-website" className="text-secondary font-semibold hover:underline">REVOPZ corporate website</Link> and custom <Link href="/services/mobile-app-development" className="text-secondary font-semibold hover:underline">mobile applications</Link>.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/portfolio"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                View Portfolio
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-outline-variant/40 text-on-surface rounded-lg hover:bg-slate-100 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

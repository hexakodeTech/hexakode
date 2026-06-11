import React from "react";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ProcessCard from "../common/ProcessCard";
import { PROCESS_STEPS } from "../../constants/home";

export default function ProcessSection() {
  return (
    <Section id="process" variant="white" spacing="large">
      {/* Background soft glowing elements */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-sky-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <Container>
        <SectionHeading
          badge="OUR PROCESS"
          title="Our Engineering Process"
          subtitle="How we transform ideas into production-grade digital products."
          align="center"
          theme="light"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 relative">
          {/* Subtle connection line between steps on desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-[1px] bg-slate-100 -z-10" />

          {PROCESS_STEPS.map((step, index) => (
            <ProcessCard key={step.stepNumber} step={step} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

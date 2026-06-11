import React from "react";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ServiceCard from "../common/ServiceCard";
import { SERVICES } from "../../constants/home";

export default function ServicesSection() {
  return (
    <Section id="services" variant="white" spacing="large">
      {/* Background soft glowing elements */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <Container>
        <SectionHeading
          badge="OUR SERVICES"
          title="Our Specialized Services"
          subtitle="From concept to deployment, we deliver comprehensive software solutions engineered for performance and reliability."
          align="left"
          theme="light"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

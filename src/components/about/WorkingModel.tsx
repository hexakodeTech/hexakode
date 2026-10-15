"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { MapPin, Laptop, ShieldCheck } from "lucide-react";
import Section from "../ui/Section";
import Container from "../ui/Container";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const PILLARS = [
  {
    id: "location",
    icon: MapPin,
    title: "Based in Kerala, India",
    description:
      "Our team operates from Kerala, India, aligned with Indian Standard Time (IST, UTC+5:30). We collaborate with regional businesses in Kerala as well as clients across India and globally.",
  },
  {
    id: "remote",
    icon: Laptop,
    title: "100% Remote-First",
    description:
      "HexaKode does not maintain a physical walk-in office. Every project is coordinated through structured digital channels, scheduled video consultations, and transparent communication.",
  },
  {
    id: "delivery",
    icon: ShieldCheck,
    title: "Direct Engineering Access",
    description:
      "By eliminating physical office overhead and non-technical account managers, our clients partner directly with the developers building their web and mobile applications.",
  },
];

export default function WorkingModel() {
  return (
    <Section variant="surface-container-low" spacing="large">
      <Container>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            className="font-label-mono text-label-mono text-secondary mb-3 block uppercase tracking-widest text-xs font-semibold"
          >
            Location &amp; Operations
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-headline-md text-headline-md md:text-headline-lg text-primary mb-4 tracking-tight"
          >
            Remote-First Working Model
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
          >
            HexaKode serves clients remotely from Kerala, India. We deliver
            modern web and mobile software through transparent, asynchronous, and
            efficient digital workflows.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                variants={fadeUp}
                className="bg-surface p-8 md:p-10 rounded-xl border border-outline-variant/30 hover:border-secondary/30 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center mb-6 shrink-0">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3 font-semibold">
                  {pillar.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}

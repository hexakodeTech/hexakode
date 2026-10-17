"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Section from "../ui/Section";
import Container from "../ui/Container";
import TeamMemberCard from "./TeamMemberCard";
import { FOUNDERS } from "../../constants/about";

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

export default function FoundersSection() {
  return (
    <Section variant="white" spacing="large">
      <Container>
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            className="font-label-mono text-label-mono text-secondary mb-3 block uppercase tracking-widest text-xs font-semibold"
          >
            Company Leadership
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-headline-md text-headline-md md:text-headline-lg text-primary mb-4 tracking-tight"
          >
            Meet the Founders
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
          >
            HexaKode was established in May 2026 by two friends committed to
            delivering transparent, high-performance software engineering without
            corporate overhead.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto justify-items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {FOUNDERS.map((founder) => (
            <motion.div key={founder.id} variants={fadeUp} className="w-full">
              <TeamMemberCard member={founder} showSocial={false} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

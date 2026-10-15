"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Section from "../ui/Section";
import Container from "../ui/Container";
import SecondaryButton from "../ui/SecondaryButton";
import TeamMemberCard from "./TeamMemberCard";
import { TEAM_MEMBERS } from "../../constants/about";

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

export default function TeamSection() {
  if (!TEAM_MEMBERS || TEAM_MEMBERS.length === 0) {
    return null;
  }

  return (
    <Section variant="surface-container-low" spacing="large">
      <Container>
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="max-w-xl">
            <span className="font-label-mono text-label-mono text-secondary mb-3 block uppercase tracking-widest text-xs font-semibold">
              Engineering & Execution
            </span>
            <h2 className="font-headline-md text-headline-md md:text-headline-lg text-primary mb-4 tracking-tight">
              Meet the Team
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Our engineers turn complex specifications into intuitive, accessible,
              and scalable digital products.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="shrink-0">
            <SecondaryButton href="/careers">Join the Team</SecondaryButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeUp}
              className="w-full max-w-sm"
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

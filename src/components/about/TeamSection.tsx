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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function TeamSection() {
  return (
    <Section variant="white" spacing="large">
      <Container>
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="max-w-xl">
            <span className="font-label-mono text-label-mono text-secondary mb-4 block uppercase tracking-widest">Our Leadership</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-4 tracking-tight">The Minds Behind HexaKode</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              A multidisciplinary team of engineers, designers, and strategists united by a passion for technical excellence.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <SecondaryButton href="/careers">Join the Team</SecondaryButton>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div key={member.id} variants={fadeUp} className="w-full max-w-sm">
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Section from "../ui/Section";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

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

export default function FinalCTA() {
  return (
    <Section variant="white" className="py-40 text-center relative overflow-hidden">
      <motion.div
        className="max-w-4xl mx-auto z-10 relative px-margin-mobile md:px-margin-desktop"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeUp} className="font-display-lg text-headline-lg md:text-display-lg text-primary mb-8 tracking-tight">
          Ready to Build the Impossible?
        </motion.h2>
        <motion.p variants={fadeUp} className="font-body-lg text-body-lg text-on-surface-variant mb-12 leading-relaxed">
          Whether you&apos;re scaling a startup or re-architecting an enterprise, let&apos;s engineer your success together.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center">
          <PrimaryButton size="lg" href="/contact">Join Our Journey</PrimaryButton>
          <SecondaryButton size="lg" href="/contact">Schedule a Workshop</SecondaryButton>
        </motion.div>
      </motion.div>

      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="grid grid-cols-12 h-full max-w-container-max mx-auto px-margin-desktop">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-primary h-full first:border-l"></div>
          ))}
        </div>
      </div>
    </Section>
  );
}

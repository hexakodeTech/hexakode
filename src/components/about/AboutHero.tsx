"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import Badge from "../ui/Badge";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function AboutHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop py-20 overflow-hidden bg-background">
      {/* Decorative Hero Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[80px] pointer-events-none"></div>

      <motion.div
        className="max-w-container-max mx-auto text-center z-10 relative"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <span className="font-label-mono text-label-mono text-secondary mb-6 block uppercase tracking-widest">
            Architecting the Future
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="font-headline-lg text-headline-lg md:text-display-lg text-primary mb-8 max-w-4xl mx-auto tracking-tight">
          Your Partners in <span className="text-secondary">Digital Transformation</span>.
        </motion.h1>

        <motion.p variants={fadeUp} className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
          We bridge the gap between complex engineering challenges and elegant digital solutions, delivering scalable excellence for global enterprises.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <PrimaryButton size="lg" href="/portfolio">View Our Work</PrimaryButton>
          <SecondaryButton size="lg" href="/contact">Contact Sales</SecondaryButton>
        </motion.div>
      </motion.div>

      {/* Decorative SVG Element */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
          <path className="text-secondary-fixed" d="M0 10 L100 0 L100 100 L0 90 Z" fill="currentColor"></path>
        </svg>
      </motion.div>
    </section>
  );
}

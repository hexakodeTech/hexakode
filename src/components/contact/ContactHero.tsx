"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
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

export default function ContactHero() {
  return (
    <section className="relative py-12 md:py-20 bg-background overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[80px] pointer-events-none"></div>

      <motion.div
        className="max-w-container-max mx-auto text-left z-10 relative"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.span
          variants={fadeUp}
          className="font-label-mono text-label-mono text-secondary tracking-widest uppercase mb-4 block"
        >
          Connect with our team
        </motion.span>
        
        <motion.h1
          variants={fadeUp}
          className="font-headline-lg text-headline-lg md:text-display-lg text-primary mb-6 max-w-4xl tracking-tight"
        >
          Let's Start a Conversation
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
        >
          Ready to engineer excellence? Whether you have a project in mind or just want to explore possibilities, our experts are here to help you navigate the next step of your digital journey.
        </motion.p>
      </motion.div>
    </section>
  );
}

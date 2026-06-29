"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function PortfolioHero() {
  return (
    <section className="relative pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden bg-background">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      <Container className="relative z-10 text-center flex flex-col items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl flex flex-col items-center"
        >
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            className="font-label-mono text-label-mono uppercase tracking-[0.2em] text-secondary mb-6 block select-none"
          >
            Our Legacy
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-8 text-on-background max-w-2xl"
          >
            Crafting Digital Success Stories
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed"
          >
            A curated selection of our technical achievements, where engineering precision meets creative vision to solve complex enterprise challenges.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

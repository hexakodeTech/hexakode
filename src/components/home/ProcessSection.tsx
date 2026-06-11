"use client";

import React from "react";
import { motion } from "framer-motion";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ProcessCard from "../common/ProcessCard";
import { PROCESS_STEPS } from "../../constants/home";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function ProcessSection() {
  return (
    <Section id="process" variant="white" spacing="large">
      {/* Background soft glowing elements */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />

      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          <motion.div variants={fadeUp}>
            <SectionHeading
              title="Our Engineering Process"
              subtitle="How we transform ideas into production-grade digital products."
              align="center"
              theme="light"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 relative"
          >
            {/* Subtle connection line between steps on desktop */}
            <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-[1px] bg-slate-100 -z-10" />

            {PROCESS_STEPS.map((step, index) => (
              <motion.div key={step.stepNumber} variants={fadeUp}>
                <ProcessCard step={step} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

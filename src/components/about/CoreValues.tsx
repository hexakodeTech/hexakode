"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Section from "../ui/Section";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import ValueCard from "./ValueCard";
import { CORE_VALUES } from "../../constants/about";

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

export default function CoreValues() {
  return (
    <Section variant="surface-container-low" spacing="large">
      <Container>
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <SectionHeading 
            badge="The HexaKode Standard"
            title="Our Core Values"
            align="center"
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {CORE_VALUES.map((value) => (
            <motion.div key={value.id} variants={fadeUp}>
              <ValueCard value={value} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Section from "../ui/Section";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import FAQCard from "./FAQCard";
import { FAQ_ITEMS } from "../../constants/contact";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
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
    },
  },
};

export default function FAQSection() {
  return (
    <Section variant="white" className="mt-20 md:mt-32 border-t border-outline-variant/20 pt-16">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions about our process and collaboration model."
            align="center"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {FAQ_ITEMS.map((faq) => (
            <motion.div key={faq.id} variants={fadeUp}>
              <FAQCard faq={faq} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

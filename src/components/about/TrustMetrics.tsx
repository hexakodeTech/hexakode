"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Section from "../ui/Section";
import Container from "../ui/Container";
import MetricCard from "./MetricCard";
import { TRUST_POINTS, TRUST_METRICS } from "../../constants/about";

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

export default function TrustMetrics() {
  return (
    <Section variant="navy" spacing="large">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="font-headline-md text-headline-md mb-12 text-white tracking-tight">
              Why Clients Partner with Us
            </motion.h2>
            
            <div className="space-y-12">
              {TRUST_POINTS.map((point) => (
                <motion.div key={point.id} variants={fadeUp} className="flex gap-6 group">
                  <span className="font-display-lg text-secondary-container opacity-50 shrink-0 group-hover:opacity-100 group-hover:text-secondary transition-all duration-300">
                    {point.number}
                  </span>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm mb-2 text-white">{point.title}</h4>
                    <p className="font-body-md text-on-primary-container leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="space-y-4">
              <motion.div variants={fadeUp}>
                <MetricCard metric={TRUST_METRICS[0]} className="aspect-square" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <MetricCard metric={TRUST_METRICS[2]} className="aspect-[4/3]" />
              </motion.div>
            </div>
            <div className="space-y-4 pt-8">
              <motion.div variants={fadeUp}>
                <MetricCard metric={TRUST_METRICS[1]} className="aspect-[4/3]" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <MetricCard metric={TRUST_METRICS[3]} className="aspect-square" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

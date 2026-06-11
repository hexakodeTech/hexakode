"use client";

import React from "react";
import { motion } from "framer-motion";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ServiceCard from "../common/ServiceCard";
import { SERVICES } from "../../constants/home";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function ServicesSection() {
  return (
    <Section id="services" variant="white" spacing="large">
      {/* Background soft glowing elements */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />

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
              title="Our Specialized Services"
              subtitle="From concept to deployment, we deliver comprehensive software solutions engineered for performance and reliability."
              align="left"
              theme="light"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12"
          >
            {SERVICES.map((service) => (
              <motion.div key={service.id} variants={fadeUp} className={service.highlighted ? "col-span-1 md:col-span-2" : ""}>
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

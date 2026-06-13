"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Rocket, Eye } from "lucide-react";
import Section from "../ui/Section";
import Container from "../ui/Container";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function CompanyStory() {
  return (
    <Section variant="white" spacing="large">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="relative"
          >
            <div className="aspect-square rounded-xl overflow-hidden shadow-premium relative bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover hover-image-zoom"
                alt="A clean and expansive architectural view of a modern open-concept office space."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATiYl7A_27Zs0d68JXnE0xIxtmeUMusytoZZfzLYWRq4Ol0bz9xkKk1zLmVbmM4RiQv9jxyNNtkGW0nWJJQmovCShRSZVgCBCmm27d1IDE0AGLFdOaVxsEoLxZgR_zh61RxVFvOazHizsJbY2EA5zm-J56n56zf97kV_7uaAWjU4lr7GtMQ1CWzggTQHpFMzGnhu6XgDkuwa5xOg6xhZt5XbnPhL5VCJ4AwU1mEKSXB5uirutUYxMg1xcfVI9DT4JIAmhnzbWwy8rk"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden md:flex w-64 h-64 bg-primary-container rounded-xl p-8 text-on-primary-fixed shadow-2xl flex-col justify-center border border-outline-variant/10">
              <span className="font-display-lg text-headline-lg block mb-2 text-white">12+</span>
              <p className="font-label-mono text-label-mono uppercase text-on-primary-container leading-relaxed tracking-wider">Years of Engineered Excellence</p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="font-headline-md text-headline-md text-primary mb-6">Our Story</motion.h2>
            <motion.p variants={fadeUp} className="font-body-md text-body-md text-on-surface-variant mb-12 leading-relaxed">
              Every successful business has a vision. Our role is to transform that vision into powerful digital experiences. HexaKode specializes in crafting websites, applications, and software solutions that are not only visually appealing but also engineered for performance, scalability, and growth. We partner with businesses to build technology that creates lasting impact.
            </motion.p>

            <div className="space-y-10">
              <motion.div variants={fadeUp} className="flex gap-6 group">
                <div className="w-12 h-12 bg-secondary-container/20 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300">
                  <Rocket className="text-secondary w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Our Mission</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    To empower organizations through precision-engineered software that solves real-world complexities with simplicity and scale.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-6 group">
                <div className="w-12 h-12 bg-secondary-container/20 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300">
                  <Eye className="text-secondary w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Our Vision</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    To be the global benchmark for technical excellence, where engineering meets artistry to redefine the digital frontier.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

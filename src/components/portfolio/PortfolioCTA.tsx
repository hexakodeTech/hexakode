"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import PrimaryButton from "../ui/PrimaryButton";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function PortfolioCTA() {
  return (
    <section className="py-24 bg-primary-container text-on-primary-container border-t border-outline-variant/10 overflow-hidden">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12"
        >
          {/* Left Text Column */}
          <motion.div variants={fadeUp} className="max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-white mb-6">
              Ready to engineer your success story?
            </h2>
            <p className="font-body-lg text-on-primary-container/70 leading-relaxed">
              Let's collaborate to build something that sets new standards in your industry.
            </p>
          </motion.div>

          {/* Right Action Button */}
          <motion.div variants={fadeUp} className="shrink-0 w-full sm:w-auto">
            <PrimaryButton
              href="/#contact"
              variant="secondary" // Under primary-container, variant secondary yields sky blue background
              size="lg"
              className="w-full sm:w-auto font-bold rounded-lg flex items-center justify-center gap-2 px-8 py-4 bg-secondary-container text-on-secondary-container hover:brightness-110 hover:shadow-glow-blue hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

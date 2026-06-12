"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";
import { cn } from "../../lib/utils";
import Container from "../ui/Container";
import Section from "../ui/Section";
import PrimaryButton from "../ui/PrimaryButton";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
  className?: string;
}

export default function CTASection({
  title = "Ready to Engineer Excellence?",
  description = "Join 50+ enterprise partners who trust HexaKode for their mission-critical engineering needs. Get a custom technical estimate in 48 hours.",
  primaryBtnText = "Start Your Project",
  primaryBtnHref = "#contact",
  secondaryBtnText = "BOOK A TECHNICAL DISCOVERY CALL",
  secondaryBtnHref = "#contact",
  className,
}: CTASectionProps) {
  return (
    <Section
      variant="surface-container-highest"
      spacing="cta"
      className={cn("border-y border-outline-variant/30", className)}
    >
      <Container className="text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Title */}
          <motion.h2
            variants={fadeUp}
            className="text-headline-lg font-headline-lg mb-6 text-on-background"
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-on-surface-variant font-body-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Action Row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
          >
            <PrimaryButton
              href={primaryBtnHref}
              size="lg"
              className="px-10 py-5 text-headline-sm font-headline-sm hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto text-white rounded-lg"
            >
              {primaryBtnText}
            </PrimaryButton>

            <motion.a
              href={secondaryBtnHref}
              className="flex items-center gap-4 text-on-surface-variant font-label-mono text-label-mono group cursor-pointer transition-colors duration-300 hover:text-primary uppercase tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessagesSquare className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:text-secondary" />
              {secondaryBtnText}
            </motion.a>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

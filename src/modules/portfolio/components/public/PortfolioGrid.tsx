"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicProject } from "../../types/portfolio";
import PortfolioCard from "./PortfolioCard";
import { fadeUp, staggerContainer } from "@/lib/motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface PortfolioGridProps {
  projects: PublicProject[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <Section id="portfolio-grid" variant="white" spacing="none" className="pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      <Container clean className="max-w-[1400px] mx-auto px-6 md:px-8 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => {
              return (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: index * 0.08,
                  }}
                  className="w-full flex flex-col h-full"
                >
                  <PortfolioCard
                    project={project}
                    layoutSize={project.layoutSize || "standard"}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
    </Section>
  );
}

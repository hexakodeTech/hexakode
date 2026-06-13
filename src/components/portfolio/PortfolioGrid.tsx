"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../../types/portfolio";
import PortfolioCard from "./PortfolioCard";
import FeaturedPortfolioCard from "./FeaturedPortfolioCard";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "../../lib/utils";

import Section from "../ui/Section";
import Container from "../ui/Container";

interface PortfolioGridProps {
  projects: Project[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  // Helper to determine the responsive col span matching the design mockup layout
  const getColSpanClass = (project: Project) => {
    switch (project.layoutSize) {
      case "featured":
      case "wide":
        return "col-span-12 md:col-span-8";
      case "side":
        return "col-span-12 md:col-span-4";
      case "standard":
        return project.id === "project-3" ? "col-span-12 md:col-span-4" : "col-span-12 md:col-span-6";
      default:
        return "col-span-12 md:col-span-4";
    }
  };

  return (
    <Section id="portfolio-grid" variant="white" spacing="large" className="overflow-hidden">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-gutter w-full"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project) => {
              const isFeaturedLayout = project.layoutSize === "featured" || project.layoutSize === "wide";
              const colSpanClass = getColSpanClass(project);

              return (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={cn("w-full", colSpanClass)}
                >
                  {isFeaturedLayout ? (
                    <FeaturedPortfolioCard
                      title={project.title}
                      category={project.category}
                      description={project.description}
                      image={project.image}
                      slug={project.slug}
                      layoutSize={project.layoutSize as "featured" | "wide"}
                    />
                  ) : (
                    <PortfolioCard
                      title={project.title}
                      category={project.category}
                      description={project.description}
                      image={project.image}
                      slug={project.slug}
                      layoutSize={project.layoutSize as "side" | "standard"}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
    </Section>
  );
}

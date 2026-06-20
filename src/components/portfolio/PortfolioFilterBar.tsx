"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface PortfolioFilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "ui-ux", label: "UI/UX" },
  { id: "software", label: "Software" },
];

export default function PortfolioFilterBar({
  currentFilter,
  onFilterChange,
}: PortfolioFilterBarProps) {
  return (
    <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-outline-variant/10 select-none">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-6">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6">
          {CATEGORIES.map((category) => {
            const isActive = currentFilter === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className={cn(
                  "relative px-4 py-2 font-label-mono text-label-mono uppercase tracking-widest transition-colors duration-250 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-secondary/50 rounded",
                  isActive ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"
                )}
              >
                <span className="relative z-10">{category.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-container"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

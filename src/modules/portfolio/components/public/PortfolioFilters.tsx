"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PortfolioFiltersProps {
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

export default function PortfolioFilters({
  currentFilter,
  onFilterChange,
}: PortfolioFiltersProps) {
  return (
    <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-outline-variant/10 select-none">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-5">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8">
          {CATEGORIES.map((category) => {
            const isActive = currentFilter === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className={cn(
                  "relative px-4 py-2 font-label-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-secondary/50 rounded-lg",
                  isActive ? "text-secondary font-bold" : "text-on-surface-variant/80 hover:text-primary"
                )}
              >
                <span className="relative z-10">{category.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-2 right-2 h-[3px] bg-secondary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
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

"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PortfolioOverlayProps {
  title: string;
  category: string;
  description: string;
  layoutSize: "featured" | "side" | "standard" | "wide";
}

export default function PortfolioOverlay({
  title,
  category,
  description,
  layoutSize,
}: PortfolioOverlayProps) {
  const isLarge = layoutSize === "featured" || layoutSize === "wide";

  return (
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-white select-none z-10",
        isLarge ? "p-12" : "p-8"
      )}
    >
      {/* Category Pill Tag */}
      <span className="font-label-mono text-label-mono text-secondary-container mb-3 tracking-widest uppercase">
        {category}
      </span>

      {/* Project Title */}
      <h3
        className={cn(
          "font-headline-md tracking-tight mb-3 text-white",
          isLarge ? "text-headline-md" : "text-headline-sm"
        )}
      >
        {title}
      </h3>

      {/* Project Description */}
      <p
        className={cn(
          "font-body-md text-white/80 leading-relaxed mb-6 max-w-xl",
          isLarge ? "text-body-md" : "text-body-sm"
        )}
      >
        {description}
      </p>

      {/* Action CTA link */}
      <div className="flex items-center gap-2 font-label-mono text-label-mono text-secondary-container hover:text-white transition-colors duration-200">
        <span>View Case Study</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </div>
  );
}

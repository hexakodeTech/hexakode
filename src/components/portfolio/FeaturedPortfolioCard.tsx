"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import PortfolioOverlay from "./PortfolioOverlay";
import { cn } from "../../lib/utils";

interface FeaturedPortfolioCardProps {
  title: string;
  category: "Web" | "Mobile" | "UI/UX" | "Software";
  description: string;
  image: string;
  slug: string;
  layoutSize: "featured" | "wide";
  heightClass?: string;
}

export default function FeaturedPortfolioCard({
  title,
  category,
  description,
  image,
  slug,
  layoutSize,
  heightClass,
}: FeaturedPortfolioCardProps) {
  // Determine standard height based on layoutSize if heightClass is not provided
  const defaultHeight = layoutSize === "featured" ? "h-[500px]" : "h-[400px]";

  return (
    <Link href={`/portfolio/${slug}`} className="block group">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface-container rounded-xl border border-outline-variant/10 shadow-sm group-hover:shadow-premium-hover group-hover:border-secondary-container/30 transition-all duration-300 cursor-pointer select-none",
          heightClass || defaultHeight
        )}
      >
        {/* Next.js Optimized Image (Prioritized for larger viewport containers) */}
        <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw"
            className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            priority={layoutSize === "featured"}
          />
        </div>

        {/* Hover Reveal Overlay Details */}
        <PortfolioOverlay
          title={title}
          category={category}
          description={description}
          layoutSize={layoutSize}
        />
      </div>
    </Link>
  );
}

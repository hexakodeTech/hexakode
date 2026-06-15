"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import PortfolioOverlay from "./PortfolioOverlay";
import { cn } from "../../lib/utils";

interface PortfolioCardProps {
  title: string;
  category: "Web" | "Mobile" | "UI/UX" | "Software";
  description: string;
  image: string;
  slug: string;
  layoutSize: "side" | "standard";
  heightClass?: string;
}

export default function PortfolioCard({
  title,
  category,
  description,
  image,
  slug,
  layoutSize,
  heightClass,
}: PortfolioCardProps) {
  // Determine standard height based on layoutSize if heightClass is not provided
  const defaultHeight = layoutSize === "side" ? "h-[500px]" : "h-[400px] md:h-[450px]";

  return (
    <Link href={`/portfolio/${slug}`} className="block group">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface-container rounded-xl border border-outline-variant/10 shadow-sm group-hover:shadow-premium-hover group-hover:border-secondary-container/30 transition-all duration-300 cursor-pointer select-none",
          heightClass || defaultHeight
        )}
      >
        {/* Next.js Optimized Image */}
        <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            priority={layoutSize === "side"}
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

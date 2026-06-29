"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Star } from "lucide-react";
import { PublicProject } from "../../types/portfolio";

interface PortfolioCardProps {
  project: PublicProject;
  layoutSize: "side" | "standard" | "featured" | "wide";
  heightClass?: string;
}

export default function PortfolioCard({
  project,
  layoutSize,
  heightClass,
}: PortfolioCardProps) {
  const isLarge = layoutSize === "featured" || layoutSize === "wide";
  const defaultHeight = layoutSize === "side" ? "h-[500px]" : isLarge ? "h-[500px]" : "h-[400px] md:h-[450px]";

  // Fallback cover image URL
  const defaultPlaceholder = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";
  const displayImage = project.image && project.image.trim() !== "" ? project.image.trim() : defaultPlaceholder;
  const isSupabase = displayImage.includes("supabase.co") || displayImage.includes("/storage/v1/object/");

  return (
    <Link href={`/portfolio/${project.slug}`} className="block h-full cursor-pointer select-none">
      <div
        className={cn(
          "flex flex-col justify-between h-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-premium hover:border-secondary/20 hover:translate-y-[-4px] transition-all duration-300 group"
        )}
      >
        {/* Top: Details */}
        <div className="flex flex-col">
          {/* Category Pill Tag */}
          <span className="font-label-mono text-[10px] tracking-widest text-secondary font-bold uppercase mb-3 block">
            {project.category}
          </span>

          {/* Project Title */}
          <h3
            className={cn(
              "font-headline-sm tracking-tight text-on-background mb-3 font-semibold group-hover:text-secondary transition-colors duration-200",
              isLarge ? "text-headline-md" : "text-headline-sm"
            )}
          >
            {project.title}
          </h3>

          {/* Project Description */}
          <p
            className={cn(
              "font-body-sm text-on-surface-variant leading-relaxed mb-6 line-clamp-3 overflow-hidden",
              isLarge ? "text-body-md" : "text-body-sm"
            )}
          >
            {project.description}
          </p>
        </div>

        {/* Bottom: Image & CTA */}
        <div className="mt-auto flex flex-col gap-6 w-full">
          {/* Cover Image Frame */}
          <div className="relative w-full aspect-[16/10] bg-surface-container rounded-xl overflow-hidden border border-outline-variant/5">
            {project.featured && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-[8px] font-semibold px-2.5 py-1 rounded shadow-sm uppercase tracking-widest">
                <Star className="w-2.5 h-2.5 fill-white text-white" />
                Featured
              </div>
            )}
            <Image
              src={displayImage}
              alt={project.title}
              fill
              unoptimized={isSupabase}
              sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              priority={layoutSize === "featured" || layoutSize === "side"}
            />
          </div>

          {/* Action CTA link */}
          <div className="flex items-center gap-2 font-label-mono text-label-mono text-secondary group-hover:text-primary transition-colors duration-200 mt-2">
            <span>Explore Case Study</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

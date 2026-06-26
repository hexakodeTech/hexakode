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
    <Link href={`/portfolio/${project.slug}`} className="block group relative">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface-container rounded-xl border border-outline-variant/10 shadow-sm group-hover:shadow-premium-hover group-hover:border-secondary-container/30 transition-all duration-300 cursor-pointer select-none",
          heightClass || defaultHeight
        )}
      >
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-semibold px-2.5 py-1 rounded shadow-premium uppercase tracking-widest">
            <Star className="w-2.5 h-2.5 fill-white text-white" />
            Featured
          </div>
        )}

        {/* Next.js Optimized Image */}
        <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
          <Image
            src={displayImage}
            alt={project.title}
            fill
            unoptimized={isSupabase}
            sizes={isLarge ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            priority={layoutSize === "featured" || layoutSize === "side"}
          />
        </div>

        {/* Hover Reveal Overlay Details */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-white select-none z-10",
            isLarge ? "p-12" : "p-8"
          )}
        >
          {/* Category Pill Tag */}
          <span className="font-label-mono text-label-mono text-secondary-container mb-3 tracking-widest uppercase">
            {project.category}
          </span>

          {/* Project Title */}
          <h3
            className={cn(
              "font-headline-md tracking-tight mb-3 text-white",
              isLarge ? "text-headline-md" : "text-headline-sm"
            )}
          >
            {project.title}
          </h3>

          {/* Project Description */}
          <p
            className={cn(
              "font-body-md text-white/80 leading-relaxed mb-4 max-w-xl",
              isLarge ? "text-body-md" : "text-body-sm"
            )}
          >
            {project.description}
          </p>

          {/* Technologies Used (Max 4, then +X) */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6 max-w-xl">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-[9.5px] font-label-mono uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded border border-white/5"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-[9.5px] font-label-mono uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded border border-white/5">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Action CTA link */}
          <div className="flex items-center gap-2 font-label-mono text-label-mono text-secondary-container hover:text-white transition-colors duration-200">
            <span>View Case Study</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

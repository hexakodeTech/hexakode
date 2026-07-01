"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Star } from "lucide-react";
import { PublicProject } from "../../types/portfolio";

interface PortfolioCardProps {
  project: PublicProject;
  layoutSize?: "side" | "standard" | "featured" | "wide";
  heightClass?: string;
}

export default function PortfolioCard({
  project,
  layoutSize,
}: PortfolioCardProps) {
  // Fallback cover image URL
  const defaultPlaceholder = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";
  const displayImage = project.image && project.image.trim() !== "" ? project.image.trim() : defaultPlaceholder;
  const isSupabase = displayImage.includes("supabase.co") || displayImage.includes("/storage/v1/object/");

  return (
    <Link href={`/portfolio/${project.slug}`} className="block h-full cursor-pointer select-none">
      <div
        className={cn(
          "flex flex-col justify-between h-full bg-white border border-[#efefef] rounded-[24px] p-6 md:p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.01)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out hover:-translate-y-2 group"
        )}
        style={{ translate: "0px 0px", scale: 1 }}
      >
        {/* Top: Details */}
        <div className="flex flex-col">
          {/* Category Tag */}
          <span className="font-label-mono text-[10px] tracking-[0.25em] text-secondary font-bold uppercase mb-3 block">
            {project.category}
          </span>

          {/* Project Title */}
          <h3 className="font-poppins text-headline-sm font-bold tracking-tight text-on-background mb-3 group-hover:text-secondary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Project Description (limited to 2-3 lines using line clamping) */}
          <p className="font-body-sm text-on-surface-variant/80 leading-relaxed mb-6 line-clamp-3 overflow-hidden">
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
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              priority={layoutSize === "featured" || layoutSize === "side"}
            />
          </div>

          {/* Action CTA link */}
          <div className="flex items-center gap-2 font-label-mono text-[10px] tracking-[0.18em] text-secondary group-hover:text-primary transition-colors duration-300 mt-2 font-bold uppercase">
            <span>View Case Study</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

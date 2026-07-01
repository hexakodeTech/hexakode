import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Project } from "../../types/home";
import { cn } from "../../lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  const { title, category, imageUrl, tags, href, description, featured } = project;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100/80 hover-lift hover-border-accent hover-glow h-full",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {featured && (
          <span className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary text-white rounded shadow-sm">
            Featured
          </span>
        )}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover hover-image-zoom"
          priority
        />
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="flex flex-col p-6 flex-1 justify-between">
        <div className="flex-1 flex flex-col">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            {category}
          </span>
          <h3 className="text-lg md:text-xl font-bold text-navy-dark leading-snug group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          {description && (
            <p className="text-slate-500 text-xs md:text-sm mt-3 line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-500 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100/60 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 inline-flex items-center gap-1.5 group-hover:text-primary transition-colors duration-200">
            View Case Study
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

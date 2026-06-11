import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "../../types/home";
import { cn } from "../../lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  const { title, category, imageUrl, tags, href } = project;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100/80 transition-all duration-300 hover:shadow-premium hover:translate-y-[-4px]",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority
        />
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col p-6 flex-1">
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-sky-600 mb-2">
          {category}
        </span>
        <h3 className="text-lg md:text-xl font-bold text-navy-dark leading-snug group-hover:text-sky-600 transition-colors duration-200">
          {title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-500 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

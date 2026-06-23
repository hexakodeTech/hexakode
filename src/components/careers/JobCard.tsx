"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight, Tag } from "lucide-react";
import { Job } from "@/types/careers";

// Category → color mapping
const categoryColors: Record<string, { bg: string; text: string }> = {
  Engineering: { bg: "bg-secondary/10", text: "text-secondary" },
  Design: { bg: "bg-primary-fixed/60", text: "text-on-primary-fixed-variant" },
  Product: { bg: "bg-tertiary-fixed/60", text: "text-on-tertiary-fixed-variant" },
  Marketing: { bg: "bg-secondary-fixed/60", text: "text-on-secondary-fixed-variant" },
};

interface JobCardProps {
  job: Job;
  index: number;
  onSelect: (job: Job) => void;
}

export default function JobCard({ job, index, onSelect }: JobCardProps) {
  const color = categoryColors[job.category] ?? categoryColors.Engineering;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
    >
      <button
        onClick={() => onSelect(job)}
        className="w-full text-left group block bg-white rounded-2xl border border-outline-variant/40 p-6 md:p-8 hover:border-secondary/40 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2"
        aria-label={`View ${job.title} role details`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {/* Category badge */}
              <span
                className={`inline-flex items-center gap-1 ${color.bg} ${color.text} font-label-mono text-label-mono uppercase tracking-wider px-3 py-1 rounded-full text-[11px]`}
              >
                <Tag className="w-3 h-3" aria-hidden="true" />
                {job.category}
              </span>
            </div>

            <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors duration-300 mb-3 tracking-tight">
              {job.title}
            </h4>

            {job.excerpt && (
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4 max-w-xl line-clamp-2">
                {job.excerpt}
              </p>
            )}

            {/* Location + type */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-outline" aria-hidden="true" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <Clock className="w-3.5 h-3.5 shrink-0 text-outline" aria-hidden="true" />
                {job.type}
              </span>
            </div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-label-mono text-[11px] text-on-surface-variant/70 bg-surface-container px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: arrow CTA */}
          <div className="shrink-0 flex items-center justify-end md:justify-center">
            <span className="w-10 h-10 rounded-full border border-outline-variant/50 group-hover:border-secondary group-hover:bg-secondary flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

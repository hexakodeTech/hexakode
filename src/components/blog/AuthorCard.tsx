"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveAuthor } from "@/modules/blog/constants/authors";

interface AuthorCardProps {
  author: {
    name: string;
    avatar?: string | null;
    slug?: string;
    role?: string;
    bio?: string;
  };
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const resolved = resolveAuthor(author.slug || author.name);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 w-full shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            Written by
          </span>
          <span className="text-[11px] font-mono text-secondary font-medium px-2 py-0.5 rounded-md bg-secondary-container/15">
            {resolved.role}
          </span>
        </div>

        <Link
          href={`/blog/authors/${resolved.slug}`}
          className="text-base font-bold text-navy-dark hover:text-primary transition-colors leading-tight block group"
        >
          <span className="group-hover:underline underline-offset-4 decoration-secondary">
            {resolved.name}
          </span>
        </Link>

        {resolved.bio && (
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {resolved.bio}
          </p>
        )}
      </div>

      <Link
        href={`/blog/authors/${resolved.slug}`}
        className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-secondary/40 shadow-xs group"
      >
        <span>Read author bio</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

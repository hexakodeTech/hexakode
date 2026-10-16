import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { formatBlogDate as formatPublishDate } from "@/modules/blog/utils/helpers";

export interface BlogCardProps {
  post: {
    title: string;
    slug: string;
    shortDescription: string;
    featuredImage: string | null | undefined | Record<string, unknown>;
    _featuredImageUrl?: string;
    publishedAt: string;
    readingTime?: number;
    category?: {
      name: string;
      slug: string;
    };
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post._featuredImageUrl || (typeof post.featuredImage === "string" ? post.featuredImage : "") || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";

  return (
    <div className="group h-full flex flex-col bg-white rounded-2xl border border-slate-100/80 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
      {/* Post Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-50">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {post.category && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-navy-dark/80 backdrop-blur-sm text-[10px] font-bold tracking-wider text-white uppercase">
            {post.category.name}
          </span>
        )}
      </div>

      {/* Post Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatPublishDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-navy-dark leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mt-3 line-clamp-3">
            {post.shortDescription}
          </p>
        </div>

        {/* Read More button */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-xs font-bold text-navy-dark tracking-wide uppercase group-hover:text-primary transition-colors duration-200"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { formatBlogDate as formatPublishDate } from "@/modules/blog/utils/helpers";

interface FeaturedBlogProps {
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

export default function FeaturedBlog({ post }: FeaturedBlogProps) {
  const imageUrl = post._featuredImageUrl || (typeof post.featuredImage === "string" ? post.featuredImage : "") || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";

  return (
    <div className="group bg-white rounded-3xl border border-slate-100/80 overflow-hidden hover:shadow-premium transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
      {/* Image Block */}
      <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[300px] lg:min-h-[420px] bg-slate-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 100vw, 60vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        {post.category && (
          <span className="absolute top-6 left-6 z-10 px-3.5 py-1.5 rounded-lg bg-primary text-xs font-bold tracking-wider text-white uppercase shadow-sm">
            {post.category.name}
          </span>
        )}
      </div>

      {/* Content Block */}
      <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between text-left">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-secondary-container text-primary border border-secondary-container/40 uppercase tracking-widest mb-6">
            Featured Article
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-dark leading-tight tracking-tight group-hover:text-primary transition-colors duration-200">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mt-4 line-clamp-4 font-normal">
            {post.shortDescription}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatPublishDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </span>
            )}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-bold text-navy-dark tracking-wide uppercase group-hover:text-primary transition-colors duration-200 shrink-0"
          >
            <span>Read Post</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

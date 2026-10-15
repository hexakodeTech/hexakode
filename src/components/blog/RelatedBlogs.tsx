import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatBlogDate as formatPublishDate } from "@/modules/blog/utils/helpers";

interface RelatedBlogItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage?: string | { asset?: { _ref?: string } } | null;
  _featuredImageUrl?: string;
  publishedAt: string;
  readingTime?: number;
  category?: {
    name: string;
    slug: string;
  } | null;
}

interface RelatedBlogsProps {
  posts: RelatedBlogItem[];
}

export default function RelatedBlogs({ posts }: RelatedBlogsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="border-t border-slate-100 pt-16 mt-16 text-left">
      <h2 className="text-xl md:text-2xl font-extrabold text-navy-dark tracking-tight mb-8">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => {
          const imageUrl = post._featuredImageUrl || (typeof post.featuredImage === "string" ? post.featuredImage : "") || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";

          return (
            <div
              key={post._id}
              className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 mb-2.5">
                    <span>{formatPublishDate(post.publishedAt)}</span>
                    {post.readingTime && <span>• {post.readingTime} min read</span>}
                  </div>
                  <h3 className="text-sm font-bold text-navy-dark leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-[10px] font-bold text-navy-dark uppercase group-hover:text-primary transition-colors duration-200"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

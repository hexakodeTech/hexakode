import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBlogs } from "@/modules/blog/services/blog.service";
import { formatBlogDate } from "@/modules/blog/utils/helpers";
import { BlogListItem } from "@/modules/blog/types/blog";

export default async function LatestInsights() {
  let posts: BlogListItem[] = [];
  try {
    const data = await getBlogs({ limit: 3, status: "PUBLISHED" });
    posts = data.posts;
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <Section id="latest-insights" variant="white" spacing="large">
      <Container className="flex flex-col gap-12 text-left">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <SectionHeading
            title="Latest Insights"
            subtitle="Articles, guides, and thoughts on technology, engineering, and digital growth."
            align="left"
            theme="light"
            className="mb-0 max-w-2xl"
          />
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-slate-800 nav-link-underline py-1 group shrink-0 self-start sm:self-auto"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => {
            const imageUrl = post.featuredImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";
            const postDate = post.publishedAt ?? post.createdAt;

            return (
              <div
                key={post.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-premium hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
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

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 text-[10px] font-semibold text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatBlogDate(postDate)}
                      </span>
                      {post.readingTime > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readingTime} min read
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-navy-dark leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-slate-500 text-xs leading-relaxed mt-2.5 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center">
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
      </Container>
    </Section>
  );
}

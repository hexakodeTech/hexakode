"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumb from "@/components/blog/Breadcrumb";
import HTMLRenderer from "@/components/blog/HTMLRenderer";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import AuthorCard from "@/components/blog/AuthorCard";
import NewsletterCTA from "@/components/blog/NewsletterCTA";
import {
  formatBlogDate,
  calculateReadingTime,
  extractTableOfContents,
  normalizeBlogHeadingHierarchy,
} from "@/modules/blog/utils/helpers";

export interface BlogArticleViewData {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  category?: { name: string; slug?: string } | null;
  tags?: Array<{ id?: string; name: string } | { tagId?: string; tag: { name: string } }>;
  authorName?: string | null;
  authorAvatar?: string | null;
}

interface BlogArticleViewProps {
  post: BlogArticleViewData;
  isPreview?: boolean;
  pageUrl?: string;
}

export default function BlogArticleView({
  post,
  isPreview = false,
  pageUrl = "https://hexakode.in/blog/preview",
}: BlogArticleViewProps) {
  const displayTitle = post.title || "Untitled Article";
  const displayImage =
    post.featuredImage && post.featuredImage.trim() !== ""
      ? post.featuredImage
      : "/images/blog-placeholder.svg";

  const normalizedContent = useMemo(
    () => normalizeBlogHeadingHierarchy(post.content || "", displayTitle),
    [post.content, displayTitle]
  );

  const readingTime = useMemo(
    () => calculateReadingTime(normalizedContent),
    [normalizedContent]
  );

  const headings = useMemo(
    () => extractTableOfContents(normalizedContent),
    [normalizedContent]
  );

  const normalizedTags = useMemo(() => {
    if (!post.tags) return [];
    return post.tags.map((t, idx: number) => {
      if ("name" in t && typeof t.name === "string") return { id: t.id || `tag-${idx}`, name: t.name };
      if ("tag" in t && t.tag?.name) return { id: t.tagId || `tag-${idx}`, name: t.tag.name };
      return { id: `tag-${idx}`, name: String(t) };
    });
  }, [post.tags]);

  const displayDate = formatBlogDate(
    post.publishedAt || post.createdAt || new Date()
  );

  return (
    <div className="flex-1 flex flex-col w-full bg-background overflow-x-hidden">
      {/* Article Header */}
      <Section
        variant="muted"
        className="py-10 md:py-14 border-b border-outline-variant/10 text-left"
      >
        <Container className="max-w-4xl">
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: displayTitle, href: pageUrl },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3.5 mb-6 mt-4">
            {post.category?.name && (
              <span className="px-3.5 py-1 rounded-lg bg-primary text-xs font-bold tracking-wider text-white uppercase shadow-sm">
                {post.category.name}
              </span>
            )}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {displayDate}
              </span>
              {readingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </span>
              )}
            </div>
          </div>

          <h1 className="font-headline-xl text-display-sm md:text-display-md text-navy-dark font-extrabold tracking-tight leading-tight mb-6">
            {displayTitle}
          </h1>

          {post.excerpt && (
            <p className="font-body-lg text-body-lg text-slate-500 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          )}
        </Container>
      </Section>

      {/* Article Content Grid */}
      <Section variant="white" spacing="large" className="pt-10 pb-20 text-left">
        <Container className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Body */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Featured Image */}
            <div className="relative w-full aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-2xl border border-slate-100/80 bg-slate-50 shadow-sm">
              <Image
                src={displayImage}
                alt={displayTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>

            {/* Rich Content Renderer */}
            <div className="mt-2">
              <HTMLRenderer html={normalizedContent || "<p class='text-slate-400 italic'>No content written yet.</p>"} />
            </div>

            {/* Article Tags */}
            {normalizedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-100">
                {normalizedTags.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 text-xs font-semibold"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {t.name}
                  </span>
                ))}
              </div>
            )}

            {/* Author Card & Share */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-slate-100 items-center">
              <AuthorCard
                author={{
                  name: post.authorName || "HexaKode Team",
                  avatar: post.authorAvatar || undefined,
                }}
              />
              <div className="flex md:justify-end">
                <ShareButtons url={pageUrl} title={displayTitle} />
              </div>
            </div>
          </div>

          {/* Sticky Sidebar / Table of Contents */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28 self-start hidden lg:flex">
            {!isPreview && (
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors group self-start border border-slate-100 rounded-xl px-4 py-2 bg-slate-50/30"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Back to Blog</span>
              </Link>
            )}

            {headings.length > 0 ? (
              <TableOfContents headings={headings} />
            ) : (
              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 text-xs text-slate-400 italic">
                Add H2 or H3 headings to auto-generate Table of Contents.
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Footer CTA & Newsletter Section */}
      <Section variant="white" className="border-t border-slate-100/60 pb-16 bg-slate-50/30">
        <Container>
          <NewsletterCTA />
        </Container>
      </Section>
    </div>
  );
}

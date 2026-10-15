import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BlogArticleView from "@/components/blog/BlogArticleView";
import {
  getPublishedBlogBySlug,
  getAllPublishedBlogSlugs,
  incrementBlogViews,
} from "@/modules/blog/services/blog.service";
import { extractFaqEntries } from "@/modules/blog/utils/helpers";
import { resolveAuthor } from "@/modules/blog/constants/authors";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

import {
  constructMetadata,
  clampTitle,
  clampDescription,
  constructBlogPostingJsonLd,
  constructBreadcrumbJsonLd,
  safeJsonLdStringify,
} from "@/lib/seo";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPublishedBlogBySlug(slug).catch(() => null);
  if (!post) {
    return {
      title: "Blog Post Not Found | HexaKode",
      robots: { index: false, follow: false },
    };
  }

  const fallbackTitle = post.title.length + 11 <= 59 ? `${post.title} | HexaKode` : post.title;
  const title = clampTitle(post.seoTitle || fallbackTitle);
  const description = clampDescription(post.metaDescription || post.excerpt || "");
  const rawCanonical = post.canonicalUrl?.trim();
  const canonical = rawCanonical
    ? rawCanonical.replace(/^https?:\/\/www\.hexakode\.in/, "https://hexakode.in")
    : `/blog/${post.slug}`;
  const image = post.ogImage || post.featuredImage;

  return constructMetadata({
    title,
    description,
    path: canonical,
    image,
    imageAlt: title,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    authors: [resolveAuthor(post.authorName).name],
  });
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedBlogSlugs().catch(() => []);
  return slugs.map((slug: string) => ({ slug }));
}

export default async function BlogDetailPage(props: PageProps) {
  const { slug } = await props.params;

  const post = await getPublishedBlogBySlug(slug).catch(() => null);
  if (!post) notFound();

  // Async: increment views (non-blocking)
  incrementBlogViews(post.id).catch(() => {});

  const resolvedAuthor = resolveAuthor(post.authorName);
  const faqEntries = extractFaqEntries(post.content);
  const pageUrl = `/blog/${post.slug}`;
  const displayImage = post.featuredImage || "/images/blog-placeholder.svg";

  // BlogPosting JSON-LD
  const blogPostingJsonLd = constructBlogPostingJsonLd({
    slug: post.slug,
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    authorName: resolvedAuthor.name,
    authorSlug: resolvedAuthor.slug,
    image: displayImage,
  });

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = constructBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  // FAQ JSON-LD
  const faqJsonLd = faqEntries.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }}
        />
      )}

      <Navbar />
      <ReadingProgress />

      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-28">
        <BlogArticleView post={post} pageUrl={pageUrl} />
      </main>

      <Footer />
    </>
  );
}

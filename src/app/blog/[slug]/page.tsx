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

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

import {
  constructMetadata,
  constructBlogPostingJsonLd,
  safeJsonLdStringify,
  SITE_URL,
} from "@/lib/seo";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPublishedBlogBySlug(slug).catch(() => null);
  if (!post) notFound();

  const title = post.seoTitle || `${post.title} | HexaKode Blog`;
  const description = post.metaDescription || post.excerpt || "";
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
    authors: [post.authorName],
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
    authorName: post.authorName,
    image: displayImage,
  });

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

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

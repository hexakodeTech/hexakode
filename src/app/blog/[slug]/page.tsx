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

import { constructMetadata } from "@/lib/seo";

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

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: displayImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: "HexaKode",
      logo: { "@type": "ImageObject", url: "/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  // Breadcrumb JSON-LD
  const SITE_URL = "https://hexakode.in";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: new URL("/", SITE_URL).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: new URL("/blog", SITE_URL).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <Navbar />
      <ReadingProgress />

      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-28">
        <BlogArticleView post={post} pageUrl={pageUrl} />
      </main>

      <Footer />
    </>
  );
}

import React, { Suspense } from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SearchBox from "@/components/blog/SearchBox";
import CategoryFilter from "@/components/blog/CategoryFilter";
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import BlogGrid from "@/components/blog/BlogGrid";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { getBlogs, getFeaturedBlog } from "@/modules/blog/services/blog.service";
import { getAllCategories } from "@/modules/blog/services/category.service";
import { BlogCategoryData, BlogListItem } from "@/modules/blog/types/blog";

export const dynamic = "force-dynamic";

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "HexaKode Blog | Engineering & Product Design Insights",
  description:
    "Read the latest articles on web engineering, mobile apps, UI/UX design, technology consulting, and software development insights from the HexaKode team.",
  path: "/blog",
  image: "/og-image.png",
  imageAlt: "HexaKode Blog — Engineering & Product Design Insights",
  keywords: [
    "Software Engineering Blog",
    "Web Development Insights",
    "Mobile App Architecture",
    "UI/UX Design Trends",
    "HexaKode Blog",
  ],
});

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    tag?: string;
    sort?: "newest" | "oldest";
    page?: string;
  }>;
}

export default async function BlogIndexPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const category = searchParams.category || "";
  const tag = searchParams.tag || "";
  const sort = (searchParams.sort as "newest" | "oldest") || "newest";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 12;

  const [rawCategories, featuredPost, blogsData] = await Promise.all([
    getAllCategories().catch(() => []),
    getFeaturedBlog().catch(() => null),
    getBlogs({ search, category, tag, sort, page, limit, status: "PUBLISHED" }).catch(() => ({ posts: [], total: 0 })),
  ]);

  // Adapt to CategoryFilter's expected shape
  const categories = rawCategories.map((c: BlogCategoryData) => ({
    _id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const { posts, total } = blogsData;

  const showFeatured = page === 1 && !search && !category && !tag && !!featuredPost;

  // Adapt posts to match BlogCard/Grid expected shape
  const adaptPost = (p: BlogListItem) => ({
    _id: p.id,
    title: p.title,
    slug: p.slug,
    shortDescription: p.excerpt || "",
    featuredImage: p.featuredImage ? { asset: { _ref: p.featuredImage } } : null,
    _featuredImageUrl: p.featuredImage,
    publishedAt: p.publishedAt?.toISOString() ?? p.createdAt.toISOString(),
    readingTime: p.readingTime,
    featured: p.featured,
    author: { name: p.authorName, avatar: p.authorAvatar },
    category: p.category ? { name: p.category.name, slug: p.category.slug } : undefined,
    tags: p.tags?.map((t: { tag: { id: string; name: string; slug: string } }) => ({ name: t.tag.name, slug: t.tag.slug })) ?? [],
  });

  const adaptedFeatured = featuredPost ? adaptPost(featuredPost) : null;
  const displayPosts = showFeatured
    ? posts.filter((p: BlogListItem) => p.id !== featuredPost!.id).map(adaptPost)
    : posts.map(adaptPost);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-28">
        <Section variant="muted" className="py-16 md:py-20 border-b border-outline-variant/10 text-left">
          <Container className="max-w-4xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
              ]}
              className="mb-6"
            />
            <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-secondary-container text-primary border border-secondary-container/40 uppercase tracking-widest mb-4">
              Latest Insights
            </span>
            <h1 className="font-headline-xl text-display-md md:text-display-lg text-navy-dark font-extrabold tracking-tight leading-none mb-6">
              Insights &amp; Engineering Excellence
            </h1>
            <p className="font-body-lg text-body-lg text-slate-500 max-w-2xl leading-relaxed">
              Explore professional viewpoints and guides covering modern technology stacks, UI/UX systems, mobile developments, and digital strategies.
            </p>
          </Container>
        </Section>

        <Section variant="white" className="py-8 border-b border-slate-100/60 text-left">
          <Container className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <Suspense fallback={<div className="h-10 bg-slate-100 rounded-xl w-64 animate-pulse" />}>
              <CategoryFilter categories={categories} />
            </Suspense>
            <Suspense fallback={<div className="h-10 bg-slate-100 rounded-xl w-64 animate-pulse" />}>
              <SearchBox />
            </Suspense>
          </Container>
        </Section>

        <Section variant="white" spacing="large" className="pt-16 pb-24">
          <Container className="flex flex-col gap-16">
            {showFeatured && adaptedFeatured && (
              <div className="w-full">
                <FeaturedBlog post={adaptedFeatured} />
              </div>
            )}
            <div className="w-full">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                }
              >
                <BlogGrid
                  posts={displayPosts}
                  total={showFeatured ? total - 1 : total}
                  limit={limit}
                />
              </Suspense>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}

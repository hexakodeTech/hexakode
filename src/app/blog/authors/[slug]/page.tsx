import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import BlogCard from "@/components/blog/BlogCard";
import {
  getAuthorBySlug,
  getAllAuthors,
} from "@/modules/blog/constants/authors";
import { getPublishedBlogsByAuthor } from "@/modules/blog/services/blog.service";
import {
  constructMetadata,
  constructAuthorProfileJsonLd,
  safeJsonLdStringify,
} from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export async function generateStaticParams() {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const title = `${author.name} — Author Profile | HexaKode`;
  const description = `${author.name} is ${author.role} at HexaKode. Read published engineering articles, software insights, and technical guides.`;

  return constructMetadata({
    title,
    description,
    path: `/blog/authors/${author.slug}`,
    type: "profile",
  });
}

function getAuthorSearchNames(slug: string, name: string): string[] {
  if (slug === "navaneeth-pp") {
    return [name, "Navaneeth", "Navaneeth P P", "HexaKode Team"];
  }
  if (slug === "prajosh-c") {
    return [name, "Prajosh", "Prajosh C"];
  }
  if (slug === "prajith") {
    return [name, "Prajith"];
  }
  return [name];
}

export default async function AuthorProfilePage(props: PageProps) {
  const { slug } = await props.params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const searchNames = getAuthorSearchNames(author.slug, author.name);
  const posts = await getPublishedBlogsByAuthor(searchNames);

  // Author Profile & Person JSON-LD
  const authorJsonLd = constructAuthorProfileJsonLd({
    slug: author.slug,
    name: author.name,
    role: author.role,
    bio: author.bio,
    socialUrl: author.socialUrl,
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: author.name, href: `/blog/authors/${author.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(authorJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 w-full bg-background pt-28">
        {/* Author Profile Header */}
        <Section
          variant="muted"
          className="py-12 md:py-16 border-b border-outline-variant/10 text-left"
        >
          <Container className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="space-y-4">
              <span className="font-label-mono text-xs uppercase tracking-widest text-secondary font-semibold px-3 py-1 rounded-full bg-secondary-container/20 border border-secondary/20 inline-block">
                {author.role}
              </span>

              <h1 className="font-headline-xl text-display-sm md:text-display-md text-navy-dark font-extrabold tracking-tight">
                {author.name}
              </h1>

              {author.bio && (
                <p className="font-body-lg text-body-lg text-slate-600 leading-relaxed max-w-3xl pt-2">
                  {author.bio}
                </p>
              )}

              {author.socialUrl && (
                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href={author.socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 px-4 py-2 rounded-xl hover:text-primary hover:border-secondary/40 shadow-xs transition-all"
                  >
                    <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />
                    <span>Connect on LinkedIn</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Areas of Expertise */}
            {author.expertise && author.expertise.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {author.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200/70 text-slate-600 text-xs font-medium shadow-2xs"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </Section>

        {/* Articles by Author */}
        <Section variant="white" spacing="large" className="py-16 text-left">
          <Container className="max-w-6xl">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-100">
              <h2 className="font-headline-md text-headline-md text-navy-dark font-bold tracking-tight">
                Articles by {author.name} ({posts.length})
              </h2>
              <Link
                href="/blog"
                className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
              >
                View all articles →
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={{
                      title: post.title,
                      slug: post.slug,
                      shortDescription: post.excerpt || "",
                      featuredImage: post.featuredImage,
                      publishedAt: post.publishedAt
                        ? post.publishedAt.toISOString()
                        : post.createdAt.toISOString(),
                      readingTime: post.readingTime,
                      category: post.category
                        ? {
                            name: post.category.name,
                            slug: post.category.slug,
                          }
                        : undefined,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center max-w-lg mx-auto">
                <p className="text-sm text-slate-500 mb-4">
                  No published articles found for this author yet.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Explore All Articles
                </Link>
              </div>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}

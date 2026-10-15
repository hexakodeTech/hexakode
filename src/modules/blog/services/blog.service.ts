import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { GetBlogsParams, GetBlogsResult, CreateBlogInput, UpdateBlogInput } from "@/modules/blog/types/blog";
import { BlogStatus } from "../../../generated/prisma/client";
import { calculateReadingTime } from "@/modules/blog/utils/helpers";

export interface FooterRecentPost {
  id: string;
  title: string;
  slug: string;
  publishedAt?: string | null;
}

/**
 * Fetch the 3 most recent published blog posts for the shared footer.
 * Uses unstable_cache with a 60-second TTL and tag 'recent-posts'
 * so all pages share the same cached query without unnecessary DB load.
 */
export const getRecentPostsForFooter = unstable_cache(
  async (): Promise<FooterRecentPost[]> => {
    try {
      const posts = await prisma.blog.findMany({
        where: { status: BlogStatus.PUBLISHED },
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
      });

      return posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      }));
    } catch (error) {
      console.error("Failed to query recent posts for footer:", error);
      return [];
    }
  },
  ["footer-recent-posts"],
  {
    revalidate: 60,
    tags: ["recent-posts", "blogs"],
  }
);

const blogInclude = {
  category: { select: { id: true, name: true, slug: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
};

/**
 * Fetch paginated, filtered list of blogs.
 */
export async function getBlogs({
  search,
  category,
  tag,
  status,
  featured,
  sort = "newest",
  page = 1,
  limit = 12,
}: GetBlogsParams = {}): Promise<GetBlogsResult> {
  const where: any = {};

  if (status) where.status = status;
  if (featured !== undefined) where.featured = featured;

  if (category) {
    where.category = { slug: category };
  }
  if (tag) {
    where.tags = { some: { tag: { slug: tag } } };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: blogInclude,
        orderBy: sort === "oldest" ? { publishedAt: "asc" } : { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    return { posts: posts as any, total };
  } catch (error) {
    console.error("Failed to query blogs (tables may not be migrated):", error);
    return { posts: [], total: 0 };
  }
}

/**
 * Fetch a single blog by slug (published only, for frontend).
 */
export async function getPublishedBlogBySlug(slug: string) {
  try {
    return await prisma.blog.findFirst({
      where: { slug, status: BlogStatus.PUBLISHED },
      include: blogInclude,
    });
  } catch (error) {
    console.error("Failed to query blog by slug:", error);
    return null;
  }
}

/**
 * Fetch a single blog by id (admin use).
 */
export async function getBlogById(id: string) {
  try {
    return await prisma.blog.findUnique({
      where: { id },
      include: blogInclude,
    });
  } catch (error) {
    console.error("Failed to query blog by id:", error);
    return null;
  }
}

/**
 * Fetch the latest featured published blog.
 */
export async function getFeaturedBlog() {
  try {
    return await prisma.blog.findFirst({
      where: { status: BlogStatus.PUBLISHED, featured: true },
      include: blogInclude,
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to query featured blog:", error);
    return null;
  }
}

/**
 * Fetch related blogs (same category first, fallback to latest).
 */
export async function getRelatedBlogs(blogId: string, categoryId?: string | null, limit = 4) {
  try {
    const related = await prisma.blog.findMany({
      where: {
        id: { not: blogId },
        status: BlogStatus.PUBLISHED,
        ...(categoryId ? { categoryId } : {}),
      },
      include: blogInclude,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    if (related.length < limit) {
      const more = await prisma.blog.findMany({
        where: {
          id: { notIn: [blogId, ...related.map((r) => r.id)] },
          status: BlogStatus.PUBLISHED,
        },
        include: blogInclude,
        orderBy: { publishedAt: "desc" },
        take: limit - related.length,
      });
      return [...related, ...more];
    }

    return related;
  } catch (error) {
    console.error("Failed to query related blogs:", error);
    return [];
  }
}

/**
 * Fetch all published slug list (for generateStaticParams).
 */
export async function getAllPublishedBlogSlugs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: BlogStatus.PUBLISHED },
      select: { slug: true },
    });
    return blogs.map((b) => b.slug);
  } catch (error) {
    console.error("Failed to query blog slugs:", error);
    return [];
  }
}

/**
 * Increment view count for a blog.
 */
export async function incrementBlogViews(id: string) {
  return prisma.blog.update({ where: { id }, data: { views: { increment: 1 } } });
}

/**
 * Create a new blog post.
 */
export async function createBlog(input: CreateBlogInput) {
  const { tagIds, content, readingTime, ...rest } = input;
  const rt = readingTime ?? calculateReadingTime(content ?? "");

  return prisma.blog.create({
    data: {
      ...rest,
      content: content ?? "",
      readingTime: rt,
      publishedAt: rest.status === "PUBLISHED" ? rest.publishedAt ?? new Date() : rest.publishedAt,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: blogInclude,
  });
}

/**
 * Update an existing blog post.
 */
export async function updateBlog(id: string, input: UpdateBlogInput) {
  const { tagIds, content, readingTime, ...rest } = input;
  const rt = content !== undefined
    ? (readingTime ?? calculateReadingTime(content))
    : readingTime;

  const data: any = { ...rest };
  if (content !== undefined) data.content = content;
  if (rt !== undefined) data.readingTime = rt;

  // Auto-set publishedAt when transitioning to PUBLISHED
  if (rest.status === "PUBLISHED") {
    const existing = await prisma.blog.findUnique({ where: { id }, select: { publishedAt: true, status: true } });
    if (existing?.status !== BlogStatus.PUBLISHED && !rest.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  return prisma.blog.update({
    where: { id },
    data: {
      ...data,
      ...(tagIds !== undefined
        ? {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId) => ({ tagId })),
            },
          }
        : {}),
    },
    include: blogInclude,
  });
}

/**
 * Delete a blog post.
 */
export async function deleteBlog(id: string) {
  return prisma.blog.delete({ where: { id } });
}

/**
 * Bulk delete blog posts.
 */
export async function bulkDeleteBlogs(ids: string[]) {
  return prisma.blog.deleteMany({ where: { id: { in: ids } } });
}

/**
 * Bulk update status.
 */
export async function bulkUpdateBlogStatus(ids: string[], status: BlogStatus) {
  return prisma.blog.updateMany({
    where: { id: { in: ids } },
    data: {
      status,
      ...(status === BlogStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
    },
  });
}

/**
 * Duplicate a blog post (creates a draft copy).
 */
export async function duplicateBlog(id: string) {
  const original = await getBlogById(id);
  if (!original) throw new Error("Blog not found");

  const baseSlug = `${original.slug}-copy`;
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.blog.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return prisma.blog.create({
    data: {
      title: `${original.title} (Copy)`,
      slug,
      excerpt: original.excerpt,
      content: original.content,
      featuredImage: original.featuredImage,
      authorName: original.authorName,
      authorAvatar: original.authorAvatar,
      status: BlogStatus.DRAFT,
      featured: false,
      categoryId: original.categoryId,
      readingTime: original.readingTime,
      seoTitle: original.seoTitle,
      metaDescription: original.metaDescription,
      focusKeyword: original.focusKeyword,
      canonicalUrl: "",
      ogImage: original.ogImage,
      tags: { create: original.tags.map((t) => ({ tagId: t.tagId })) },
    },
    include: blogInclude,
  });
}

/**
 * Admin stats summary.
 */
export async function getBlogStats() {
  try {
    const [total, published, drafts, featured, totalViews] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: BlogStatus.PUBLISHED } }),
      prisma.blog.count({ where: { status: BlogStatus.DRAFT } }),
      prisma.blog.count({ where: { featured: true } }),
      prisma.blog.aggregate({ _sum: { views: true } }),
    ]);
    return { total, published, drafts, featured, totalViews: totalViews._sum.views ?? 0 };
  } catch (error) {
    console.error("Failed to query blog stats:", error);
    return { total: 0, published: 0, drafts: 0, featured: 0, totalViews: 0 };
  }
}

/**
 * Fetch all published blogs for a specific author by name or matching aliases.
 */
export async function getPublishedBlogsByAuthor(authorNames: string[]) {
  try {
    return await prisma.blog.findMany({
      where: {
        status: BlogStatus.PUBLISHED,
        authorName: { in: authorNames },
      },
      include: blogInclude,
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to query blogs by author:", error);
    return [];
  }
}


// ─────────────────────────────────────────────
// Blog Module — TypeScript Types
// ─────────────────────────────────────────────

export type BlogStatus = "DRAFT" | "PUBLISHED";

export interface BlogCategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { blogs: number };
}

export interface BlogTagData {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string;
  authorName: string;
  authorAvatar: string;
  status: BlogStatus;
  featured: boolean;
  publishedAt: Date | null;
  readingTime: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  contentUpdatedAt?: Date | null;
  category: { id: string; name: string; slug: string } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
}

export interface BlogDetail extends BlogListItem {
  content: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
}

export interface GetBlogsParams {
  search?: string;
  category?: string;
  tag?: string;
  status?: BlogStatus;
  featured?: boolean;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface GetBlogsResult {
  posts: BlogListItem[];
  total: number;
}

export interface CreateBlogInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorName?: string;
  authorAvatar?: string;
  status?: BlogStatus;
  featured?: boolean;
  categoryId?: string;
  publishedAt?: Date;
  contentUpdatedAt?: Date | null;
  readingTime?: number;
  tagIds?: string[];
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export type UpdateBlogInput = Partial<CreateBlogInput>;

"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "../lib/supabaseAdmin";
import {
  PortfolioProjectSchema,
} from "../validation/schemas";
import { PortfolioProject, PortfolioFilters, PortfolioFormData, PortfolioCategory, PortfolioStatus } from "../types";
import { verifyAdminAuth } from "../../../lib/auth/utils";

interface DbProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  clientName: string;
  projectUrl: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  featured: boolean;
  showOnHomepage: boolean;
  allowPreview: boolean;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  gallery: {
    id: string;
    imageUrl: string;
    alt: string;
    displayOrder: number;
  }[];
  technologies: {
    id: string;
    name: string;
  }[];
  features: {
    id: string;
    title: string;
    description: string;
    displayOrder: number;
  }[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

// Helper function to map Prisma project model to frontend PortfolioProject interface
function mapToFrontend(dbProj: DbProject): PortfolioProject {
  return {
    id: dbProj.id,
    title: dbProj.title,
    slug: dbProj.slug,
    category: dbProj.category as PortfolioCategory,
    clientName: dbProj.clientName || "",
    projectUrl: dbProj.projectUrl || "",
    shortDescription: dbProj.shortDescription,
    longDescription: dbProj.fullDescription || "",
    coverImage: dbProj.coverImage || "",
    gallery: (dbProj.gallery || [])
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((g) => ({
        id: g.id,
        url: g.imageUrl,
        alt: g.alt || "",
        isCover: g.displayOrder === 0,
      })),
    technologies: (dbProj.technologies || []).map((t) => t.name),
    features: (dbProj.features || [])
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
      })),
    seo: {
      metaTitle: dbProj.metaTitle || "",
      metaDescription: dbProj.metaDescription || "",
      ogImage: dbProj.ogImage || "",
    },
    settings: {
      featured: dbProj.featured,
      showOnHomepage: dbProj.showOnHomepage,
      allowPreview: dbProj.allowPreview,
    },
    status: dbProj.status as PortfolioStatus,
    publishedAt: dbProj.publishedAt ? dbProj.publishedAt.toISOString() : null,
    createdAt: dbProj.createdAt.toISOString(),
    updatedAt: dbProj.updatedAt.toISOString(),
  };
}

/**
 * Get portfolio list from database based on filters and sorting
 */
export async function getPortfolioListAction(filters: PortfolioFilters): Promise<{
  success: boolean;
  projects?: PortfolioProject[];
  error?: string;
}> {
  await verifyAdminAuth();
  try {
    const where: Prisma.PortfolioProjectWhereInput = {};

    // 1. Search filter (title, description, client name, technologies)
    if (filters.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
        { clientName: { contains: q, mode: "insensitive" } },
        { technologies: { some: { name: { contains: q, mode: "insensitive" } } } },
      ];
    }

    // 2. Category filter
    if (filters.category && filters.category !== "All") {
      where.category = filters.category;
    }

    // 3. Status filter
    if (filters.status && filters.status !== "All") {
      where.status = filters.status;
    }

    // 4. Sorting
    let orderBy: Record<string, "asc" | "desc"> | Record<string, "asc" | "desc">[] = { createdAt: "desc" };
    if (filters.sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (filters.sort === "featured") {
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
    }

    const list = await prisma.portfolioProject.findMany({
      where,
      orderBy,
      include: {
        gallery: true,
        technologies: true,
        features: true,
      },
    });

    return {
      success: true,
      projects: list.map((p) => mapToFrontend(p as unknown as DbProject)),
    };
  } catch (error: unknown) {
    console.error("Error fetching portfolio projects:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to fetch portfolio list.";
    return {
      success: false,
      error: errMessage,
    };
  }
}

/**
 * Get a single portfolio project details
 */
export async function getPortfolioDetailsAction(id: string): Promise<{
  success: boolean;
  project?: PortfolioProject;
  error?: string;
}> {
  await verifyAdminAuth();
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        gallery: true,
        technologies: true,
        features: true,
      },
    });

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    return {
      success: true,
      project: mapToFrontend(project as unknown as DbProject),
    };
  } catch (error: unknown) {
    console.error("Error fetching portfolio project details:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to fetch project details.";
    return {
      success: false,
      error: errMessage,
    };
  }
}

/**
 * Create a new portfolio project
 */
export async function createPortfolioAction(data: PortfolioFormData): Promise<{
  success: boolean;
  project?: PortfolioProject;
  error?: string;
}> {
  await verifyAdminAuth();
  try {
    // 1. Validate inputs using Zod
    const validated = PortfolioProjectSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid project data.",
      };
    }

    const payload = validated.data;

    // 2. Validate unique slug
    const existing = await prisma.portfolioProject.findUnique({
      where: { slug: payload.slug },
    });
    if (existing) {
      return {
        success: false,
        error: `A project with the slug "${payload.slug}" already exists.`,
      };
    }

    // Determine publishedAt timestamp
    const now = new Date();
    const publishedAt = payload.status === "Published" ? now : null;

    // 3. Create project in database
    const created = await prisma.portfolioProject.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        category: payload.category,
        clientName: payload.clientName || "",
        projectUrl: payload.projectUrl || "",
        shortDescription: payload.shortDescription,
        fullDescription: payload.longDescription || "",
        coverImage: payload.coverImage || "",
        featured: payload.settings.featured,
        showOnHomepage: payload.settings.showOnHomepage,
        allowPreview: payload.settings.allowPreview,
        status: payload.status,
        publishedAt,
        metaTitle: payload.seo.metaTitle || "",
        metaDescription: payload.seo.metaDescription || "",
        ogImage: payload.seo.ogImage || "",
        technologies: {
          create: payload.technologies.map((name) => ({ name })),
        },
        gallery: {
          create: payload.gallery.map((g, idx) => ({
            imageUrl: g.url,
            displayOrder: idx,
            alt: g.alt || "",
          })),
        },
        features: {
          create: payload.features.map((f, idx) => ({
            title: f.title,
            description: f.description,
            displayOrder: idx,
          })),
        },
      },
      include: {
        gallery: true,
        technologies: true,
        features: true,
      },
    });

    revalidatePath("/admin/cms/portfolio");
    return {
      success: true,
      project: mapToFrontend(created),
    };
  } catch (error: unknown) {
    console.error("Error creating portfolio project:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to create portfolio project.";
    return {
      success: false,
      error: errMessage,
    };
  }
}

/**
 * Update an existing portfolio project
 */
export async function updatePortfolioAction(
  id: string,
  data: PortfolioFormData
): Promise<{
  success: boolean;
  project?: PortfolioProject;
  error?: string;
}> {
  await verifyAdminAuth();
  try {
    // 1. Validate inputs using Zod
    const validated = PortfolioProjectSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid project data.",
      };
    }

    const payload = validated.data;

    // 2. Validate unique slug (excluding current project)
    const existing = await prisma.portfolioProject.findFirst({
      where: {
        slug: payload.slug,
        id: { not: id },
      },
    });
    if (existing) {
      return {
        success: false,
        error: `A project with the slug "${payload.slug}" already exists.`,
      };
    }

    const currentProject = await prisma.portfolioProject.findUnique({
      where: { id },
    });
    if (!currentProject) {
      return { success: false, error: "Project not found." };
    }

    // Determine publishedAt timestamp
    let publishedAt = currentProject.publishedAt;
    if (payload.status === "Published" && !publishedAt) {
      publishedAt = new Date();
    } else if (payload.status === "Draft") {
      publishedAt = null;
    }

    // 3. Update database using transaction to re-sync nested lists
    const updated = await prisma.$transaction(async (tx) => {
      // Clear old nested lists
      await tx.technology.deleteMany({ where: { portfolioId: id } });
      await tx.galleryImage.deleteMany({ where: { portfolioId: id } });
      await tx.feature.deleteMany({ where: { portfolioId: id } });

      // Update main project fields and write new lists
      return await tx.portfolioProject.update({
        where: { id },
        data: {
          title: payload.title,
          slug: payload.slug,
          category: payload.category,
          clientName: payload.clientName || "",
          projectUrl: payload.projectUrl || "",
          shortDescription: payload.shortDescription,
          fullDescription: payload.longDescription || "",
          coverImage: payload.coverImage || "",
          featured: payload.settings.featured,
          showOnHomepage: payload.settings.showOnHomepage,
          allowPreview: payload.settings.allowPreview,
          status: payload.status,
          publishedAt,
          metaTitle: payload.seo.metaTitle || "",
          metaDescription: payload.seo.metaDescription || "",
          ogImage: payload.seo.ogImage || "",
          technologies: {
            create: payload.technologies.map((name) => ({ name })),
          },
          gallery: {
            create: payload.gallery.map((g, idx) => ({
              imageUrl: g.url,
              displayOrder: idx,
              alt: g.alt || "",
            })),
          },
          features: {
            create: payload.features.map((f, idx) => ({
              title: f.title,
              description: f.description,
              displayOrder: idx,
            })),
          },
        },
        include: {
          gallery: true,
          technologies: true,
          features: true,
        },
      });
    });

    revalidatePath("/admin/cms/portfolio");
    return {
      success: true,
      project: mapToFrontend(updated),
    };
  } catch (error: unknown) {
    console.error("Error updating portfolio project:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to update portfolio project.";
    return {
      success: false,
      error: errMessage,
    };
  }
}

/**
 * Delete a portfolio project
 */
export async function deletePortfolioAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  await verifyAdminAuth();
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    // 1. Delete database record (cascading handles child tables)
    await prisma.portfolioProject.delete({
      where: { id },
    });

    // 2. Clean up storage files (both cover and gallery images)
    try {
      const storageUrls: string[] = [];
      if (project.coverImage) storageUrls.push(project.coverImage);
      project.gallery.forEach((g) => {
        if (g.imageUrl) storageUrls.push(g.imageUrl);
      });

      const pathsToDelete = storageUrls
        .map((url) => {
          // Parse public URL to find storage relative path
          // Format is: .../storage/v1/object/public/portfolio-assets/{path}
          const parts = url.split("/portfolio-assets/");
          return parts.length > 1 ? parts[1] : null;
        })
        .filter((p): p is string => !!p);

      if (pathsToDelete.length > 0) {
        const supabase = createSupabaseAdminClient();
        await supabase.storage.from("portfolio-assets").remove(pathsToDelete);
        console.log(`Deleted ${pathsToDelete.length} images from Supabase Storage.`);
      }
    } catch (storageErr) {
      // Graceful error handling for storage failures per requirements
      console.warn("Gracefully handled storage cleanup error:", storageErr);
    }

    revalidatePath("/admin/cms/portfolio");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting portfolio project:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to delete portfolio project.";
    return {
      success: false,
      error: errMessage,
    };
  }
}

/**
 * Duplicate a portfolio project
 */
export async function duplicatePortfolioAction(id: string): Promise<{
  success: boolean;
  project?: PortfolioProject;
  error?: string;
}> {
  await verifyAdminAuth();
  try {
    const source = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        gallery: true,
        technologies: true,
        features: true,
      },
    });

    if (!source) {
      return { success: false, error: "Source project not found." };
    }

    // Generate unique slug
    let newSlug = `${source.slug}-copy`;
    let exists = await prisma.portfolioProject.findUnique({
      where: { slug: newSlug },
    });
    let counter = 1;
    while (exists) {
      newSlug = `${source.slug}-copy-${counter}`;
      exists = await prisma.portfolioProject.findUnique({
        where: { slug: newSlug },
      });
      counter++;
    }

    // Duplicate project
    const duplicated = await prisma.portfolioProject.create({
      data: {
        title: `${source.title} (Copy)`,
        slug: newSlug,
        category: source.category,
        clientName: source.clientName,
        projectUrl: source.projectUrl,
        shortDescription: source.shortDescription,
        fullDescription: source.fullDescription,
        coverImage: source.coverImage,
        featured: false, // Default to false for copies
        showOnHomepage: source.showOnHomepage,
        allowPreview: source.allowPreview,
        status: "Draft", // Always duplicate as Draft
        publishedAt: null,
        metaTitle: source.metaTitle ? `${source.metaTitle} (Copy)` : "",
        metaDescription: source.metaDescription,
        ogImage: source.ogImage,
        technologies: {
          create: source.technologies.map((t) => ({ name: t.name })),
        },
        gallery: {
          create: source.gallery.map((g) => ({
            imageUrl: g.imageUrl,
            displayOrder: g.displayOrder,
            alt: g.alt,
          })),
        },
        features: {
          create: source.features.map((f) => ({
            title: f.title,
            description: f.description,
            displayOrder: f.displayOrder,
          })),
        },
      },
      include: {
        gallery: true,
        technologies: true,
        features: true,
      },
    });

    revalidatePath("/admin/cms/portfolio");
    return {
      success: true,
      project: mapToFrontend(duplicated),
    };
  } catch (error: unknown) {
    console.error("Error duplicating portfolio project:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to duplicate project.";
    return {
      success: false,
      error: errMessage,
    };
  }
}


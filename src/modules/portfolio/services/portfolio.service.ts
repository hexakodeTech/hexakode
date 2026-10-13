import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { PublicProject, mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";

/**
 * Fetch all published projects sorted by featured first, then published date.
 */
export async function getPublishedProjects() {
  return await prisma.portfolioProject.findMany({
    where: {
      status: "Published",
    },
    orderBy: [
      { featured: "desc" },
      { publishedAt: "desc" },
    ],
    include: {
      technologies: true,
      gallery: true,
      features: true,
    },
  });
}

/**
 * Fetch and transform all published portfolio projects for public rendering.
 * Cached with unstable_cache for optimal TTFB and shared across SSR and API routes.
 */
export const getPublicPortfolioProjects = unstable_cache(
  async (): Promise<PublicProject[]> => {
    try {
      const dbProjects = await getPublishedProjects();

      let featuredCount = 0;
      let standardCount = 0;

      return dbProjects.map((p) => {
        const publicCategory = mapDbCategoryToPublic(p.category);

        let layoutSize: "featured" | "side" | "standard" | "wide";
        if (p.featured) {
          layoutSize = featuredCount % 2 === 0 ? "featured" : "wide";
          featuredCount++;
        } else {
          layoutSize = standardCount % 3 === 0 ? "side" : "standard";
          standardCount++;
        }

        return {
          id: p.id,
          title: p.title,
          category: publicCategory,
          description: p.shortDescription,
          image: p.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
          featured: p.featured,
          slug: p.slug,
          layoutSize,
          client: p.clientName || "Internal Project",
          year: p.publishedAt
            ? new Date(p.publishedAt).getFullYear().toString()
            : new Date(p.createdAt).getFullYear().toString(),
          role: `${publicCategory} Architecture & Engineering`,
          techStack: p.technologies.map((t) => t.name),
          challenge: p.shortDescription,
          approach: p.fullDescription || "Designed and implemented robust technical architecture.",
          results: "Delivered scalable, high-performance solution that met all client objectives.",
        };
      });
    } catch (error: unknown) {
      console.error("Failed to fetch public portfolio projects:", error);
      return [];
    }
  },
  ["public-portfolio-projects"],
  {
    revalidate: 60,
    tags: ["portfolio", "public-projects"],
  }
);

/**
 * Fetch a single published project details by slug.
 */
export async function getPublishedProjectBySlug(slug: string) {
  return await prisma.portfolioProject.findFirst({
    where: {
      slug,
      status: "Published",
    },
    include: {
      technologies: true,
      gallery: true,
      features: true,
    },
  });
}

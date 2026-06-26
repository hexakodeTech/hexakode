import prisma from "@/lib/prisma";

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

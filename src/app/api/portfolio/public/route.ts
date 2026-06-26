import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbProjects = await getPublishedProjects();

    let featuredCount = 0;
    let standardCount = 0;

    const projects = dbProjects.map((p) => {
      const publicCategory = mapDbCategoryToPublic(p.category);

      // Determine layoutSize dynamically matching the balanced visual grid
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
        // Fallback to placeholder if coverImage is empty
        image: p.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
        featured: p.featured,
        slug: p.slug,
        layoutSize,
        // Spec details
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

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("Public fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load public portfolio projects." },
      { status: 500 }
    );
  }
}

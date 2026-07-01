import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TechnologiesSection from "@/components/home/TechnologiesSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/layout/Footer";
import { getPublishedProjects } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";
import { Project } from "@/types/home";

export const dynamic = "force-dynamic";

export default async function Home() {
  let mappedProjects: Project[] = [];
  try {
    const dbProjects = await getPublishedProjects();
    const featuredProjects = dbProjects.filter((p) => p.featured).slice(0, 3);
    
    mappedProjects = featuredProjects.map((p) => {
      const publicCategory = mapDbCategoryToPublic(p.category);
      return {
        id: p.id,
        title: p.title,
        category: publicCategory,
        imageUrl: p.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
        tags: p.technologies.map((t) => t.name),
        href: `/portfolio/${p.slug}`,
        description: p.shortDescription,
        featured: p.featured,
      };
    });
  } catch (error) {
    console.error("Error loading featured projects on homepage:", error);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-[32px] md:pt-[20px]">
        <HeroSection />
        <TechnologiesSection />
        <ServicesSection />
        <ProjectsSection projects={mappedProjects} />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

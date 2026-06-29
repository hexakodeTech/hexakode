import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, User, Tag, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PortfolioCTA from "@/components/portfolio/PortfolioCTA";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { getPublishedProjects, getPublishedProjectBySlug } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";
import PortfolioGallery from "@/modules/portfolio/components/public/PortfolioGallery";


// Type definition for detailed project specification
interface CaseStudyDetails {
  client: string;
  year: string;
  role: string;
  techStack: string[];
  challenge: string;
  approach: string;
  results: string;
}

// Map of mock project details mapping slug keys to details object
const CASE_STUDY_METADATA: Record<string, CaseStudyDetails> = {
  "enterprise-data-nexus": {
    client: "Global Logistics Corp",
    year: "2025",
    role: "Full Stack Architecture & Optimization",
    techStack: ["Next.js", "Go", "PostgreSQL", "Kafka", "Docker", "Kubernetes"],
    challenge: "Handling 15M+ daily transaction logs with real-time updates without bottlenecking database writes or causing analytics lag.",
    approach: "Introduced an asynchronous message queue buffer using Kafka and optimized heavy writes via bulk database insert procedures.",
    results: "Reduced database CPU load by 45% and improved tracking query latency to sub-100ms globally.",
  },
  "finstream-mobile": {
    client: "FinStream Technologies",
    year: "2025",
    role: "Mobile App Development & Cryptography",
    techStack: ["React Native", "TypeScript", "Node.js", "Firebase Auth", "Biometric APIs"],
    challenge: "Building a biometrically secured mobile banking solution with low-latency transfers and AI-driven wealth alerts.",
    approach: "Implemented face and touch ID integration alongside custom cryptographic signature generation for secure transfers.",
    results: "Achieved 99.99% transaction success rates and maintained a steady 4.8 star App Store rating.",
  },
  "aerosystem-portal": {
    client: "AeroMaintenance Group",
    year: "2024",
    role: "UI/UX Engineering & Cognitive Systems",
    techStack: ["Figma", "React", "Tailwind CSS", "Framer Motion", "D3.js"],
    challenge: "Designing a high-density, safety-critical aerospace UI that avoids operator fatigue and cognitive overload.",
    approach: "Created a customized dark mode design system with strict color hierarchy, layout grids, and visual alarms.",
    results: "Decreased inspection logging errors by 32% and shortened operator onboarding times by half.",
  },
  "cloudflow-infrastructure": {
    client: "CloudFlow Inc.",
    year: "2025",
    role: "DevOps & SRE Consulting",
    techStack: ["AWS", "Terraform", "GitHub Actions", "Prometheus", "Grafana"],
    challenge: "Ensuring 99.99% uptime for a rapidly expanding SaaS suite with highly volatile daily traffic surges.",
    approach: "Designed a multi-region self-healing microservices cluster using Terraform, auto-scaling, and health check alerts.",
    results: "Successfully scaled traffic by 300% during peak hours while keeping infrastructure costs within constraints.",
  },
  "autocode-engine": {
    client: "HexaKode Internal R&D",
    year: "2024",
    role: "Machine Learning & Automation",
    techStack: ["Python", "PyTorch", "FastAPI", "React", "Rust"],
    challenge: "Migrating millions of lines of legacy enterprise code to modern frameworks efficiently.",
    approach: "Trained specialized neural pattern matchers to automate 80% of syntax translation and validation tests.",
    results: "Cut down project migration timelines from months to weeks, achieving 98% accuracy on compiled outputs.",
  },
  "omnicommerce-360": {
    client: "OmniBrands Global",
    year: "2025",
    role: "E-Commerce Architecture & API Orchestration",
    techStack: ["Next.js 16", "GraphQL", "Shopify Hydrogen", "Tailwind CSS"],
    challenge: "Synchronizing real-time inventory counts across 250+ physical stores and multiple digital storefronts.",
    approach: "Built a headless GraphQL orchestration layer that unified ERP stock counts with high-performance edge caching.",
    results: "Reduced out-of-stock ordering errors to zero and boosted client page load speed by 2.4x.",
  },
};

export async function generateStaticParams() {
  const dbProjects = await getPublishedProjects();
  return dbProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const project = await getPublishedProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: "Project Not Found | HexaKode",
    };
  }

  return {
    title: `${project.title} | HexaKode Portfolio`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const dbProject = await getPublishedProjectBySlug(params.slug);

  if (!dbProject) {
    notFound();
  }

  const publicCategory = mapDbCategoryToPublic(dbProject.category);
  const defaultPlaceholder = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";
  const displayImage = dbProject.coverImage && dbProject.coverImage.trim() !== "" ? dbProject.coverImage.trim() : defaultPlaceholder;
  const isSupabase = displayImage.includes("supabase.co") || displayImage.includes("/storage/v1/object/");

  const project = {
    id: dbProject.id,
    title: dbProject.title,
    category: publicCategory,
    description: dbProject.shortDescription,
    image: displayImage,
    slug: dbProject.slug,
  };

  const mockDetails = CASE_STUDY_METADATA[dbProject.slug];
  const details = {
    client: dbProject.clientName || mockDetails?.client || "Internal Project",
    year: dbProject.publishedAt 
      ? new Date(dbProject.publishedAt).getFullYear().toString()
      : dbProject.createdAt
        ? new Date(dbProject.createdAt).getFullYear().toString()
        : mockDetails?.year || new Date().getFullYear().toString(),
    role: dbProject.category ? `${publicCategory} Architecture & Engineering` : mockDetails?.role || `${publicCategory} Architecture & Design`,
    techStack: dbProject.technologies.length > 0
      ? dbProject.technologies.map((t) => t.name)
      : mockDetails?.techStack || [],
    challenge: dbProject.shortDescription || mockDetails?.challenge || "",
    approach: dbProject.fullDescription || mockDetails?.approach || "Designed and implemented robust technical architecture using modern development standards.",
    results: mockDetails?.results || (dbProject.features.length > 0 ? dbProject.features.map(f => `${f.title}: ${f.description}`).join(". ") : "Successfully integrated with standard system benchmarks."),
  };

  const rawGallery = dbProject.gallery || [];
  const galleryImages = rawGallery
    .map((img: any, idx: number) => {
      if (typeof img === "string") {
        return {
          url: img,
          alt: `Gallery image ${idx + 1}`,
          order: idx,
        };
      }
      const url = img.imageUrl || img.url || "";
      const alt = img.alt || `Gallery image ${idx + 1}`;
      const order =
        typeof img.displayOrder === "number"
          ? img.displayOrder
          : typeof img.order === "number"
          ? img.order
          : idx;
      return { url, alt, order };
    })
    .filter((img) => img.url && img.url.trim() !== "")
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-20">
        
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-surface-container-low border-b border-outline-variant/10">
          <Container className="relative z-10">
            {/* Back Button */}
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-label-mono text-label-mono text-on-surface-variant hover:text-primary mb-8 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              BACK TO PORTFOLIO
            </Link>

            {/* COVER IMAGE */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-surface-container rounded-2xl md:rounded-3xl overflow-hidden border border-outline-variant/10 shadow-premium mb-10 animate-fade-in">
              <Image
                src={project.image}
                alt={project.title}
                fill
                loading="lazy"
                unoptimized={isSupabase}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <div className="max-w-4xl">
              {/* Category pill */}
              <span className="inline-block px-3 py-1 font-label-mono text-label-mono uppercase tracking-widest text-secondary bg-secondary/5 rounded mb-4">
                {project.category}
              </span>
              
              <h1 className="font-headline-xl text-display-lg md:text-display-lg text-on-background mb-6 tracking-tight">
                {project.title}
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>
          </Container>
        </section>

        {/* Content Section */}
        <Section id="case-study-content" variant="white" spacing="large">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Main details (8 columns on lg) */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              
              {/* Narratives */}
              <div className="flex flex-col gap-12">
                {/* 3. Our Engineering Approach (Descriptive content only, heading removed) */}
                <div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {details.approach}
                  </p>
                </div>

                {/* 4. Redesigned Key Features cards */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-headline-md text-headline-sm text-on-background uppercase tracking-wider border-l-2 border-secondary pl-4">
                    Key Features
                  </h3>
                  <div className="flex flex-col gap-6">
                    {dbProject.features && dbProject.features.length > 0 ? (
                      [...dbProject.features]
                        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                        .map((feature) => (
                          <div
                            key={feature.id}
                            className="p-6 md:p-8 bg-surface-container-lowest border border-outline-variant/15 rounded-xl hover-lift hover-glow transition-all duration-300 hover:border-secondary/40"
                          >
                            <h4 className="font-headline-sm text-headline-sm text-on-background mb-3">
                              {feature.title}
                            </h4>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="font-body-md text-body-md text-on-surface-variant/60 italic">
                        No features specified for this project.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              <PortfolioGallery images={galleryImages} />
            </div>


            {/* Right: Info panel (4 columns on lg) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 shadow-sm flex flex-col gap-8">
                
                <h4 className="font-headline-sm text-headline-sm text-on-background pb-4 border-b border-outline-variant/10">
                  Project Specs
                </h4>

                <div className="flex flex-col gap-6">
                  {/* Client */}
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">Client</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">{details.client}</span>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">Year</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">{details.year}</span>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-start gap-4">
                    <Layers className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">Role</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">{details.role}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-4">
                    <Tag className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">Category</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">{project.category}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/10">
                  <span className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider mb-4">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {details.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-surface-container text-on-surface font-label-mono text-[10px] rounded border border-outline-variant/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact#contact-form"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-on-primary font-label-mono text-label-mono rounded hover:bg-secondary transition-colors duration-300 mt-2"
                >
                  Inquire About Similar <ExternalLink className="w-4 h-4" />
                </Link>

              </div>
            </div>

          </Container>
        </Section>

        {/* CTA Section */}
        <PortfolioCTA />

      </main>
      <Footer />
    </>
  );
}

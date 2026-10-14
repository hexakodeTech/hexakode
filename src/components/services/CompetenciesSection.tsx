"use client";

import React from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Palette, TrendingUp, LucideIcon } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import ServiceCard from "./ServiceCard";
import FeaturedServiceCard from "./FeaturedServiceCard";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { ServiceViewTracker } from "@/components/common/AnalyticsTracker";

interface CompetencyData {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags?: string[];
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  featured?: boolean;
  bulletPoints?: string[];
}

const COMPETENCIES_DATA: CompetencyData[] = [
  {
     id: "web-development",
     title: "Web Development & Engineering",
     description:
       "We build robust, scalable web applications using modern frameworks that prioritize speed, SEO, and maintainability. Our frontend and backend architectures are decoupled for maximum flexibility.",
     icon: Monitor,
     tags: ["NEXT.JS", "TYPESCRIPT", "PYTHON"],
     href: "/services/web-development",
     imageSrc:
       "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
     imageAlt: "A high-contrast, professional overhead shot of a clean developer workspace.",
     featured: false,
   },
   {
     id: "mobile-apps",
     title: "Mobile Apps",
     description:
       "Native and cross-platform mobile experiences that feel seamless. We focus on low latency and fluid animations.",
     icon: Smartphone,
     tags: ["FLUTTER", "React Native"],
     href: "/services/mobile-app-development",
     imageSrc: "/service-mobile.png",
     imageAlt: "A clean developer workspace with a smartphone and tablet showcasing a modern mobile application dashboard.",
     featured: false,
   },
   {
     id: "ui-ux",
     title: "UI/UX Design",
     description:
       "Scientific approach to interface design. We create systems that balance aesthetics with conversion-focused usability.",
     icon: Palette,
     tags: ["Figma", "Google Stitch"],
     href: "/services/ui-ux-design",
     imageSrc: "/service-design.png",
     imageAlt: "A creative designer workspace with wireframe templates on an iPad, color palettes, and sketches.",
     featured: false,
   },
   {
     id: "digital-marketing",
     title: "Digital Marketing",
     description:
       "Data-driven marketing strategies that generate leads and elevate brand authority. From technical SEO to Google Ads and social campaigns.",
     icon: TrendingUp,
     tags: ["SEO", "Google Ads", "Social Media"],
     href: "/services/digital-marketing",
     imageSrc: "/hero-graphics.webp",
     imageAlt: "Abstract technological analytics and growth dashboard graphic.",
     featured: false,
   },
 ];

export default function CompetenciesSection() {
  return (
    <Section id="services-grid" variant="surface-container-low" spacing="medium" className="pb-16 md:pb-20">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          <motion.div variants={fadeUp}>
            <SectionHeading
              badge="Capabilities"
              title="Core Competencies"
              align="left"
              underline={true}
              titleSize="lg"
            />
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={staggerContainer}
            className="bento-grid mt-4"
          >
            {COMPETENCIES_DATA.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className={
                  item.id === "ui-ux"
                    ? "col-span-12 md:col-span-12 lg:col-span-4"
                    : "col-span-12 md:col-span-6 lg:col-span-4"
                }
              >
                <ServiceViewTracker serviceName={item.title} />
                {item.featured ? (
                  <FeaturedServiceCard
                    title={item.title}
                    description={item.description}
                    bulletPoints={item.bulletPoints}
                  />
                ) : (
                  <ServiceCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    tags={item.tags}
                    href={item.href}
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Palette, Cloud, Cpu, LucideIcon } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import ServiceCard from "./ServiceCard";
import FeaturedServiceCard from "./FeaturedServiceCard";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface CompetencyData {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags?: string[];
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  largeLayout: boolean;
  featured: boolean;
  bulletPoints?: string[];
}

const COMPETENCIES_DATA: CompetencyData[] = [
  {
    id: "web-engineering",
    title: "Web Engineering",
    description:
      "We build robust, scalable web applications using modern frameworks that prioritize speed, SEO, and maintainability. Our frontend and backend architectures are decoupled for maximum flexibility.",
    icon: Monitor,
    tags: ["NEXT.JS", "TYPESCRIPT", "PYTHON"],
    href: "#web-service",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6NzGYXdHHJOX6c-0Ta6wB4k8Y2PRyUaoyzoawDZJn0W1d1lnwroM_Nbpkmv-DLo4LnfQzHq3m51wv4rGUFSDeMD1YgdVuNfHxtTe2ABUeKlVlbmRZX-J5lxxy296k9CwJiZ3WRwZ01UAR3ZFeCGiJI91gXUj-_GH7oOF2zJ52RfDUKqq9cuEWBzJjDIF1PiGz0ps0pbHAd6R-lQabKCOc6SjBrc0n6yMWiIktohJe9F1BNmUjSPxcTEzZxK08NHbyrSgSIOaZ6ae6",
    imageAlt: "A high-contrast, professional overhead shot of a clean developer workspace.",
    largeLayout: true,
    featured: false,
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile experiences that feel seamless. We focus on low latency and fluid animations.",
    icon: Smartphone,
    tags: ["FLUTTER", "SWIFT"],
    href: "#mobile-service",
    largeLayout: false,
    featured: false,
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    description:
      "Scientific approach to interface design. We create systems that balance aesthetics with conversion-focused usability.",
    icon: Palette,
    href: "#ui-service",
    largeLayout: false,
    featured: false,
  },
  {
    id: "cloud-api",
    title: "Cloud & API Infrastructure",
    description:
      "Engineered for uptime. We design microservices and serverless architectures that handle millions of requests without breaking a sweat. Security-first integration for third-party ecosystems.",
    icon: Cloud, // represented with Cloud and Cpu in FeaturedCard
    href: "#cloud-service",
    largeLayout: true,
    featured: true,
    bulletPoints: ["99.9% UPTIME SLAS", "AWS/AZURE EXPERTS"],
  },
];

export default function CompetenciesSection() {
  return (
    <Section id="services-grid" variant="surface-container-low" spacing="large">
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
                className={item.largeLayout ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4"}
              >
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
                    largeLayout={item.largeLayout}
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

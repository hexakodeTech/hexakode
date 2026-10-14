import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CareersHero from "@/components/careers/CareersHero";
import WhyHexaKode from "@/components/careers/WhyHexaKode";
import OpenRoles from "@/components/careers/OpenRoles";
import HiringProcess from "@/components/careers/HiringProcess";
import BenefitsSection from "@/components/careers/BenefitsSection";
import GeneralApplicationCTA from "@/components/careers/GeneralApplicationCTA";
import CareersFAQ from "@/components/careers/CareersFAQ";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Careers | HexaKode",
  description:
    "Join HexaKode and help build world-class software products. Explore open roles in engineering, design, product, and technology.",
  path: "/careers",
  image: "/og-image.png",
  imageAlt: "Careers at HexaKode",
  keywords: [
    "Careers at HexaKode",
    "Engineering Jobs Kerala",
    "Developer Jobs Palakkad",
    "Tech Careers",
    "Software Engineering Jobs",
  ],
});

// ─── JSON-LD Organization + JobPosting schema ────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Careers — HexaKode",
  url: "https://hexakode.in/careers",
  description:
    "Explore open engineering, design, and product roles at HexaKode.",
  publisher: {
    "@type": "Organization",
    "@id": "https://hexakode.in/#organization",
    name: "HexaKode",
    url: "https://hexakode.in",
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 pt-20">
          {/* 1 · Hero */}
          <CareersHero />

          {/* 2 · Why HexaKode — culture cards */}
          <WhyHexaKode />

          {/* 3 · Open Roles — filterable job list */}
          <OpenRoles />

          {/* 4 · How We Hire — hiring process steps */}
          <HiringProcess />

          {/* 5 · Benefits */}
          <BenefitsSection />

          {/* 6 · General Application CTA */}
          <GeneralApplicationCTA />

          {/* 7 · FAQ */}
          <CareersFAQ />
        </main>

        <Footer />
      </div>
    </>
  );
}

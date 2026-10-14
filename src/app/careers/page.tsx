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

export const metadata: Metadata = {
  title: "Careers | HexaKode",
  description:
    "Join HexaKode and help build world-class software products. Explore open roles in engineering, design, product, and technology.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers | HexaKode",
    description:
      "Join HexaKode and help build world-class software products. Explore open roles in engineering, design, product, and technology.",
    url: "/careers",
    siteName: "HexaKode",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/careers-hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Careers at HexaKode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | HexaKode",
    description:
      "Build world-class software with HexaKode. Explore open roles in engineering, design, and product.",
    images: ["/careers-hero-bg.png"],
  },
  robots: { index: true, follow: true },
};

// ─── JSON-LD Organization + JobPosting schema ────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "HexaKode",
      url: "https://www.hexakode.in",
      logo: "/logo-icon.png",
      email: "contact@hexakode.in",
      telephone: "+91 95398 28694",
      description:
        "HexaKode is a software engineering company that builds custom web applications, mobile apps, SaaS platforms, and digital solutions.",
      sameAs: [
        "https://www.linkedin.com/company/hexakode",
        "https://twitter.com/hexakode",
      ],
    },
    {
      "@type": "WebPage",
      name: "Careers — HexaKode",
      url: "/careers",
      description:
        "Explore open engineering, design, and product roles at HexaKode.",
      publisher: {
        "@type": "Organization",
        name: "HexaKode",
      },
    },
  ],
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

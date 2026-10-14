import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TermsHero from "@/components/legal/TermsHero";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { termsMeta, termsSections } from "@/data/terms-of-service";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service | HexaKode",
  description:
    "Read the Terms of Service governing the use of HexaKode's website, services, software solutions, and digital platforms.",
  path: "/terms-of-service",
  image: "/og-image.png",
  imageAlt: "HexaKode Terms of Service",
});

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service — HexaKode",
  description:
    "Terms of Service for HexaKode. Governs access to the website, products, services, and digital platforms.",
  url: "/terms-of-service",
  publisher: {
    "@type": "Organization",
    name: "HexaKode",
    url: "https://hexakode.in",
    email: "contact@hexakode.in",
    telephone: "+91 95398 28694",
    logo: { "@type": "ImageObject", url: "/logo-icon.png" },
  },
  dateModified: "2026-06-01",
  inLanguage: "en",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          <TermsHero meta={termsMeta} />
          <LegalPageLayout
            meta={termsMeta}
            sections={termsSections}
            preamble={
              <>
                Welcome to <strong className="text-on-surface">HexaKode</strong>. These
                Terms of Service govern your access to and use of the HexaKode website,
                products, services, applications, and related platforms. By accessing our
                website, you agree to comply with these Terms. If you do not agree, please
                do not use our website or services.
              </>
            }
            footerNote={
              <>
                These Terms were last updated in{" "}
                <strong className="text-on-surface">{termsMeta.lastUpdated}</strong>.
                For questions, contact us at{" "}
                <a
                  href={`mailto:${termsMeta.email}`}
                  className="text-secondary hover:underline underline-offset-2 transition-colors"
                >
                  {termsMeta.email}
                </a>
                . Also see our{" "}
                <a
                  href="/privacy-policy"
                  className="text-secondary hover:underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </>
            }
          />
        </main>
        <Footer />
      </div>
    </>
  );
}

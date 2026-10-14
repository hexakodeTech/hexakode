import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyHero from "@/components/legal/PrivacyHero";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { privacyMeta, privacySections } from "@/data/privacy-policy";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | HexaKode",
  description:
    "Learn how HexaKode collects, uses, stores, and protects your personal information when you visit our website or use our services.",
  path: "/privacy-policy",
  image: "/og-image.png",
  imageAlt: "HexaKode Privacy Policy",
});

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy — HexaKode",
  description:
    "Privacy Policy for HexaKode. Explains data collection, usage, storage, and your rights.",
  url: "/privacy-policy",
  publisher: {
    "@type": "Organization",
    "@id": "https://hexakode.in/#organization",
    name: "HexaKode",
    url: "https://hexakode.in",
  },
  dateModified: "2026-06-01",
  inLanguage: "en",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          <PrivacyHero meta={privacyMeta} />
          <LegalPageLayout
            meta={privacyMeta}
            sections={privacySections}
            preamble={
              <>
                At <strong className="text-on-surface">HexaKode</strong>, we value your
                privacy and are committed to protecting your personal information. By using
                our website, you agree to the practices described in this policy.
              </>
            }
            footerNote={
              <>
                This Privacy Policy was last updated in{" "}
                <strong className="text-on-surface">{privacyMeta.lastUpdated}</strong>.
                For questions, contact us at{" "}
                <a
                  href={`mailto:${privacyMeta.email}`}
                  className="text-secondary hover:underline underline-offset-2 transition-colors"
                >
                  {privacyMeta.email}
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

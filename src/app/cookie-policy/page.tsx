import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieHero from "@/components/legal/CookieHero";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { cookieMeta, cookieSections } from "@/data/cookie-policy";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Cookie Policy | HexaKode",
  description:
    "Learn how HexaKode uses cookies and similar technologies to improve website functionality, performance, security, and user experience.",
  path: "/cookie-policy",
  image: "/og-image.png",
  imageAlt: "HexaKode Cookie Policy",
});

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cookie Policy — HexaKode",
  description:
    "Cookie Policy for HexaKode. Explains what cookies are, how they are used, and how to manage them.",
  url: "/cookie-policy",
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

export default function CookiePolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          <CookieHero meta={cookieMeta} />
          <LegalPageLayout
            meta={cookieMeta}
            sections={cookieSections}
            preamble={
              <>
                This Cookie Policy explains how{" "}
                <strong className="text-on-surface">HexaKode</strong> uses cookies and
                similar technologies when you visit our website — what they are, why we use
                them, how they improve your experience, and how you can control them. By
                continuing to use our website, you consent to the use of cookies as
                described in this policy unless disabled through your browser settings.
              </>
            }
            footerNote={
              <>
                This Cookie Policy was last updated in{" "}
                <strong className="text-on-surface">{cookieMeta.lastUpdated}</strong>.
                For questions, contact us at{" "}
                <a
                  href={`mailto:${cookieMeta.email}`}
                  className="text-secondary hover:underline underline-offset-2 transition-colors"
                >
                  {cookieMeta.email}
                </a>
                . Also see our{" "}
                <a
                  href="/privacy-policy"
                  className="text-secondary hover:underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="/terms-of-service"
                  className="text-secondary hover:underline underline-offset-2 transition-colors"
                >
                  Terms of Service
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

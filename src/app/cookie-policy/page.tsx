import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieHero from "@/components/legal/CookieHero";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { cookieMeta, cookieSections } from "@/data/cookie-policy";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Cookie Policy | HexaKode",
  description:
    "Learn how HexaKode uses cookies and similar technologies to improve website functionality, performance, security, and user experience.",
  alternates: {
    canonical: "https://www.hexakode.in/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy | HexaKode",
    description:
      "Learn how HexaKode uses cookies and similar technologies to improve website functionality, performance, security, and user experience.",
    url: "https://www.hexakode.in/cookie-policy",
    siteName: "HexaKode",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy | HexaKode",
    description:
      "Learn how HexaKode uses cookies and similar technologies on its website.",
  },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cookie Policy — HexaKode",
  description:
    "Cookie Policy for HexaKode. Explains what cookies are, how they are used, and how to manage them.",
  url: "https://www.hexakode.in/cookie-policy",
  publisher: {
    "@type": "Organization",
    name: "HexaKode",
    url: "https://www.hexakode.in",
    email: "contact@hexakode.in",
    logo: { "@type": "ImageObject", url: "https://www.hexakode.in/logo-icon.png" },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

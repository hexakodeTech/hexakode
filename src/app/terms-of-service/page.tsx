import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TermsHero from "@/components/legal/TermsHero";
import TermsTableOfContents from "@/components/legal/TermsTableOfContents";
import TermsSection from "@/components/legal/TermsSection";
import TermsLastUpdated from "@/components/legal/TermsLastUpdated";
import { termsMeta, termsSections } from "@/data/terms-of-service";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Terms of Service | HexaKode",
  description:
    "Read the Terms of Service governing the use of HexaKode's website, services, software solutions, and digital platforms.",
  alternates: {
    canonical: "https://www.hexakode.in/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | HexaKode",
    description:
      "Read the Terms of Service governing the use of HexaKode's website, services, software solutions, and digital platforms.",
    url: "https://www.hexakode.in/terms-of-service",
    siteName: "HexaKode",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | HexaKode",
    description:
      "Read the Terms of Service governing the use of HexaKode's website and services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service — HexaKode",
  description:
    "Terms of Service for HexaKode, a software development company. Governs access to the website, products, services, and digital platforms.",
  url: "https://www.hexakode.in/terms-of-service",
  publisher: {
    "@type": "Organization",
    name: "HexaKode",
    url: "https://www.hexakode.in",
    email: "contact@hexakode.in",
    logo: {
      "@type": "ImageObject",
      url: "https://www.hexakode.in/logo-icon.png",
    },
  },
  dateModified: "2026-06-01",
  inLanguage: "en",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TermsOfServicePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 pt-20">
          {/* Hero */}
          <TermsHero meta={termsMeta} />

          {/* Content */}
          <div className="bg-background">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">

              {/* Last updated badge */}
              <div className="mb-10">
                <TermsLastUpdated date={termsMeta.lastUpdated} />
              </div>

              <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

                {/* ── Sidebar TOC (desktop) ── */}
                <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
                  <TermsTableOfContents sections={termsSections} />
                </aside>

                {/* ── Main article ── */}
                <article className="flex-1 min-w-0 max-w-3xl">

                  {/* Mobile collapsible TOC */}
                  <details className="lg:hidden mb-10 rounded-xl border border-outline-variant/40 bg-surface-container-low overflow-hidden">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-xs select-none">
                      <span>Contents</span>
                      <span className="text-outline text-lg leading-none">+</span>
                    </summary>
                    <div className="px-5 pb-5 pt-2">
                      <ol className="space-y-1">
                        {termsSections.map((s) => (
                          <li key={s.id}>
                            <a
                              href={`#${s.id}`}
                              className="flex items-start gap-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                              <span className="font-label-mono text-xs text-outline tabular-nums mt-0.5">
                                {String(s.number).padStart(2, "0")}
                              </span>
                              {s.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </details>

                  {/* Introduction preamble */}
                  <div className="rounded-xl border border-secondary/20 bg-secondary/5 px-6 py-5 mb-12">
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Welcome to <strong className="text-on-surface">HexaKode</strong>. These
                      Terms of Service govern your access to and use of the HexaKode website,
                      products, services, applications, and related platforms. By accessing or
                      using our website, you agree to comply with these Terms. If you do not
                      agree, please do not use our website or services.
                    </p>
                  </div>

                  {/* Sections */}
                  <div className="space-y-0">
                    {termsSections.map((section) => (
                      <TermsSection key={section.id} section={section} />
                    ))}
                  </div>

                  {/* Footer note */}
                  <div className="mt-16 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-5">
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
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
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

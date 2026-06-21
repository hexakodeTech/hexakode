import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyHero from "@/components/legal/PrivacyHero";
import PrivacyTableOfContents from "@/components/legal/PrivacyTableOfContents";
import PrivacySection from "@/components/legal/PrivacySection";
import PrivacyLastUpdated from "@/components/legal/PrivacyLastUpdated";
import { privacyMeta, privacySections } from "@/data/privacy-policy";

// ─── SEO Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Privacy Policy | HexaKode",
  description:
    "Learn how HexaKode collects, uses, stores, and protects your personal information when you visit our website or use our services.",
  alternates: {
    canonical: "https://www.hexakode.in/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | HexaKode",
    description:
      "Learn how HexaKode collects, uses, stores, and protects your personal information when you visit our website or use our services.",
    url: "https://www.hexakode.in/privacy-policy",
    siteName: "HexaKode",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | HexaKode",
    description:
      "Learn how HexaKode collects, uses, stores, and protects your personal information.",
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
  name: "Privacy Policy — HexaKode",
  description:
    "Privacy Policy for HexaKode, a software development company. Explains data collection, usage, storage, and your rights.",
  url: "https://www.hexakode.in/privacy-policy",
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

export default function PrivacyPolicyPage() {
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
          <PrivacyHero meta={privacyMeta} />

          {/* Content — sidebar TOC + article body */}
          <div className="bg-background">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">

              {/* Last Updated badge — visible above article */}
              <div className="mb-10">
                <PrivacyLastUpdated date={privacyMeta.lastUpdated} />
              </div>

              <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

                {/* ── Sidebar TOC (desktop only) ── */}
                <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
                  <PrivacyTableOfContents sections={privacySections} />
                </aside>

                {/* ── Main article ── */}
                <article className="flex-1 min-w-0 max-w-3xl">

                  {/* Mobile TOC disclosure */}
                  <details className="lg:hidden mb-10 rounded-xl border border-outline-variant/40 bg-surface-container-low overflow-hidden">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-xs select-none">
                      <span>Contents</span>
                      <span className="text-outline text-lg leading-none">+</span>
                    </summary>
                    <div className="px-5 pb-5 pt-2">
                      <ol className="space-y-1">
                        {privacySections.map((s) => (
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

                  {/* Intro preamble */}
                  <div className="rounded-xl border border-secondary/20 bg-secondary/5 px-6 py-5 mb-12">
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      At <strong className="text-on-surface">HexaKode</strong>, we value
                      your privacy and are committed to protecting your personal information.
                      By using our website, you agree to the practices described in this policy.
                    </p>
                  </div>

                  {/* Sections */}
                  <div className="space-y-0">
                    {privacySections.map((section) => (
                      <PrivacySection key={section.id} section={section} />
                    ))}
                  </div>

                  {/* Footer note */}
                  <div className="mt-16 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-5">
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
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

import React from "react";
import { PolicyMeta, PolicySection } from "@/types/legal";
import PrivacyLastUpdated from "./PrivacyLastUpdated";
import PrivacyTableOfContents from "./PrivacyTableOfContents";
import PrivacySection from "./PrivacySection";

interface LegalPageLayoutProps {
  /** Page/document metadata (lastUpdated, email, etc.) */
  meta: PolicyMeta;
  /** All sections — drives both the TOC and the article body */
  sections: PolicySection[];
  /** Short intro blurb rendered in the highlighted preamble box */
  preamble: React.ReactNode;
  /** Optional closing note (cross-links, contact info) at article bottom */
  footerNote?: React.ReactNode;
}

/**
 * Shared layout for all HexaKode legal pages (Privacy Policy, Terms of Service, Cookie Policy).
 * Renders: last-updated badge → desktop sticky sidebar TOC → collapsible mobile TOC
 * → preamble box → sections list → optional footer note.
 *
 * Only the hero (above this component) and the page-level metadata differ between pages.
 */
export default function LegalPageLayout({
  meta,
  sections,
  preamble,
  footerNote,
}: LegalPageLayoutProps) {
  return (
    <div className="bg-background">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">

        {/* Last updated badge */}
        <div className="mb-10">
          <PrivacyLastUpdated date={meta.lastUpdated} />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* ── Sidebar TOC (desktop only) ── */}
          <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
            <PrivacyTableOfContents sections={sections} />
          </aside>

          {/* ── Main article ── */}
          <article className="flex-1 min-w-0 max-w-3xl">

            {/* Mobile collapsible TOC */}
            <details className="lg:hidden mb-10 rounded-xl border border-outline-variant/40 bg-surface-container-low overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-xs select-none">
                <span>Contents</span>
                <span className="text-outline text-lg leading-none" aria-hidden="true">+</span>
              </summary>
              <div className="px-5 pb-5 pt-2">
                <ol className="space-y-1">
                  {sections.map((s) => (
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

            {/* Preamble box */}
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 px-6 py-5 mb-12">
              <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {preamble}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-0">
              {sections.map((section) => (
                <PrivacySection key={section.id} section={section} />
              ))}
            </div>

            {/* Footer note */}
            {footerNote && (
              <div className="mt-16 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-5">
                <div className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {footerNote}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}

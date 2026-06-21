"use client";

import React, { useEffect, useState } from "react";
import { PolicySection } from "@/types/legal";

interface PrivacyTableOfContentsProps {
  sections: PolicySection[];
}

export default function PrivacyTableOfContents({
  sections,
}: PrivacyTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = sections.map(({ id }) =>
      document.getElementById(id)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <nav aria-label="Table of contents" className="sticky top-28">
      <p className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest mb-5 text-xs">
        Contents
      </p>
      <ol className="space-y-1">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={`group flex items-start gap-3 rounded-lg px-3 py-2 transition-all duration-200 text-sm font-body-sm leading-snug ${
                  isActive
                    ? "bg-secondary/10 text-secondary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 font-label-mono text-xs tabular-nums transition-colors duration-200 ${
                    isActive ? "text-secondary" : "text-outline"
                  }`}
                >
                  {String(section.number).padStart(2, "0")}
                </span>
                <span className="leading-snug">{section.title}</span>
              </a>
            </li>
          );
        })}
      </ol>

      {/* Decorative gradient fade at bottom */}
      <div
        aria-hidden="true"
        className="mt-8 h-px bg-gradient-to-r from-outline-variant/40 to-transparent"
      />
      <p className="mt-5 font-body-sm text-body-sm text-on-surface-variant/50 text-xs leading-relaxed">
        Questions? Email{" "}
        <a
          href="mailto:contact@hexakode.in"
          className="text-secondary hover:underline underline-offset-2 transition-colors"
        >
          contact@hexakode.in
        </a>
      </p>
    </nav>
  );
}

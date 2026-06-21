"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { PolicySection } from "@/types/legal";

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

interface PrivacySectionProps {
  section: PolicySection;
}

export default function PrivacySection({ section }: PrivacySectionProps) {
  return (
    <motion.article
      id={section.id}
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="scroll-mt-28 pt-12 first:pt-0"
    >
      {/* Section header */}
      <div className="flex items-start gap-4 mb-6">
        <span
          aria-hidden="true"
          className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 font-label-mono text-xs text-secondary tabular-nums"
        >
          {String(section.number).padStart(2, "0")}
        </span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
          {section.title}
        </h2>
      </div>

      {/* Intro paragraph */}
      {section.intro && (
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4 pl-12">
          {section.intro}
        </p>
      )}

      {/* Flat items */}
      {section.items && section.items.length > 0 && (
        <div className="pl-12 space-y-3">
          {section.items.map((item, idx) => {
            if (item.type === "bullet") {
              return (
                <div key={idx} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                  />
                  <span className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {item.text}
                  </span>
                </div>
              );
            }
            if (item.type === "email") {
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-label-mono text-xs text-outline uppercase tracking-wider">
                    Email:
                  </span>
                  <a
                    href={item.href}
                    className="font-body-md text-body-md text-secondary hover:underline underline-offset-2 transition-colors"
                  >
                    {item.text}
                  </a>
                </div>
              );
            }
            if (item.type === "link") {
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-label-mono text-xs text-outline uppercase tracking-wider">
                    Web:
                  </span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body-md text-body-md text-secondary hover:underline underline-offset-2 transition-colors"
                  >
                    {item.text}
                  </a>
                </div>
              );
            }
            if (item.type === "internalLink") {
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-label-mono text-xs text-outline uppercase tracking-wider">
                    See:
                  </span>
                  <Link
                    href={item.href ?? "/"}
                    className="font-body-md text-body-md text-secondary hover:underline underline-offset-2 transition-colors"
                  >
                    {item.text}
                  </Link>
                </div>
              );
            }
            // paragraph
            return (
              <p
                key={idx}
                className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
              >
                {item.text}
              </p>
            );
          })}
        </div>
      )}

      {/* Subsections */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="pl-12 space-y-6">
          {section.subsections.map((sub, subIdx) => (
            <div key={subIdx}>
              <h3 className="font-headline-sm text-sm text-on-surface font-semibold mb-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-px w-4 bg-secondary inline-block"
                />
                {sub.heading}
              </h3>
              <div className="space-y-2.5">
                {sub.items.map((item, itemIdx) => {
                  if (item.type === "bullet") {
                    return (
                      <div key={itemIdx} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/60"
                        />
                        <span className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          {item.text}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <p
                      key={itemIdx}
                      className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                    >
                      {item.text}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        className="mt-10 h-px bg-gradient-to-r from-outline-variant/40 via-outline-variant/20 to-transparent"
      />
    </motion.article>
  );
}

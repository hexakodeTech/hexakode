import React from "react";
import Link from "next/link";
import { constructBreadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
  className?: string;
  renderJsonLd?: boolean;
}

/**
 * Accessible, semantic Breadcrumb component with Schema.org BreadcrumbList structured data.
 */
export default function Breadcrumbs({
  items,
  variant = "light",
  className = "",
  renderJsonLd = true,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const isDark = variant === "dark";

  // Build JSON-LD structured data matching the visible breadcrumbs
  const jsonLd = renderJsonLd
    ? constructBreadcrumbJsonLd(
        items.map((item) => ({
          name: item.label,
          path: item.href,
        }))
      )
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
        />
      )}

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-medium select-none ${
          isDark ? "text-white/70" : "text-slate-500"
        } ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-y-1 list-none p-0 m-0">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isClickable = !isLast && item.href;

            return (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <span
                    className={`mx-1.5 text-xs select-none ${
                      isDark ? "text-white/35" : "text-slate-300"
                    }`}
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}

                {isClickable ? (
                  <Link
                    href={item.href!}
                    prefetch={true}
                    className={`transition-colors duration-200 outline-none focus-visible:ring-1 ${
                      isDark
                        ? "hover:text-white focus-visible:ring-white"
                        : "hover:text-primary focus-visible:ring-primary/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className={`font-semibold truncate max-w-[220px] sm:max-w-xs md:max-w-md lg:max-w-lg ${
                      isDark ? "text-white" : "text-slate-800"
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

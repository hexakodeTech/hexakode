"use client";

import React, { useState, useEffect, useRef } from "react";
import { TocHeading as HeadingItem } from "@/modules/blog/utils/helpers";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(() => headings[0]?.id || "");
  const isManualScrollRef = useRef(false);
  const manualScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    // Initialize active ID from URL hash if present
    const initialHash =
      typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    if (initialHash && headings.some((h) => h.id === initialHash)) {
      requestAnimationFrame(() => setActiveId(initialHash));
    }

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const visibleHeadings = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrollRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadings.add(entry.target.id);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        });

        // Highlight the active section based on current scroll position
        if (visibleHeadings.size > 0) {
          const firstVisible = headings.find((h) => visibleHeadings.has(h.id));
          if (firstVisible) {
            setActiveId(firstVisible.id);
          }
        } else {
          // Fallback check for current active heading relative to navbar threshold
          let currentActiveId = headings[0].id;
          for (const h of headings) {
            const el = document.getElementById(h.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 140) {
                currentActiveId = h.id;
              }
            }
          }
          setActiveId(currentActiveId);
        }
      },
      {
        rootMargin: "-100px 0px -50% 0px",
        threshold: [0, 1.0],
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      if (isManualScrollRef.current) return;

      if (window.scrollY < 100 && headings.length > 0) {
        setActiveId(headings[0].id);
        return;
      }

      let currentActiveId = "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            currentActiveId = h.id;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current);
      }
    };
  }, [headings]);

  const handleHeadingClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    setActiveId(id);
    isManualScrollRef.current = true;
    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current);
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.pushState(null, "", `#${id}`);

    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 800);
  };

  if (!headings || headings.length === 0) return null;

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 sticky top-28 self-start w-full">
      <p className="text-xs font-bold text-navy-dark uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
        Table of Contents
      </p>
      <nav className="space-y-3">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => handleHeadingClick(e, heading.id)}
            className={cn(
              "block text-xs font-medium leading-relaxed transition-colors duration-200",
              heading.level === 3 ? "pl-4 text-[11px]" : "",
              heading.level === 4 ? "pl-6 text-[11px]" : "",
              activeId === heading.id
                ? "text-primary font-bold border-l-2 border-primary pl-2 -ml-2"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

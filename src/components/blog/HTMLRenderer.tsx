"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { injectHeadingIds } from "@/modules/blog/utils/helpers";

interface HTMLRendererProps {
  html: string;
  className?: string;
}

/**
 * Renders HTML blog content from Tiptap editor.
 * Ensures heading elements (h2, h3, h4) have deterministic ids and scroll offsets in SSR/SSG.
 * Handles client-side deep linking and smooth scrolling to heading hashes.
 */
export default function HTMLRenderer({ html, className = "" }: HTMLRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  const processedHtml = useMemo(() => {
    return injectHeadingIds(html);
  }, [html]);

  useEffect(() => {
    // Handle deep-linked scroll on initial load or refresh with hash
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
      suppressHydrationWarning
    />
  );
}

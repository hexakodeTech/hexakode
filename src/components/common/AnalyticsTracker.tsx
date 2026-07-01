"use client";

import { useEffect, useRef } from "react";
import {
  trackEmailClick,
  trackPhoneClick,
  trackWhatsAppClick,
  trackRepositoryClick,
  trackExternalLinkClick,
  trackPortfolioView,
  trackServiceView,
} from "@/lib/analytics";

/**
 * Resolves the logical layout location of an element based on its ancestors.
 */
function getButtonLocation(element: HTMLElement): string {
  const explicit =
    element.getAttribute("data-analytics-location") ||
    element.closest("[data-analytics-location]")?.getAttribute("data-analytics-location");
  if (explicit) return explicit;

  if (
    element.closest("nav") ||
    element.closest("#navbar") ||
    element.closest('[class*="Navbar"]') ||
    element.closest('[class*="navbar"]')
  ) {
    return "Navbar";
  }
  if (
    element.closest("footer") ||
    element.closest("#footer") ||
    element.closest('[class*="Footer"]') ||
    element.closest('[class*="footer"]')
  ) {
    return "Footer";
  }
  if (
    element.closest("#hero") ||
    element.closest('[class*="Hero"]') ||
    element.closest('[class*="hero"]')
  ) {
    return "Hero";
  }
  if (
    element.closest("#contact") ||
    element.closest("#contact-form") ||
    element.closest('[class*="Contact"]') ||
    element.closest('[class*="contact"]')
  ) {
    return "Contact Section";
  }

  return "General";
}

/**
 * Resolves the project name from the element context (e.g. data attributes, card headings, or page header).
 */
function getProjectName(element: HTMLElement): string {
  const explicit =
    element.getAttribute("data-project-name") ||
    element.closest("[data-project-name]")?.getAttribute("data-project-name");
  if (explicit) return explicit;

  // Search for card ancestor and look for heading
  const card = element.closest('[class*="card"]') || element.closest('[class*="Card"]');
  if (card) {
    const heading = card.querySelector("h1, h2, h3, h4");
    if (heading?.textContent) return heading.textContent.trim();
  }

  // If on dynamic portfolio page, extract h1 text
  if (typeof document !== "undefined") {
    const pageH1 = document.querySelector("h1");
    if (pageH1?.textContent && window.location.pathname.includes("/portfolio/")) {
      return pageH1.textContent.trim();
    }
  }

  return "HexaKode";
}

export default function AnalyticsTracker() {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // 5. Track Email Clicks (mailto:)
      if (href.startsWith("mailto:")) {
        const email = href.substring(7).split("?")[0];
        trackEmailClick(email);
        return;
      }

      // 6. Track Phone Clicks (tel:)
      if (href.startsWith("tel:")) {
        const phone = href.substring(4).split("?")[0];
        trackPhoneClick(phone);
        return;
      }

      // 4. Track WhatsApp Clicks
      if (
        href.includes("wa.me") ||
        href.includes("api.whatsapp.com") ||
        href.includes("whatsapp.com/send")
      ) {
        const location = getButtonLocation(anchor);
        trackWhatsAppClick(location);
        return;
      }

      // 8. Track Repository Link Clicks (GitHub links)
      if (href.includes("github.com")) {
        const projectName = getProjectName(anchor);
        trackRepositoryClick(href, projectName);
        return;
      }

      // 9. Track External Link Clicks
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//")
      ) {
        try {
          const url = new URL(href, window.location.origin);
          if (url.origin !== window.location.origin) {
            const linkText =
              anchor.textContent?.trim() || anchor.getAttribute("aria-label") || href;
            trackExternalLinkClick(href, linkText);
          }
        } catch {
          // Ignore malformed URL parsing errors
        }
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}

/**
 * 7. Client-side Tracker for Portfolio Detail Page Views.
 * Ensures the event is fired once per mount.
 */
interface PortfolioViewTrackerProps {
  projectName: string;
  projectSlug: string;
}

export function PortfolioViewTracker({
  projectName,
  projectSlug,
}: PortfolioViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    trackPortfolioView(projectName, projectSlug);

    return () => {
      hasTracked.current = false;
    };
  }, [projectName, projectSlug]);

  return null;
}

/**
 * 10. Client-side Tracker for Service Page/Section Views.
 * Ensures the event is fired once per mount.
 */
interface ServiceViewTrackerProps {
  serviceName: string;
}

export function ServiceViewTracker({ serviceName }: ServiceViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    trackServiceView(serviceName);

    return () => {
      hasTracked.current = false;
    };
  }, [serviceName]);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import {
  trackEmailClick,
  trackPhoneClick,
  trackWhatsappClick,
  trackRepositoryClick,
  trackExternalLink,
  trackPortfolioView,
  trackServiceView,
  trackDownloadFile,
  trackSocialClick,
} from "@/lib/analytics";

/**
 * Supported Social Media Platforms configuration map.
 * Adding a new platform only requires adding an entry here.
 */
const SOCIAL_PLATFORMS = [
  { platform: "instagram", domains: ["instagram.com"] },
  { platform: "facebook", domains: ["facebook.com", "fb.com"] },
  { platform: "linkedin", domains: ["linkedin.com"] },
  { platform: "github", domains: ["github.com"] },
  { platform: "x", domains: ["x.com", "twitter.com"] },
  { platform: "youtube", domains: ["youtube.com", "youtu.be"] },
  { platform: "discord", domains: ["discord.gg", "discord.com"] },
  { platform: "reddit", domains: ["reddit.com"] },
  { platform: "medium", domains: ["medium.com"] },
  { platform: "behance", domains: ["behance.net"] },
  { platform: "dribbble", domains: ["dribbble.com"] },
] as const;

/**
 * Detects if a URL points to a supported social media platform.
 * Returns the matching platform name or null.
 */
function detectSocialPlatform(urlStr: string): string | null {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();
    const match = SOCIAL_PLATFORMS.find((p) =>
      p.domains.some((d) => hostname === d || hostname.endsWith("." + d))
    );
    return match ? match.platform : null;
  } catch {
    const lowercaseUrl = urlStr.toLowerCase();
    const match = SOCIAL_PLATFORMS.find((p) =>
      p.domains.some((d) => lowercaseUrl.includes(d))
    );
    return match ? match.platform : null;
  }
}

/**
 * Resolves the logical layout location of an element based on its ancestors.
 * Possible values: navbar, hero, footer, contact, portfolio, services, about, blog, floating_button, cta, unknown
 */
function getElementLocation(element: HTMLElement): string {
  const explicit =
    element.getAttribute("data-analytics-location") ||
    element.closest("[data-analytics-location]")?.getAttribute("data-analytics-location");
  if (explicit) return explicit.toLowerCase();

  if (
    element.closest("nav") ||
    element.closest("#navbar") ||
    element.closest('[class*="Navbar"]') ||
    element.closest('[class*="navbar"]')
  ) {
    return "navbar";
  }
  if (
    element.closest("footer") ||
    element.closest("#footer") ||
    element.closest('[class*="Footer"]') ||
    element.closest('[class*="footer"]')
  ) {
    return "footer";
  }
  if (
    element.closest("#hero") ||
    element.closest('[class*="Hero"]') ||
    element.closest('[class*="hero"]')
  ) {
    return "hero";
  }
  if (
    element.closest("#contact") ||
    element.closest("#contact-form") ||
    element.closest('[class*="Contact"]') ||
    element.closest('[class*="contact"]')
  ) {
    return "contact";
  }
  if (
    element.closest("#portfolio") ||
    element.closest('[class*="Portfolio"]') ||
    element.closest('[class*="portfolio"]') ||
    (typeof window !== "undefined" && window.location.pathname.includes("/portfolio"))
  ) {
    return "portfolio";
  }
  if (
    element.closest("#services") ||
    element.closest('[class*="Services"]') ||
    element.closest('[class*="services"]') ||
    (typeof window !== "undefined" && window.location.pathname.includes("/services"))
  ) {
    return "services";
  }
  if (
    element.closest("#about") ||
    element.closest('[class*="About"]') ||
    element.closest('[class*="about"]') ||
    (typeof window !== "undefined" && window.location.pathname.includes("/about"))
  ) {
    return "about";
  }
  if (
    element.closest("#blog") ||
    element.closest('[class*="Blog"]') ||
    element.closest('[class*="blog"]') ||
    (typeof window !== "undefined" && window.location.pathname.includes("/blog"))
  ) {
    return "blog";
  }
  if (
    element.closest('[class*="floating"]') ||
    element.closest('[class*="Floating"]') ||
    element.closest('[id*="floating"]')
  ) {
    return "floating_button";
  }
  if (
    element.closest("#cta") ||
    element.closest('[class*="cta"]') ||
    element.closest('[class*="CTA"]')
  ) {
    return "cta";
  }

  return "unknown";
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

/**
 * Helper to slugify service names.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AnalyticsTracker() {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // 10. Download Tracking (PDF, Brochure, Company Profile, Portfolio PDF)
      const lowercaseHref = href.toLowerCase();
      const isDownload =
        anchor.hasAttribute("download") ||
        lowercaseHref.endsWith(".pdf") ||
        lowercaseHref.endsWith(".zip") ||
        lowercaseHref.endsWith(".docx") ||
        lowercaseHref.endsWith(".xlsx") ||
        lowercaseHref.endsWith(".pptx") ||
        lowercaseHref.includes("/download/");

      if (isDownload) {
        // Extract filename and type
        const urlParts = href.split("?")[0].split("/");
        const fileName =
          urlParts[urlParts.length - 1] || anchor.textContent?.trim() || "downloaded_file";
        const fileExtension = fileName.split(".").pop() || "PDF";
        const fileType = fileExtension.toUpperCase();

        trackDownloadFile(fileName, fileType);
        return;
      }

      // 4. Email Tracking (mailto: links)
      if (href.startsWith("mailto:")) {
        const email = href.substring(7).split("?")[0];
        trackEmailClick(email);
        return;
      }

      // 5. Phone Tracking (tel: links)
      if (href.startsWith("tel:")) {
        const phone = href.substring(4).split("?")[0];
        trackPhoneClick(phone);
        return;
      }

      // 3. WhatsApp Tracking
      if (
        href.includes("wa.me") ||
        href.includes("api.whatsapp.com") ||
        href.includes("whatsapp.com/send")
      ) {
        const location = getElementLocation(anchor);
        trackWhatsappClick(location);
        return;
      }

      // Check if it's a social click first (this intercepts social profiles on GitHub, LinkedIn, etc.)
      const socialPlatform = detectSocialPlatform(href);
      if (socialPlatform) {
        // Backward Compatibility check for github.com:
        // If it's a repository url (has username + repository name path segments, e.g. length >= 2),
        // we track it as repository_click. If it's a profile URL (e.g. length = 1), we track as social_click.
        if (socialPlatform === "github") {
          try {
            const url = new URL(href, window.location.origin);
            const pathSegments = url.pathname.split("/").filter(Boolean);
            if (pathSegments.length >= 2) {
              const projectName = getProjectName(anchor);
              trackRepositoryClick(projectName, href);
              return;
            }
          } catch {
            // Fallback to social_click if URL fails to parse
          }
        }

        const location = getElementLocation(anchor);
        const linkText = anchor.textContent?.trim() || anchor.getAttribute("aria-label") || href;

        trackSocialClick({
          platform: socialPlatform,
          destination: href,
          location,
          linkText,
        });
        return;
      }

      // 9. External Link Tracking (Non-social external links)
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
            trackExternalLink(href, linkText);
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
 * 6. Client-side Tracker for Portfolio Detail Page Views.
 * Ensures the event is fired once per mount.
 */
interface PortfolioViewTrackerProps {
  projectName: string;
  projectSlug: string;
  category: string;
}

export function PortfolioViewTracker({
  projectName,
  projectSlug,
  category,
}: PortfolioViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    trackPortfolioView(projectName, projectSlug, category);

    return () => {
      hasTracked.current = false;
    };
  }, [projectName, projectSlug, category]);

  return null;
}

/**
 * 8. Client-side Tracker for Service Page/Section Views.
 * Ensures the event is fired once per mount.
 */
interface ServiceViewTrackerProps {
  serviceName: string;
  serviceSlug?: string;
}

export function ServiceViewTracker({ serviceName, serviceSlug }: ServiceViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const slug = serviceSlug || slugify(serviceName);
    trackServiceView(serviceName, slug);

    return () => {
      hasTracked.current = false;
    };
  }, [serviceName, serviceSlug]);

  return null;
}

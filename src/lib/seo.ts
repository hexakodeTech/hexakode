import type { Metadata } from "next";

export const SITE_URL = "https://hexakode.in";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const SITE_NAME = "HexaKode";

export interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  robots?: { index?: boolean; follow?: boolean };
}

/**
 * Returns an absolute canonical HTTPS URL for a given relative or absolute path.
 */
export function getCanonicalUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      return `${SITE_URL}${url.pathname === "/" ? "" : url.pathname}`;
    } catch {
      return path;
    }
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Resolves a social image into a full, absolute HTTPS URL.
 * Falls back to DEFAULT_OG_IMAGE if input is empty or invalid.
 */
export function getAbsoluteImageUrl(image?: string | null): string {
  if (!image || typeof image !== "string" || image.trim() === "") {
    return DEFAULT_OG_IMAGE;
  }
  const trimmed = image.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/^https?:\/\/www\.hexakode\.in/, SITE_URL);
  }
  return `${SITE_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

/**
 * Centralized Next.js Metadata factory ensuring:
 * 1. Self-referencing canonical URL on https://hexakode.in
 * 2. og:url exactly matches canonical URL
 * 3. Consistent og:title and twitter:title
 * 4. Consistent og:description and twitter:description
 * 5. Valid 1200x630 social share image with absolute HTTPS URL
 * 6. twitter:card = "summary_large_image"
 */
export function constructMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  keywords,
  robots,
}: MetadataOptions): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = getAbsoluteImageUrl(image);
  const effectiveAlt = imageAlt || title;

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors && authors.length > 0 ? { authors } : {}),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: effectiveAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: robots || { index: true, follow: true },
  };
}

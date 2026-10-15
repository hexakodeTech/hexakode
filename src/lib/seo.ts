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

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Safely serialize JSON-LD structured data escaping angle brackets to prevent XSS.
 */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Authoritative sitewide JSON-LD describing HexaKode as an Organization
 * and ProfessionalService, plus the primary WebSite entity.
 */
export function getSitewideJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORGANIZATION_ID,
        name: "HexaKode",
        alternateName: "HexaKode Engineering",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/og-image.png`,
        description:
          "HexaKode is a premier software engineering company and professional services provider specializing in custom web applications, mobile apps, UI/UX design, and digital marketing.",
        slogan: "Code That Powers Growth",
        telephone: "+91 95398 28694",
        email: "contact@hexakode.in",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Kerala",
          addressCountry: "IN",
        },
        areaServed: [
          {
            "@type": "State",
            name: "Kerala",
            alternateName: "KL",
          },
          {
            "@type": "Country",
            name: "India",
          },
        ],
        sameAs: [
          "https://in.linkedin.com/company/hexakodeteh",
          "https://www.instagram.com/hexakode_tech/",
          "https://www.facebook.com/profile.php?id=61589246312714",
          "https://x.com/HexaKode98190",
          "https://github.com/hexakode",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91 95398 28694",
            contactType: "customer service",
            email: "contact@hexakode.in",
            areaServed: ["IN", "Worldwide"],
            availableLanguage: ["en", "ml"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "HexaKode",
        alternateName: "HexaKode Engineering",
        description:
          "Custom software, web applications, mobile apps, and digital experiences built to help businesses scale with technical precision and market-leading innovation.",
        publisher: {
          "@id": ORGANIZATION_ID,
        },
        inLanguage: "en",
      },
    ],
  };
}

export interface ServiceJsonLdOptions {
  name: string;
  url: string;
  description: string;
  serviceType?: string;
  image?: string;
}

/**
 * Builds page-specific Service JSON-LD linked to the canonical sitewide Organization entity.
 */
export function constructServiceJsonLd({
  name,
  url,
  description,
  serviceType,
  image,
}: ServiceJsonLdOptions) {
  const canonicalUrl = getCanonicalUrl(url);
  const serviceId = `${canonicalUrl}#service`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceId,
    name,
    url: canonicalUrl,
    description,
    provider: {
      "@id": ORGANIZATION_ID,
    },
    areaServed: [
      {
        "@type": "State",
        name: "Kerala",
        alternateName: "KL",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
    ...(serviceType ? { serviceType } : {}),
    ...(image ? { image: getAbsoluteImageUrl(image) } : {}),
    termsOfService: `${SITE_URL}/terms-of-service`,
  };
}

export interface BlogPostingJsonLdOptions {
  slug: string;
  headline: string;
  description?: string | null;
  datePublished?: string | Date | null;
  dateModified?: string | Date | null;
  authorName?: string | null;
  image?: string | null;
}

/**
 * Builds page-specific BlogPosting JSON-LD linked to the canonical sitewide Organization entity.
 */
export function constructBlogPostingJsonLd({
  slug,
  headline,
  description,
  datePublished,
  dateModified,
  authorName,
  image,
}: BlogPostingJsonLdOptions) {
  const canonicalUrl = getCanonicalUrl(`/blog/${slug}`);
  const blogPostingId = `${canonicalUrl}#blogposting`;

  // ISO 8601 date resolution
  const publishedIso = datePublished
    ? new Date(datePublished).toISOString()
    : undefined;
  const modifiedIso = dateModified
    ? new Date(dateModified).toISOString()
    : publishedIso;

  const author = authorName && authorName.trim() ? authorName.trim() : "HexaKode Team";
  const isOrgAuthor = author.toLowerCase().includes("hexakode");

  const authorEntity = isOrgAuthor
    ? {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: author,
        url: SITE_URL,
      }
    : {
        "@type": "Person",
        name: author,
      };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": blogPostingId,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline,
    ...(description ? { description } : {}),
    ...(publishedIso ? { datePublished: publishedIso } : {}),
    ...(modifiedIso ? { dateModified: modifiedIso } : {}),
    author: authorEntity,
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
    },
    image: getAbsoluteImageUrl(image),
  };
}

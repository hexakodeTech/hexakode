import type { Metadata } from "next";

export const SITE_URL = "https://hexakode.in";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const SITE_NAME = "HexaKode";
export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/search?kgmid=%2Fg%2F11npyfhq8b&hl=ml-IN&q=HexaKode&shem=epsd1%2Cesd2e%2Cltae%2Crimspwouoe%2Csdpie&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm5%2F1&kgs=73fee9171bc13cab";

export interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
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
 * Clamps title to the strict SEO character limit (max 59 characters).
 */
export function clampTitle(title: string, maxLength = 59): string {
  const cleaned = title.trim();
  if (cleaned.length <= maxLength) return cleaned;
  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated).trim();
}

/**
 * Clamps meta description to the strict SEO character limit (max 159 characters).
 */
export function clampDescription(description: string, maxLength = 159): string {
  const cleaned = description.trim();
  if (cleaned.length <= maxLength) return cleaned;
  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 50 ? truncated.slice(0, lastSpace) : truncated).trim();
}

/**
 * Centralized Next.js Metadata factory ensuring:
 * 1. Self-referencing canonical URL on https://hexakode.in
 * 2. og:url exactly matches canonical URL
 * 3. Consistent og:title and twitter:title
 * 4. Consistent og:description and twitter:description
 * 5. Strict length enforcement (title <= 59 chars, description <= 159 chars)
 * 6. Valid 1200x630 social share image with absolute HTTPS URL
 * 7. twitter:card = "summary_large_image"
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
  const safeTitle = clampTitle(title);
  const safeDescription = clampDescription(description);
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = getAbsoluteImageUrl(image);
  const effectiveAlt = imageAlt || safeTitle;

  return {
    title: safeTitle,
    description: safeDescription,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
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
      title: safeTitle,
      description: safeDescription,
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
          GOOGLE_BUSINESS_PROFILE_URL,
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
  authorSlug?: string | null;
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
  authorSlug,
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
  const isOrgAuthor = author.toLowerCase().includes("hexakode team") || author.toLowerCase() === "hexakode";

  // Derive author slug if not explicitly passed
  const slugFromName = author
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const effectiveAuthorSlug = authorSlug || slugFromName;
  const authorProfileUrl = `${SITE_URL}/blog/authors/${effectiveAuthorSlug}`;
  const authorPersonId = `${authorProfileUrl}#person`;

  const authorEntity = isOrgAuthor
    ? {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: author,
        url: SITE_URL,
      }
    : {
        "@type": "Person",
        "@id": authorPersonId,
        name: author,
        url: authorProfileUrl,
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

export interface AuthorProfileJsonLdOptions {
  slug: string;
  name: string;
  role?: string;
  bio?: string;
  socialUrl?: string;
}

/**
 * Builds ProfilePage and Person JSON-LD for a dedicated author profile page.
 */
export function constructAuthorProfileJsonLd(author: AuthorProfileJsonLdOptions) {
  const authorUrl = `${SITE_URL}/blog/authors/${author.slug}`;
  const personId = `${authorUrl}#person`;
  const webpageId = `${authorUrl}#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": webpageId,
        url: authorUrl,
        name: `${author.name} — Author Profile | HexaKode`,
        ...(author.bio ? { description: author.bio } : {}),
        isPartOf: {
          "@id": WEBSITE_ID,
        },
        mainEntity: {
          "@id": personId,
        },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: author.name,
        url: authorUrl,
        ...(author.role ? { jobTitle: author.role } : {}),
        ...(author.bio ? { description: author.bio } : {}),
        ...(author.socialUrl ? { sameAs: author.socialUrl } : {}),
        worksFor: {
          "@id": ORGANIZATION_ID,
        },
      },
    ],
  };
}

export interface FaqItemOption {
  question: string;
  answer: string;
}

export interface FaqPageJsonLdOptions {
  path: string;
  faqs: FaqItemOption[];
}

/**
 * Builds page-specific FAQPage JSON-LD.
 */
export function constructFaqPageJsonLd({
  path,
  faqs,
}: FaqPageJsonLdOptions) {
  const canonicalUrl = getCanonicalUrl(path);
  const faqPageId = path === "/" || canonicalUrl === SITE_URL
    ? `${SITE_URL}/#faq`
    : `${canonicalUrl}#faq`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": faqPageId,
    url: canonicalUrl,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface BreadcrumbItemInput {
  name: string;
  path?: string;
  url?: string;
}

/**
 * Builds page-specific BreadcrumbList JSON-LD.
 */
export function constructBreadcrumbJsonLd(items: BreadcrumbItemInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const targetPath = item.path || item.url;
      const targetUrl = targetPath ? getCanonicalUrl(targetPath) : undefined;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(targetUrl ? { item: targetUrl } : {}),
      };
    }),
  };
}

export interface AboutPersonInput {
  name: string;
  role: string;
  imageUrl?: string;
  socialUrl?: string;
}

export interface AboutPageJsonLdOptions {
  founders: AboutPersonInput[];
  teamMembers?: AboutPersonInput[];
}

/**
 * Builds AboutPage and verified Person JSON-LD.
 */
export function constructAboutPageJsonLd({
  founders,
  teamMembers = [],
}: AboutPageJsonLdOptions) {
  const persons = [
    ...founders.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
      worksFor: {
        "@id": ORGANIZATION_ID,
      },
      ...(founder.imageUrl ? { image: founder.imageUrl } : {}),
      ...(founder.socialUrl ? { sameAs: founder.socialUrl } : {}),
    })),
    ...teamMembers.map((member) => ({
      "@type": "Person",
      name: member.name,
      jobTitle: member.role,
      worksFor: {
        "@id": ORGANIZATION_ID,
      },
      ...(member.imageUrl ? { image: member.imageUrl } : {}),
      ...(member.socialUrl ? { sameAs: member.socialUrl } : {}),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/about#webpage`,
        url: `${SITE_URL}/about`,
        name: "About Us | HexaKode Engineering",
        description:
          "Learn about HexaKode: our founders, remote engineering team, and our commitment to high-standard web and mobile development based in Kerala, India.",
        isPartOf: {
          "@id": WEBSITE_ID,
        },
        about: {
          "@id": ORGANIZATION_ID,
        },
      },
      ...persons,
    ],
  };
}




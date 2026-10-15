import { BlogAuthor } from "../types/author";

export const BLOG_AUTHORS: Record<string, BlogAuthor> = {
  "navaneeth-pp": {
    slug: "navaneeth-pp",
    name: "Navaneeth P P",
    role: "Co-Founder & CEO, Full Stack Engineer",
    bio: "Co-founder and CEO of HexaKode. Leads full-stack web and mobile application architecture, technical strategy, and client engineering partnerships, bringing deep expertise in React, Next.js, and cloud ecosystems.",
    expertise: [
      "Web Architecture",
      "Next.js & React",
      "Full-Stack Development",
      "Technical Strategy",
    ],
    socialUrl: "https://www.linkedin.com/in/navaneethpp/",
  },
  "prajosh-c": {
    slug: "prajosh-c",
    name: "Prajosh C",
    role: "Co-Founder & CTO, Backend Engineer",
    bio: "Co-founder and CTO of HexaKode. Oversees core backend architecture, distributed systems, database reliability, API design, and infrastructure scalability across all client deployments.",
    expertise: [
      "Backend Architecture",
      "Database Systems",
      "API Engineering",
      "Cloud Scalability",
    ],
    socialUrl: "https://www.linkedin.com/in/prajosh-c-586404304/",
  },
  "prajith": {
    slug: "prajith",
    name: "Prajith",
    role: "UI/UX Designer & Team Member",
    bio: "Product designer and core team member at HexaKode. Specializes in user experience design, wireframing, design systems, and bridging user research with responsive frontend engineering.",
    expertise: [
      "UI/UX Design",
      "Design Systems",
      "User Research",
      "Responsive Interfaces",
    ],
  },
};

/**
 * Returns author by lowercase slug.
 */
export function getAuthorBySlug(slug: string): BlogAuthor | null {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  return BLOG_AUTHORS[normalized] || null;
}

/**
 * Resolves author by matching against known names or aliases.
 */
export function getAuthorByName(name: string): BlogAuthor | null {
  if (!name) return null;
  const lower = name.trim().toLowerCase();
  if (
    lower === "navaneeth" ||
    lower === "navaneeth p p" ||
    lower === "navaneeth pp"
  ) {
    return BLOG_AUTHORS["navaneeth-pp"];
  }
  if (lower === "prajosh" || lower === "prajosh c") {
    return BLOG_AUTHORS["prajosh-c"];
  }
  if (lower === "prajith") {
    return BLOG_AUTHORS["prajith"];
  }
  return null;
}

/**
 * Resolves any author name or slug to a valid BlogAuthor object.
 */
export function resolveAuthor(authorNameOrSlug?: string | null): BlogAuthor {
  if (!authorNameOrSlug || !authorNameOrSlug.trim()) {
    return BLOG_AUTHORS["navaneeth-pp"];
  }

  const bySlug = getAuthorBySlug(authorNameOrSlug);
  if (bySlug) return bySlug;

  const byName = getAuthorByName(authorNameOrSlug);
  if (byName) return byName;

  // Fallback for custom names
  const slug = authorNameOrSlug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    slug: slug || "hexakode-team",
    name: authorNameOrSlug,
    role: "Author",
    bio: `Author at HexaKode specializing in digital engineering and technology insights.`,
    expertise: [],
  };
}

/**
 * Returns all verified authors as an array.
 */
export function getAllAuthors(): BlogAuthor[] {
  return Object.values(BLOG_AUTHORS);
}

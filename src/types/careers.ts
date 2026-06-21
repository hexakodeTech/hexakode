// ─── Job Types ────────────────────────────────────────────────────────────────

export type JobCategory = "Engineering" | "Design" | "Product" | "Marketing";
export type JobType = "Full-Time" | "Part-Time" | "Contract" | "Intern";

export interface Job {
  id: string;
  /** URL slug — e.g. "senior-full-stack-developer" */
  slug: string;
  title: string;
  location: string;
  type: JobType;
  category: JobCategory;
  /** Short teaser shown on the card (optional) */
  excerpt?: string;
  tags?: string[];
  /** ISO date string — used for sorting and display */
  postedAt?: string;
  
  // Detailed role fields
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  technologies: string[];
  niceToHave: string[];
}

// ─── Culture / Why HexaKode ───────────────────────────────────────────────────

export interface CultureCard {
  id: string;
  title: string;
  description: string;
  /** Lucide icon component name */
  icon: string;
  accentBg: string;
  accentText: string;
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

export interface CareerBenefit {
  id: string;
  title: string;
  description: string;
  /** Lucide icon component name */
  icon: string;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

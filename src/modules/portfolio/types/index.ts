// ─────────────────────────────────────────────────────────────────────────────
// Portfolio CMS Module — Type Definitions
// All types are frontend-only. Replace mock adapters with API adapters later.
// ─────────────────────────────────────────────────────────────────────────────

export type PortfolioStatus = "Published" | "Draft";

export type PortfolioCategory =
  | "Web Application"
  | "Mobile App"
  | "UI/UX Design"
  | "E-Commerce"
  | "SaaS Platform"
  | "Healthcare"
  | "Finance"
  | "Education"
  | "Food & Beverage"
  | "Manufacturing"
  | "Other";

export interface PortfolioFeature {
  id: string;
  title: string;
  description: string;
}

export interface PortfolioGalleryImage {
  id: string;
  url: string;
  alt: string;
  isCover?: boolean;
}

export interface PortfolioSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface PortfolioSettings {
  featured: boolean;
  showOnHomepage: boolean;
  allowPreview: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: PortfolioCategory;
  clientName: string;
  projectUrl: string;
  githubUrl: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  gallery: PortfolioGalleryImage[];
  technologies: string[];
  features: PortfolioFeature[];
  seo: PortfolioSEO;
  settings: PortfolioSettings;
  status: PortfolioStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Filter / Sort State ──────────────────────────────────────────────────────

export type SortOption = "newest" | "oldest" | "featured";

export interface PortfolioFilters {
  search: string;
  category: PortfolioCategory | "All";
  status: PortfolioStatus | "All";
  sort: SortOption;
}

// ─── Form State ───────────────────────────────────────────────────────────────

export type PortfolioFormData = Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">;

// ─── UI State ─────────────────────────────────────────────────────────────────

export type ModalMode = "create" | "edit" | "preview" | "delete" | null;

export interface PortfolioUIState {
  modalMode: ModalMode;
  activeProjectId: string | null;
}

import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_GALLERY_IMAGES = 10;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Form field sizes / limits
export const TITLE_MIN_LEN = 3;
export const TITLE_MAX_LEN = 100;
export const SHORT_DESC_MIN_LEN = 10;
export const SHORT_DESC_MAX_LEN = 300;

export const GalleryImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional().default(""),
});

export const FeatureSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Feature title is required"),
  description: z.string().min(1, "Feature description is required"),
});

export const PortfolioProjectSchema = z.object({
  title: z
    .string()
    .min(TITLE_MIN_LEN, `Title must be at least ${TITLE_MIN_LEN} characters`)
    .max(TITLE_MAX_LEN, `Title must be less than ${TITLE_MAX_LEN} characters`),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  category: z.string().min(1, "Category is required"),
  clientName: z.string().optional().default(""),
  projectUrl: z
    .string()
    .optional()
    .default("")
    .refine(
      (v) => !v || v.trim() === "" || (/^https?:\/\//i.test(v) && z.string().url().safeParse(v).success),
      { message: "Please enter a valid HTTP or HTTPS URL (e.g., https://example.com)" }
    ),
  shortDescription: z
    .string()
    .min(SHORT_DESC_MIN_LEN, `Short description must be at least ${SHORT_DESC_MIN_LEN} characters`)
    .max(SHORT_DESC_MAX_LEN, `Short description must be less than ${SHORT_DESC_MAX_LEN} characters`),
  longDescription: z.string().optional().default(""),
  coverImage: z.string().min(1, "Cover image is required"),
  gallery: z
    .array(GalleryImageSchema)
    .max(MAX_GALLERY_IMAGES, `Maximum of ${MAX_GALLERY_IMAGES} gallery images allowed`),
  technologies: z.array(z.string()),
  features: z.array(FeatureSchema),
  seo: z.object({
    metaTitle: z.string().optional().default(""),
    metaDescription: z.string().optional().default(""),
    ogImage: z.string().optional().default(""),
  }),
  settings: z.object({
    featured: z.boolean().default(false),
    showOnHomepage: z.boolean().default(false),
    allowPreview: z.boolean().default(true),
  }),
  status: z.enum(["Draft", "Published"]).default("Draft"),
});

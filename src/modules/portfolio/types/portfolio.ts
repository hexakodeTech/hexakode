export interface PublicProject {
  id: string;
  title: string;
  category: "Web" | "Mobile" | "UI/UX" | "Software";
  description: string;
  image: string;
  featured: boolean;
  slug: string;
  layoutSize?: "featured" | "side" | "standard" | "wide";
  // Specification fields
  client: string;
  year: string;
  role: string;
  techStack: string[];
  challenge: string;
  approach: string;
  results: string;
}

/**
 * Maps database category selections to public portfolio categories.
 */
export function mapDbCategoryToPublic(dbCategory: string): "Web" | "Mobile" | "UI/UX" | "Software" {
  const cat = dbCategory.toLowerCase();
  
  if (cat.includes("web") || cat.includes("commerce") || cat.includes("saas") || cat.includes("platform")) {
    return "Web";
  }
  if (cat.includes("mobile") || cat.includes("app")) {
    return "Mobile";
  }
  if (cat.includes("ui/ux") || cat.includes("design") || cat.includes("ux")) {
    return "UI/UX";
  }
  return "Software";
}

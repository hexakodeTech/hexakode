export interface Project {
  id: string;
  title: string;
  category: "Web" | "Mobile" | "UI/UX" | "Software";
  description: string;
  image: string;
  featured: boolean;
  slug: string;
  layoutSize: "featured" | "side" | "standard" | "wide";
}

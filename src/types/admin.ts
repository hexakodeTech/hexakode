export interface AdminProject {
  id: string;
  title: string;
  category: "Web" | "Mobile" | "UI/UX" | "Software";
  description: string;
  image: string;
  status: "Published" | "Draft";
  featured: boolean;
  slug: string;
  createdDate: string;
  layoutSize?: "featured" | "side" | "standard" | "wide";
}

export interface AdminTestimonial {
  id: string;
  clientName: string;
  position: string;
  company: string;
  rating: number; // 1 to 5
  content: string;
  status: "Active" | "Pending";
  date: string;
}

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  date: string;
  status: "New" | "Reviewed" | "Archived";
}

export interface AdminSettings {
  companyName: string;
  companyEmail: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  github: string;
}

export interface DashboardStats {
  totalProjects: number;
  testimonialsCount: number;
  enquiriesCount: number;
  publishedCount: number;
}

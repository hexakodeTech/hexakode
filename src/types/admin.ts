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
  phone?: string | null;
  company: string;
  projectType: string;
  couponCode?: string | null;
  referralCode?: string | null;
  referredBy?: string | null;
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

export interface AdminDemoRequest {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  date: string;
  status: "NEW" | "CONTACTED" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  meetingLink?: string | null;
  meetingTime?: string | null;
  notes?: string | null;
}

export interface AdminCoupon {
  id: string;
  code: string;
  referrerName?: string | null;
  rewardType?: string | null;
  notes?: string | null;
  startDate: string;
  activeDays?: number | null;
  maxLimit: number;
  currentEnquiries: number;
  remainingEnquiries: number;
  expiryType: string;
  expiryDate?: string | null;
  enabled: boolean;
  status: "Active" | "Expired" | "Exhausted" | "Disabled" | "Scheduled";
  createdDate: string;
}

// ─────────────────────────────────────────────
// Client Portal
// ─────────────────────────────────────────────

export interface AdminClient {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  websiteUrl?: string | null;
  status: string;
  creditBalance: number;
  notes?: string | null;
  projectCount: number;
  createdDate: string;
}

export interface AdminPortalProject {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  websiteUrl?: string | null;
  adminUrl?: string | null;
  status: string;
  notes?: string | null;
  logCount: number;
  createdDate: string;
}

export interface AdminMaintenanceLog {
  id: string;
  projectId: string;
  projectName: string;
  projectWebsiteUrl?: string | null;
  title: string;
  description?: string | null;
  logDate: string;
  createdDate: string;
}

export interface AdminInvoice {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string | null;
  projectName?: string | null;
  invoiceNumber: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  issuedDate: string;
  createdAt: string;
}

export interface AdminCreditTransaction {
  id: string;
  clientId: string;
  amount: number;
  description?: string | null;
  createdAt: string;
}


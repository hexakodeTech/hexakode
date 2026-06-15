import { DashboardStats } from "@/types/admin";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalProjects: 12,
  testimonialsCount: 8,
  enquiriesCount: 24,
  publishedCount: 10,
};

// Activity feeds or trend data
export const MOCK_PROJECTS_TREND = [
  { month: "Jan", count: 2 },
  { month: "Feb", count: 4 },
  { month: "Mar", count: 6 },
  { month: "Apr", count: 8 },
  { month: "May", count: 10 },
  { month: "Jun", count: 12 },
];

export const MOCK_ENQUIRIES_TREND = [
  { month: "Jan", count: 4 },
  { month: "Feb", count: 8 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 18 },
  { month: "May", count: 21 },
  { month: "Jun", count: 24 },
];

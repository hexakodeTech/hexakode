"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import QuickActionCard from "@/components/admin/QuickActionCard";
import { MOCK_DASHBOARD_STATS } from "@/mock-data/dashboard";
import { MOCK_PROJECTS } from "@/mock-data/portfolio";
import { MOCK_ENQUIRIES } from "@/mock-data/enquiries";
import {
  FolderKanban,
  MessageSquareQuote,
  Inbox,
  Globe,
  PlusCircle,
  Settings,
  ArrowRight,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // Get first 5 rows for recent lists
  const recentProjects = MOCK_PROJECTS.slice(0, 5);
  const recentEnquiries = MOCK_ENQUIRIES.slice(0, 5);

  const quickActions = [
    {
      title: "Add Project",
      description: "Publish a new case study or enterprise implementation to the catalog.",
      actionText: "Open Portfolio",
      icon: PlusCircle,
      onClick: () => router.push("/admin/portfolio"),
    },
    {
      title: "Add Testimonial",
      description: "Import customer quotes and approve stakeholder endorsements.",
      actionText: "Open Reviews",
      icon: MessageSquareQuote,
      onClick: () => router.push("/admin/testimonials"),
    },
    {
      title: "View Enquiries",
      description: "Inspect customer RFPs, contact details, and project categories.",
      actionText: "Open Inbox",
      icon: Inbox,
      onClick: () => router.push("/admin/enquiries"),
    },
    {
      title: "Manage Settings",
      description: "Configure corporate links, physical addresses, and social parameters.",
      actionText: "Open Settings",
      icon: Settings,
      onClick: () => router.push("/admin/settings"),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
              Console Overview
            </h1>
            <p className="text-xs text-on-surface-variant/70 mt-1">
              Enterprise management control panel for HexaKode operations.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low/55 border border-outline-variant/30 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant">
            <Activity className="w-3.5 h-3.5 text-secondary animate-pulse" />
            <span className="font-label-mono text-[9px] uppercase tracking-wider">
              Environment: Production
            </span>
          </div>
        </div>

        {/* 1. Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Total Projects"
            value={MOCK_DASHBOARD_STATS.totalProjects}
            subtext="Case studies in catalog"
            icon={FolderKanban}
            trend={{ value: "+18%", type: "positive" }}
          />
          <StatsCard
            title="Testimonials"
            value={MOCK_DASHBOARD_STATS.testimonialsCount}
            subtext="Client reviews published"
            icon={MessageSquareQuote}
            trend={{ value: "+5%", type: "positive" }}
          />
          <StatsCard
            title="Contact Enquiries"
            value={MOCK_DASHBOARD_STATS.enquiriesCount}
            subtext="Business opportunities"
            icon={Inbox}
            trend={{ value: "+24%", type: "positive" }}
          />
          <StatsCard
            title="Published Portfolio"
            value={MOCK_DASHBOARD_STATS.publishedCount}
            subtext="Active live projects"
            icon={Globe}
            trend={{ value: "Stable", type: "neutral" }}
          />
        </div>

        {/* 2. Quick Actions */}
        <div className="space-y-4">
          <h2 className="font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
            Administrative Shortcuts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <QuickActionCard key={idx} {...action} />
            ))}
          </div>
        </div>

        {/* 3. Recent Records split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Enquiries */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-xs font-semibold text-primary">
                Recent Contact Enquiries
              </h3>
              <button
                onClick={() => router.push("/admin/enquiries")}
                className="flex items-center gap-1 text-[10px] font-semibold text-secondary hover:underline cursor-pointer"
              >
                <span>View Inbox</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/40">
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Name
                    </th>
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Company
                    </th>
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Project Type
                    </th>
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {recentEnquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-5 py-3 text-xs font-semibold text-primary">{e.name}</td>
                      <td className="px-5 py-3 text-xs text-on-surface-variant">{e.company}</td>
                      <td className="px-5 py-3 text-xs text-on-surface">{e.projectType}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[8px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            e.status === "New"
                              ? "bg-secondary-container/20 text-on-secondary-container"
                              : "bg-surface-container text-on-surface-variant/60"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-xs font-semibold text-primary">
                Recent Projects
              </h3>
              <button
                onClick={() => router.push("/admin/portfolio")}
                className="flex items-center gap-1 text-[10px] font-semibold text-secondary hover:underline cursor-pointer"
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/40">
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Project
                    </th>
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Category
                    </th>
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {recentProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-5 py-3 text-xs font-semibold text-primary">{p.title}</td>
                      <td className="px-5 py-3 text-xs font-mono text-on-surface-variant uppercase text-[10px]">
                        {p.category}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[8px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            p.status === "Published"
                              ? "bg-secondary-container/20 text-on-secondary-container"
                              : "bg-surface-container text-on-surface-variant/60"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-on-surface-variant font-mono">{p.createdDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import QuickActionCard from "@/components/admin/QuickActionCard";
import { getDashboardEnquiryStatsAction } from "@/lib/enquiries/actions";
import {
  Inbox,
  Database,
  Activity,
  Settings,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  
  const [stats, setStats] = useState<{
    total: number;
    unread: number;
    recent: {
      id: string;
      name: string;
      email: string;
      phone: string;
      company: string;
      projectType: string;
      message: string;
      date: string;
      status: "New" | "Reviewed";
    }[];
  }>({
    total: 0,
    unread: 0,
    recent: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data on mount
  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      const data = await getDashboardEnquiryStatsAction();
      setStats(data);
      setIsLoading(false);
    }
    Promise.resolve().then(() => {
      loadDashboardData();
    });
  }, []);

  const totalEnquiriesCount = stats.total;
  const unreadEnquiriesCount = stats.unread;
  const recentEnquiries = stats.recent;

  const quickActions = [
    {
      title: "Open CMS Studio",
      description: "Manage website pages, SEO metadata, portfolio works, and client testimonials.",
      actionText: "Launch Studio",
      icon: ExternalLink,
      onClick: () => window.open("/studio", "_blank"),
    },
    {
      title: "View Enquiries",
      description: "Inspect customer RFPs, contact details, and project categories.",
      actionText: "Open Inbox",
      icon: Inbox,
      onClick: () => router.push("/admin/enquiries"),
    },
    {
      title: "Website Settings",
      description: "Configure system Preferences, dashboard accent themes, and API configurations.",
      actionText: "Open Settings",
      icon: Settings,
      onClick: () => router.push("/admin/settings"),
    },
    {
      title: "System Status",
      description: "Inspect project IDs, datasets, active environments, and API status parameters.",
      actionText: "View Diagnostics",
      icon: Activity,
      onClick: () => router.push("/admin/cms"),
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
              Operational control panel and system diagnostics for HexaKode.
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
            title="Total Enquiries"
            value={isLoading ? "..." : totalEnquiriesCount}
            subtext="All contact responses"
            icon={Inbox}
            trend={{ value: "Stable", type: "neutral" }}
          />
          <StatsCard
            title="Unread Enquiries"
            value={isLoading ? "..." : unreadEnquiriesCount}
            subtext="Require review"
            icon={Inbox}
            trend={{ value: "+24%", type: "positive" }}
          />
          <StatsCard
            title="CMS Engine Status"
            value="Active (Local)"
            subtext="Sanity studio connected"
            icon={Database}
            trend={{ value: "Online", type: "positive" }}
          />
          <StatsCard
            title="System Health"
            value="Operational"
            subtext="All systems nominal"
            icon={ShieldCheck}
            trend={{ value: "100%", type: "positive" }}
          />
        </div>

        {/* 2. Quick Actions */}
        <div className="space-y-4">
          <h2 className="font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
            Operational Shortcuts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <QuickActionCard key={idx} {...action} />
            ))}
          </div>
        </div>

        {/* 3. Recent Records Layout */}
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
            <table className="w-full text-left border-collapse min-w-[600px]">
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
                  <th className="px-5 py-3 font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-semibold">
                    Received Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                        <span className="text-xs text-on-surface-variant/70">Loading recent enquiries...</span>
                      </div>
                    </td>
                  </tr>
                ) : recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-xs text-on-surface-variant/50">
                      No enquiries received yet.
                    </td>
                  </tr>
                ) : (
                  recentEnquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-5 py-3 text-xs font-semibold text-primary">{e.name}</td>
                      <td className="px-5 py-3 text-xs text-on-surface-variant">{e.company || "-"}</td>
                      <td className="px-5 py-3 text-xs text-on-surface">{e.projectType || "-"}</td>
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
                      <td className="px-5 py-3 text-xs text-on-surface-variant font-mono">{e.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

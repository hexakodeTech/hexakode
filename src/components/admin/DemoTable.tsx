"use client";

import React, { useState, useEffect } from "react";
import { AdminDemoRequest } from "@/types/admin";
import DataTable from "./DataTable";
import StatsCard from "./StatsCard";
import { 
  Eye, 
  Edit, 
  X, 
  Mail, 
  Landmark, 
  Trash2, 
  Loader2, 
  Phone, 
  Calendar, 
  Link as LinkIcon, 
  Clock, 
  AlignLeft,
  CheckCircle,
  Inbox,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { 
  getDemoRequestsAction, 
  updateDemoRequestStatusAction, 
  deleteDemoRequestAction,
  scheduleMeetingAction,
  getDemoRequestStatsAction
} from "@/lib/demos/actions";
import { createClient } from "@/lib/supabase/client";

export default function DemoTable() {
  const [demos, setDemos] = useState<AdminDemoRequest[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    newRequests: 0,
    scheduledRequests: 0,
    completedRequests: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // View Modal State
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<AdminDemoRequest | null>(null);

  // Edit Status Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDemo, setEditDemo] = useState<AdminDemoRequest | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AdminDemoRequest["status"]>("NEW");

  // Schedule Meeting Section in View Modal State
  const [isScheduling, setIsScheduling] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isSavingMeeting, setIsSavingMeeting] = useState(false);

  // Function to load all data from the database
  const loadData = async () => {
    try {
      setError(null);
      const data = await getDemoRequestsAction();
      setDemos(data);
      
      const statsData = await getDemoRequestStatsAction();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading demo requests:", err);
      const msg = err instanceof Error ? err.message : "Failed to load demo requests.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch demos and stats on mount
  useEffect(() => {
    Promise.resolve().then(() => {
      loadData();
    });

    // Enable Supabase Realtime
    const supabase = createClient();
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "demo_requests",
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Status updates
  const handleUpdateStatus = async (id: string, status: AdminDemoRequest["status"]) => {
    const prevDemos = demos;
    setDemos(
      demos.map((d) => (d.id === id ? { ...d, status } : d))
    );

    const res = await updateDemoRequestStatusAction(id, status);
    if (!res.success) {
      toast.error(res.error || "Failed to update status in database.");
      setDemos(prevDemos);
    } else {
      toast.success(`Demo request status updated to ${status}.`);
      loadData();
    }
  };

  // Delete request
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demo request? This action cannot be undone.")) {
      return;
    }

    const prevDemos = demos;
    setDemos(demos.filter((d) => d.id !== id));

    const res = await deleteDemoRequestAction(id);
    if (!res.success) {
      toast.error(res.error || "Failed to delete demo request from database.");
      setDemos(prevDemos);
    } else {
      toast.success("Demo request deleted successfully.");
      loadData();
    }
  };

  // Open View Modal
  const handleOpenView = (demo: AdminDemoRequest) => {
    setActiveDemo(demo);
    setIsViewOpen(true);
    setIsScheduling(false);
    setMeetingLink(demo.meetingLink || "");
    setMeetingTime(demo.meetingTime ? new Date(demo.meetingTime).toISOString().slice(0, 16) : "");
    setMeetingNotes(demo.notes || "");
  };

  // Open Edit Status Modal
  const handleOpenEdit = (demo: AdminDemoRequest) => {
    setEditDemo(demo);
    setSelectedStatus(demo.status);
    setIsEditOpen(true);
  };

  // Handle Meeting Schedule Submission
  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDemo) return;
    if (!meetingLink) {
      toast.error("Please provide a Google Meet link.");
      return;
    }
    if (!meetingTime) {
      toast.error("Please select a meeting date and time.");
      return;
    }

    setIsSavingMeeting(true);
    const res = await scheduleMeetingAction(activeDemo.id, meetingLink, meetingTime, meetingNotes);
    setIsSavingMeeting(false);

    if (!res.success) {
      toast.error(res.error || "Failed to schedule meeting.");
    } else {
      toast.success("Meeting scheduled and status changed to SCHEDULED!");
      setIsViewOpen(false);
      loadData();
    }
  };

  // Filter Logic
  const filteredDemos = demos.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDemos.length / itemsPerPage);
  const displayedDemos = filteredDemos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Dynamic Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Requests"
          value={isLoading ? "..." : stats.total}
          subtext="All scheduled walkthroughs"
          icon={Inbox}
          trend={{ value: "Live sync", type: "positive" }}
        />
        <StatsCard
          title="New Requests"
          value={isLoading ? "..." : stats.newRequests}
          subtext="Unprocessed submissions"
          icon={AlertCircle}
          trend={{ value: stats.newRequests > 0 ? "Action needed" : "Clean", type: stats.newRequests > 0 ? "negative" : "positive" }}
        />
        <StatsCard
          title="Scheduled Demos"
          value={isLoading ? "..." : stats.scheduledRequests}
          subtext="Meetings scheduled"
          icon={Calendar}
          trend={{ value: "Active pipeline", type: "positive" }}
        />
        <StatsCard
          title="Completed Demos"
          value={isLoading ? "..." : stats.completedRequests}
          subtext="Successful pitches"
          icon={CheckCircle}
          trend={{ value: "Sales conversions", type: "positive" }}
        />
      </div>

      {/* Main Table Card */}
      <div className="relative">
        <DataTable
          title="Demo Requests Dashboard"
          subtitle="Manage scheduled platform walkthroughs, client sales meetings, and real-time requests"
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search demo requests..."
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          filterSlot={
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          }
          headers={["Name", "Contact Info", "Company", "Phone", "Date", "Status", "Actions"]}
        >
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="animate-pulse">
                <td className="px-6 py-4"><div className="h-4 w-24 bg-surface-container rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-32 bg-surface-container rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-20 bg-surface-container rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-24 bg-surface-container rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-surface-container rounded" /></td>
                <td className="px-6 py-4"><div className="h-5 w-16 bg-surface-container rounded-full" /></td>
                <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-container rounded" /></td>
              </tr>
            ))
          ) : error ? (
            // Error State
            <tr>
              <td colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-3 text-error">
                  <AlertCircle className="w-12 h-12 stroke-[1.25]" />
                  <span className="text-sm font-medium">Failed to load demo requests</span>
                  <p className="text-xs max-w-md leading-relaxed text-on-surface-variant/60">
                    {error}
                  </p>
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      loadData();
                    }}
                    className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer"
                  >
                    Retry Connection
                  </button>
                </div>
              </td>
            </tr>
          ) : displayedDemos.length === 0 ? (
            // Empty State
            <tr>
              <td colSpan={7} className="text-center py-16">
                <div className="flex flex-col items-center justify-center gap-3 text-on-surface-variant/50">
                  <Calendar className="w-12 h-12 stroke-[1.25]" />
                  <span className="text-sm font-medium">No demo requests found</span>
                  <p className="text-xs max-w-xs leading-relaxed text-on-surface-variant/60">
                    Submit requests through the public form or update your search and status filters.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            displayedDemos.map((d) => (
              <tr key={d.id} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold text-primary block">{d.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-primary leading-none">{d.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase">
                    {d.company || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-on-surface">
                  {d.phone || "-"}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-on-surface-variant/70 font-mono">{d.date}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      d.status === "NEW"
                        ? "bg-secondary-container/20 text-on-secondary-container"
                        : d.status === "CONTACTED"
                        ? "bg-amber-500/10 text-amber-500"
                        : d.status === "SCHEDULED"
                        ? "bg-blue-500/10 text-blue-500"
                        : d.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenView(d)}
                      className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                      title="View Request Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(d)}
                      className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer"
                      title="Edit Status"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                      title="Delete Demo Request"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </DataTable>
      </div>

      {/* View Details / Schedule Meeting Modal */}
      {isViewOpen && activeDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div>
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Demo Request Details
                </h3>
                <span className="font-label-mono text-[9px] text-on-surface-variant/60 uppercase">
                  ID: {activeDemo.id}
                </span>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Contact Info Block */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2 bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/10">
                  <Landmark className="w-4 h-4 text-on-surface-variant/70 mt-0.5" />
                  <div>
                    <span className="font-label-mono text-[8px] uppercase text-on-surface-variant/60">
                      Company
                    </span>
                    <p className="font-semibold text-primary">{activeDemo.company || "-"}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{activeDemo.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/10">
                  <Mail className="w-4 h-4 text-on-surface-variant/70 mt-0.5" />
                  <div>
                    <span className="font-label-mono text-[8px] uppercase text-on-surface-variant/60">
                      Contact
                    </span>
                    <p className="font-semibold text-primary leading-tight break-all text-[11px] mb-1">
                      {activeDemo.email}
                    </p>
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-secondary" />
                      {activeDemo.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Submitted Date */}
              <div className="grid grid-cols-2 gap-4 text-xs border-t border-outline-variant/20 pt-4">
                <div>
                  <span className="block font-label-mono text-[8px] uppercase text-on-surface-variant/60 mb-0.5">
                    Submitted Date
                  </span>
                  <span className="font-mono text-on-surface-variant">{activeDemo.date}</span>
                </div>
                <div>
                  <span className="block font-label-mono text-[8px] uppercase text-on-surface-variant/60 mb-0.5">
                    Status
                  </span>
                  <span
                    className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full inline-block ${
                      activeDemo.status === "NEW"
                        ? "bg-secondary-container/20 text-on-secondary-container"
                        : activeDemo.status === "CONTACTED"
                        ? "bg-amber-500/10 text-amber-500"
                        : activeDemo.status === "SCHEDULED"
                        ? "bg-blue-500/10 text-blue-500"
                        : activeDemo.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {activeDemo.status}
                  </span>
                </div>
              </div>

              {/* Display Meeting info if SCHEDULED */}
              {activeDemo.meetingLink && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-3 text-xs">
                  <h4 className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Scheduled Meeting Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-500/80" />
                      <span className="text-[10px] text-on-surface-variant">Google Meet:</span>
                      <a 
                        href={activeDemo.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-secondary font-medium hover:underline break-all"
                      >
                        {activeDemo.meetingLink}
                      </a>
                    </div>
                    {activeDemo.meetingTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-500/80" />
                        <span className="text-[10px] text-on-surface-variant">Time:</span>
                        <span className="font-semibold text-primary">
                          {new Date(activeDemo.meetingTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {activeDemo.notes && (
                      <div className="flex items-start gap-2 pt-1">
                        <AlignLeft className="w-3.5 h-3.5 text-blue-500/80 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">Notes:</span>
                          <p className="text-on-surface mt-0.5 bg-surface-container-low/50 p-2 rounded border border-outline-variant/10 whitespace-pre-wrap">
                            {activeDemo.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule Meeting Form */}
              {isScheduling ? (
                <form onSubmit={handleSaveMeeting} className="border-t border-outline-variant/20 pt-4 space-y-4 text-xs">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    Provide Meeting Details
                  </h4>
                  
                  <div className="space-y-1">
                    <label htmlFor="meet-link" className="font-label-mono text-[9px] uppercase text-on-surface-variant">
                      Google Meet Link
                    </label>
                    <input
                      id="meet-link"
                      type="url"
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="meet-time" className="font-label-mono text-[9px] uppercase text-on-surface-variant">
                      Meeting Date & Time
                    </label>
                    <input
                      id="meet-time"
                      type="datetime-local"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="meet-notes" className="font-label-mono text-[9px] uppercase text-on-surface-variant">
                      Notes
                    </label>
                    <textarea
                      id="meet-notes"
                      rows={3}
                      placeholder="Add agenda, client requirements or notes here..."
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsScheduling(false)}
                      className="px-3.5 py-1.5 border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingMeeting}
                      className="px-3.5 py-1.5 bg-secondary text-white font-semibold rounded-lg hover:brightness-110 hover:shadow-lg disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSavingMeeting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Meeting"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={() => setIsScheduling(true)}
                    className="px-4 py-2 border border-secondary text-secondary text-xs font-semibold rounded-lg hover:bg-secondary/10 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {activeDemo.status === "SCHEDULED" ? "Reschedule Meeting" : "Schedule Meeting"}
                  </button>
                  <button
                    onClick={() => setIsViewOpen(false)}
                    className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditOpen && editDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium relative">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div>
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Edit Request Status
                </h3>
                <span className="text-[10px] text-on-surface-variant font-medium block mt-0.5">
                  {editDemo.name} — {editDemo.company}
                </span>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label htmlFor="status-select" className="font-label-mono text-[9px] uppercase text-on-surface-variant font-semibold">
                  Select New Status
                </label>
                <select
                  id="status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as AdminDemoRequest["status"])}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-secondary text-sm"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(editDemo.id, selectedStatus);
                    setIsEditOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

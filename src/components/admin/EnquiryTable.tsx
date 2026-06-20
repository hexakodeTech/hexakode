"use client";

import React, { useState, useEffect } from "react";
import { AdminEnquiry } from "@/types/admin";
import DataTable from "./DataTable";
import { Eye, CheckSquare, Archive, X, Mail, Landmark, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getEnquiriesAction, updateEnquiryStatusAction, deleteEnquiryAction } from "@/lib/enquiries/actions";

export default function EnquiryTable() {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // View Modal State
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeEnquiry, setActiveEnquiry] = useState<AdminEnquiry | null>(null);

  // Fetch enquiries on mount
  useEffect(() => {
    async function loadEnquiries() {
      setIsLoading(true);
      const data = await getEnquiriesAction();
      setEnquiries(data);
      setIsLoading(false);
    }
    loadEnquiries();
  }, []);

  // Status updates
  const handleMarkReviewed = async (id: string) => {
    const prevEnquiries = enquiries;
    setEnquiries(
      enquiries.map((e) => (e.id === id ? { ...e, status: "Reviewed" as const } : e))
    );

    const res = await updateEnquiryStatusAction(id, 'RESPONDED');
    if (!res.success) {
      toast.error(res.error || "Failed to update status in database.");
      setEnquiries(prevEnquiries);
    } else {
      toast.success("Enquiry marked as reviewed.");
    }
  };

  const handleMarkArchived = async (id: string) => {
    const prevEnquiries = enquiries;
    setEnquiries(
      enquiries.map((e) => (e.id === id ? { ...e, status: "Archived" as const } : e))
    );

    const res = await updateEnquiryStatusAction(id, 'ARCHIVED');
    if (!res.success) {
      toast.error(res.error || "Failed to archive enquiry.");
      setEnquiries(prevEnquiries);
    } else {
      toast.success("Enquiry archived successfully.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      return;
    }

    const prevEnquiries = enquiries;
    setEnquiries(enquiries.filter((e) => e.id !== id));

    const res = await deleteEnquiryAction(id);
    if (!res.success) {
      toast.error(res.error || "Failed to delete enquiry from database.");
      setEnquiries(prevEnquiries);
    } else {
      toast.success("Enquiry deleted successfully.");
    }
  };

  const handleOpenView = (enquiry: AdminEnquiry) => {
    setActiveEnquiry(enquiry);
    setIsViewOpen(true);
    if (enquiry.status === "New") {
      handleMarkReviewed(enquiry.id);
    }
  };

  // Filter Logic
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const displayedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <DataTable
        title="Contact Enquiries"
        subtitle="Manage business development inquiries and RFPs"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search inbox..."
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
            <option value="All">All Inboxes</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Archived">Archived</option>
          </select>
        }
        headers={["Name", "Contact Info", "Company", "Project Type", "Date", "Status", "Actions"]}
      >
        {isLoading ? (
          <tr>
            <td colSpan={7} className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                <span className="text-xs text-on-surface-variant/70">Loading live enquiries...</span>
              </div>
            </td>
          </tr>
        ) : displayedEnquiries.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-xs text-on-surface-variant/50">
              No enquiries found matching searches.
            </td>
          </tr>
        ) : (
          displayedEnquiries.map((e) => (
            <tr key={e.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary block">{e.name}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-primary leading-none">{e.email}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase">
                  {e.company || "-"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-on-surface">{e.projectType || "-"}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-on-surface-variant/70 font-mono">{e.date}</span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    e.status === "New"
                      ? "bg-secondary-container/20 text-on-secondary-container"
                      : e.status === "Reviewed"
                      ? "bg-surface-container-high text-on-surface-variant"
                      : "bg-surface-container text-on-surface-variant/55"
                  }`}
                >
                  {e.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenView(e)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="View Message details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  {e.status !== "Reviewed" && e.status !== "Archived" && (
                    <button
                      onClick={() => handleMarkReviewed(e.id)}
                      className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer"
                      title="Mark as Reviewed"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {e.status !== "Archived" && (
                    <button
                      onClick={() => handleMarkArchived(e.id)}
                      className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                      title="Archive Enquiry"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* Message Viewer Modal */}
      {isViewOpen && activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div>
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Inquiry Message Details
                </h3>
                <span className="font-label-mono text-[9px] text-on-surface-variant/60 uppercase">
                  {activeEnquiry.id}
                </span>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2 bg-surface-container-low/40 p-2.5 rounded-lg border border-outline-variant/10">
                  <Landmark className="w-4 h-4 text-on-surface-variant/70 mt-0.5" />
                  <div>
                    <span className="font-label-mono text-[8px] uppercase text-on-surface-variant/60">
                      Company
                    </span>
                    <p className="font-semibold text-primary">{activeEnquiry.company || "-"}</p>
                    <p className="text-[10px] text-on-surface-variant">{activeEnquiry.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-surface-container-low/40 p-2.5 rounded-lg border border-outline-variant/10">
                  <Mail className="w-4 h-4 text-on-surface-variant/70 mt-0.5" />
                  <div>
                    <span className="font-label-mono text-[8px] uppercase text-on-surface-variant/60">
                      Contact
                    </span>
                    <p className="font-semibold text-primary leading-tight break-all text-[11px]">
                      {activeEnquiry.email}
                    </p>
                    <span className="font-label-mono text-[8px] bg-secondary-container/30 text-on-secondary-container px-1 py-0.5 rounded uppercase mt-1 inline-block">
                      {activeEnquiry.projectType || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Message Content
                </span>
                <div className="bg-surface-container-low/60 border border-outline-variant/20 rounded-lg p-4 text-xs text-on-surface leading-relaxed whitespace-pre-wrap font-body-sm">
                  {activeEnquiry.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <span className="block font-label-mono text-[9px] uppercase text-on-surface-variant/60 mb-0.5">
                    Date Received
                  </span>
                  <span className="font-mono text-on-surface-variant">{activeEnquiry.date}</span>
                </div>
                <div>
                  <span className="block font-label-mono text-[9px] uppercase text-on-surface-variant/60 mb-0.5">
                    Current Status
                  </span>
                  <span
                    className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full inline-block ${
                      activeEnquiry.status === "New"
                        ? "bg-secondary-container/20 text-on-secondary-container"
                        : activeEnquiry.status === "Reviewed"
                        ? "bg-surface-container-high text-on-surface-variant"
                        : "bg-surface-container text-on-surface-variant/55"
                    }`}
                  >
                    {activeEnquiry.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-6">
                {activeEnquiry.status === "New" && (
                  <button
                    onClick={() => {
                      handleMarkReviewed(activeEnquiry.id);
                      setIsViewOpen(false);
                    }}
                    className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
                  >
                    Mark Reviewed
                  </button>
                )}
                {activeEnquiry.status !== "Archived" && (
                  <button
                    onClick={() => {
                      handleMarkArchived(activeEnquiry.id);
                      setIsViewOpen(false);
                    }}
                    className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/10 transition-all cursor-pointer"
                  >
                    Archive Message
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(activeEnquiry.id);
                    setIsViewOpen(false);
                  }}
                  className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/10 transition-all cursor-pointer"
                >
                  Delete Message
                </button>
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

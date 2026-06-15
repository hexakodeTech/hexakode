"use client";

import React, { useState } from "react";
import { MOCK_TESTIMONIALS } from "@/mock-data/testimonials";
import { AdminTestimonial } from "@/types/admin";
import DataTable from "./DataTable";
import { Star, Edit2, Trash2, Plus, Check, X, ShieldAlert } from "lucide-react";

export default function TestimonialTable() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(MOCK_TESTIMONIALS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal and Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<AdminTestimonial | null>(null);

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"Active" | "Pending">("Pending");

  const handleOpenAdd = () => {
    setActiveTestimonial(null);
    setIsEditing(false);
    setClientName("");
    setPosition("");
    setCompany("");
    setRating(5);
    setContent("");
    setStatus("Pending");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (testimonial: AdminTestimonial) => {
    setActiveTestimonial(testimonial);
    setIsEditing(true);
    setClientName(testimonial.clientName);
    setPosition(testimonial.position);
    setCompany(testimonial.company);
    setRating(testimonial.rating);
    setContent(testimonial.content);
    setStatus(testimonial.status);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === id ? { ...t, status: t.status === "Active" ? "Pending" : "Active" } : t
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !position || !company || !content) return;

    if (isEditing && activeTestimonial) {
      setTestimonials(
        testimonials.map((t) =>
          t.id === activeTestimonial.id
            ? { ...t, clientName, position, company, rating, content, status }
            : t
        )
      );
    } else {
      const newTestimonial: AdminTestimonial = {
        id: `test-${Date.now()}`,
        clientName,
        position,
        company,
        rating,
        content,
        status,
        date: new Date().toISOString().split("T")[0],
      };
      setTestimonials([newTestimonial, ...testimonials]);
    }
    setIsFormOpen(false);
  };

  // Filter Logic
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.company.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const displayedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <DataTable
        title="Testimonials Management"
        subtitle="Approve and manage executive testimonials shown on public landing pages"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search reviews..."
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
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
        }
        actionSlot={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Testimonial</span>
          </button>
        }
        headers={["Client Name", "Position / Company", "Rating", "Status", "Actions"]}
      >
        {displayedTestimonials.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-8 text-xs text-on-surface-variant/50">
              No testimonials matching search filters.
            </td>
          </tr>
        ) : (
          displayedTestimonials.map((t) => (
            <tr key={t.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <span className="text-xs font-semibold text-primary block">{t.clientName}</span>
                  <p className="text-[11px] text-on-surface-variant/75 mt-0.5 line-clamp-1 max-w-sm italic">
                    "{t.content}"
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-primary font-medium block">{t.position}</span>
                <span className="font-label-mono text-[9px] text-on-surface-variant/60 uppercase">
                  {t.company}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < t.rating ? "text-secondary fill-secondary" : "text-outline-variant/40"
                      }`}
                    />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleStatus(t.id)}
                  title="Click to toggle status"
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                    t.status === "Active"
                      ? "bg-secondary-container/20 text-on-secondary-container hover:bg-secondary-container/30"
                      : "bg-surface-container text-on-surface-variant/70 hover:bg-outline-variant/30"
                  }`}
                >
                  {t.status}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1 rounded text-on-surface-variant hover:bg-error-container/10 hover:text-error transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* Form Dialog Modal (Add/Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">
                {isEditing ? "Edit Client Testimonial" : "Add Client Testimonial"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="E.g. Jane Miller"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Client Corporate Position
                  </label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="E.g. VP of Product"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="E.g. Vercel Inc."
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Rating (1-5 Stars)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Approval Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary"
                >
                  <option value="Pending">Pending Approval</option>
                  <option value="Active">Active / Approved</option>
                </select>
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Testimonial content
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste review or client feedback content..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  {isEditing ? "Save Changes" : "Create Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

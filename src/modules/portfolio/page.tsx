"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio CMS Module — Main Page Component
// This is the root component rendered by /admin/cms/portfolio/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  SortAsc,
  Filter,
} from "lucide-react";
import { PortfolioCategory, PortfolioStatus, SortOption } from "./types";
import { usePortfolio } from "./hooks/usePortfolio";
import { PortfolioGrid } from "./components/PortfolioGrid";
import { PortfolioFormModal } from "./dialogs/PortfolioFormModal";
import { PortfolioPreviewModal } from "./dialogs/PortfolioPreviewModal";
import { DeleteConfirmModal } from "./dialogs/DeleteConfirmModal";

// ── Category options ──────────────────────────────────────────────────────────
const CATEGORY_OPTIONS: (PortfolioCategory | "All")[] = [
  "All",
  "Web Application",
  "Mobile App",
  "UI/UX Design",
  "E-Commerce",
  "SaaS Platform",
  "Healthcare",
  "Finance",
  "Education",
  "Food & Beverage",
  "Manufacturing",
  "Other",
];

const STATUS_OPTIONS: (PortfolioStatus | "All")[] = ["All", "Published", "Draft"];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "featured", label: "Featured First" },
];

// ─────────────────────────────────────────────────────────────────────────────
// PortfolioCMSPage
// ─────────────────────────────────────────────────────────────────────────────

export default function PortfolioCMSPage() {
  const {
    filteredProjects,
    projects,
    activeProject,
    filters,
    updateFilter,
    modalMode,
    openCreate,
    openEdit,
    openPreview,
    openDelete,
    closeModal,
    formData,
    updateForm,
    updateFormNested,
    handleTitleChange,
    saveDraft,
    publishProject,
    duplicateProject,
    deleteProject,
  } = usePortfolio();

  const publishedCount = projects.filter((p) => p.status === "Published").length;
  const draftCount = projects.filter((p) => p.status === "Draft").length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
            Portfolio CMS
          </h1>
          <p className="text-xs text-on-surface-variant/70 mt-1 font-body-sm">
            Manage your client work, case studies, and project showcase.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-on-primary text-xs font-semibold px-4 py-2.5 rounded-lg shadow-premium hover:shadow-premium-hover transition-all cursor-pointer self-start sm:self-auto"
          id="portfolio-add-btn"
        >
          <Plus className="w-4 h-4" />
          Add Portfolio
        </motion.button>
      </motion.div>

      {/* ── Stats Row ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          {
            label: "Total Projects",
            value: projects.length,
            color: "text-primary",
            bg: "bg-surface-container-low",
          },
          {
            label: "Published",
            value: publishedCount,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Draft",
            value: draftCount,
            color: "text-on-surface-variant",
            bg: "bg-surface-container",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`${bg} border border-outline-variant/20 rounded-xl p-4 text-center`}
          >
            <p className={`font-headline-sm text-2xl font-bold ${color}`}>{value}</p>
            <p className="font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Filter & Search Bar ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
            <input
              type="text"
              id="portfolio-search"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search projects, clients, technologies..."
              className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-lg pl-9 pr-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all placeholder:text-outline/40"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-on-surface-variant/50 flex-shrink-0" />
            <select
              id="portfolio-category-filter"
              value={filters.category}
              onChange={(e) =>
                updateFilter("category", e.target.value as PortfolioCategory | "All")
              }
              className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-secondary transition-all cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              id="portfolio-status-filter"
              value={filters.status}
              onChange={(e) =>
                updateFilter("status", e.target.value as PortfolioStatus | "All")
              }
              className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-secondary transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Statuses" : s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <SortAsc className="w-3 h-3 text-on-surface-variant/50 flex-shrink-0" />
            <select
              id="portfolio-sort"
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value as SortOption)}
              className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-secondary transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter summary */}
        {(filters.search || filters.category !== "All" || filters.status !== "All") && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/15">
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/50">
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            <button
              onClick={() => {
                updateFilter("search", "");
                updateFilter("category", "All");
                updateFilter("status", "All");
              }}
              className="text-[10px] text-secondary hover:text-secondary/70 transition-colors cursor-pointer ml-auto"
            >
              Clear filters
            </button>
          </div>
        )}
      </motion.div>

      {/* ── Portfolio Grid ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16 }}
      >
        <PortfolioGrid
          projects={filteredProjects}
          onEdit={openEdit}
          onPreview={openPreview}
          onDuplicate={duplicateProject}
          onDelete={openDelete}
          onCreateFirst={openCreate}
        />
      </motion.div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}

      {/* Create / Edit Form Modal */}
      <PortfolioFormModal
        isOpen={modalMode === "create" || modalMode === "edit"}
        isEditing={modalMode === "edit"}
        formData={formData}
        updateForm={updateForm}
        updateFormNested={updateFormNested}
        handleTitleChange={handleTitleChange}
        onSaveDraft={saveDraft}
        onPublish={publishProject}
        onCancel={closeModal}
      />

      {/* Preview Modal */}
      <PortfolioPreviewModal
        isOpen={modalMode === "preview"}
        project={activeProject}
        onClose={closeModal}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={modalMode === "delete"}
        project={activeProject}
        onConfirm={deleteProject}
        onCancel={closeModal}
      />
    </div>
  );
}

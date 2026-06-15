"use client";

import React, { useState } from "react";
import { MOCK_PROJECTS } from "@/mock-data/portfolio";
import { AdminProject } from "@/types/admin";
import DataTable from "./DataTable";
import { Edit2, Trash2, Eye, Plus, Check, X } from "lucide-react";

export default function PortfolioTable() {
  const [projects, setProjects] = useState<AdminProject[]>(MOCK_PROJECTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<AdminProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Web" | "Mobile" | "UI/UX" | "Software">("Software");
  const [status, setStatus] = useState<"Published" | "Draft">("Draft");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);

  // Handler functions
  const handleOpenAdd = () => {
    setActiveProject(null);
    setIsEditing(false);
    setTitle("");
    setCategory("Software");
    setStatus("Draft");
    setDescription("");
    setSlug("");
    setImage("https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e");
    setFeatured(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: AdminProject) => {
    setActiveProject(project);
    setIsEditing(true);
    setTitle(project.title);
    setCategory(project.category);
    setStatus(project.status);
    setDescription(project.description);
    setSlug(project.slug);
    setImage(project.image);
    setFeatured(project.featured);
    setIsFormOpen(true);
  };

  const handleOpenView = (project: AdminProject) => {
    setActiveProject(project);
    setIsViewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !slug) return;

    if (isEditing && activeProject) {
      setProjects(
        projects.map((p) =>
          p.id === activeProject.id
            ? { ...p, title, category, status, description, slug, image, featured }
            : p
        )
      );
    } else {
      const newProject: AdminProject = {
        id: `proj-${Date.now()}`,
        title,
        category,
        status,
        description,
        slug,
        image,
        featured,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setProjects([newProject, ...projects]);
    }
    setIsFormOpen(false);
  };

  // Filters logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || project.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <DataTable
        title="Portfolio Management"
        subtitle="Manage the project catalog and published client work"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search projects..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        filterSlot={
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Software">Software</option>
          </select>
        }
        actionSlot={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        }
        headers={["Project Name", "Category", "Status", "Created Date", "Actions"]}
      >
        {displayedProjects.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-8 text-xs text-on-surface-variant/50">
              No projects matching criteria.
            </td>
          </tr>
        ) : (
          displayedProjects.map((project) => (
            <tr key={project.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-10 h-8 rounded object-cover border border-outline-variant/20"
                  />
                  <div>
                    <span className="text-xs font-semibold text-primary block">
                      {project.title}
                    </span>
                    {project.featured && (
                      <span className="font-label-mono text-[8px] bg-secondary-container/40 text-on-secondary-container px-1 py-0.5 rounded uppercase mt-0.5 inline-block">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-label-mono text-[10px] text-on-surface-variant/70 uppercase">
                  {project.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    project.status === "Published"
                      ? "bg-secondary-container/20 text-on-secondary-container"
                      : "bg-surface-container text-on-surface-variant/70"
                  }`}
                >
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-on-surface-variant/70 font-mono">
                  {project.createdDate}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenView(project)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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
                {isEditing ? "Edit Portfolio Project" : "Create New Project"}
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
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!isEditing) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="Enter project title"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Slug Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="project-slug-path"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Software">Software</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Description / Case Study Summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the architectural complexity and solutions..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
                />
                <label
                  htmlFor="featured"
                  className="ml-3 font-body-sm text-on-surface-variant text-xs cursor-pointer select-none"
                >
                  Feature this project prominently on the portfolio catalog bento-grid
                </label>
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
                  {isEditing ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {isViewOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-premium">
            {/* Project Image */}
            <div className="relative h-48 w-full bg-slate-900">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setIsViewOpen(false)}
                className="absolute top-4 right-4 rounded-full p-2 bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="font-label-mono text-[9px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activeProject.category}
                </span>
                <h3 className="font-headline-md text-lg text-white mt-1.5 font-bold drop-shadow-md">
                  {activeProject.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4">
              <div>
                <span className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Project Description
                </span>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed font-body-sm">
                  {activeProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-0.5">
                    Publication Status
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                      activeProject.status === "Published"
                        ? "bg-secondary-container/20 text-on-secondary-container"
                        : "bg-surface-container text-on-surface-variant/70"
                    }`}
                  >
                    {activeProject.status}
                  </span>
                </div>
                <div>
                  <span className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-0.5">
                    Created Date
                  </span>
                  <span className="text-xs text-on-surface font-mono">
                    {activeProject.createdDate}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

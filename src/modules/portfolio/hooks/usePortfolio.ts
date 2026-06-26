"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio CMS Module — State Management Hook
// All state lives here. Swap mock data for API calls without touching any UI.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback } from "react";
import {
  PortfolioProject,
  PortfolioFilters,
  PortfolioFormData,
  ModalMode,
  SortOption,
} from "../types";
import { PORTFOLIO_MOCK_DATA } from "../mock/data";
import { generateId, nowISO, slugify } from "../utils";

const EMPTY_FORM: PortfolioFormData = {
  title: "",
  slug: "",
  category: "Web Application",
  clientName: "",
  projectUrl: "",
  shortDescription: "",
  longDescription: "",
  coverImage: "",
  gallery: [],
  technologies: [],
  features: [],
  seo: { metaTitle: "", metaDescription: "", ogImage: "" },
  settings: { featured: false, showOnHomepage: false, allowPreview: true },
  status: "Draft",
  publishedAt: null,
};

export function usePortfolio() {
  // ── Data State ──────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<PortfolioProject[]>(PORTFOLIO_MOCK_DATA);

  // ── Filter State ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<PortfolioFilters>({
    search: "",
    category: "All",
    status: "All",
    sort: "newest",
  });

  // ── Modal State ─────────────────────────────────────────────────────────────
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // ── Form State ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<PortfolioFormData>(EMPTY_FORM);

  // ── Derived: active project ──────────────────────────────────────────────────
  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );

  // ── Derived: filtered + sorted list ─────────────────────────────────────────
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Status filter
    if (filters.status !== "All") {
      result = result.filter((p) => p.status === filters.status);
    }

    // Sort
    switch (filters.sort as SortOption) {
      case "oldest":
        result.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "featured":
        result.sort((a, b) => {
          if (a.settings.featured === b.settings.featured) return 0;
          return a.settings.featured ? -1 : 1;
        });
        break;
      case "newest":
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [projects, filters]);

  // ── Filter updaters ─────────────────────────────────────────────────────────
  const updateFilter = useCallback(
    <K extends keyof PortfolioFilters>(key: K, value: PortfolioFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // ── Form field updater ──────────────────────────────────────────────────────
  const updateForm = useCallback(<K extends keyof PortfolioFormData>(
    key: K,
    value: PortfolioFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateFormNested = useCallback(<
    Parent extends "seo" | "settings",
    K extends keyof PortfolioFormData[Parent]
  >(
    parent: Parent,
    key: K,
    value: PortfolioFormData[Parent][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value },
    }));
  }, []);

  // ── Modal openers ───────────────────────────────────────────────────────────
  const openCreate = useCallback(() => {
    setFormData(EMPTY_FORM);
    setActiveProjectId(null);
    setModalMode("create");
  }, []);

  const openEdit = useCallback(
    (id: string) => {
      const project = projects.find((p) => p.id === id);
      if (!project) return;
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = project;
      setFormData(rest as PortfolioFormData);
      setActiveProjectId(id);
      setModalMode("edit");
    },
    [projects]
  );

  const openPreview = useCallback((id: string) => {
    setActiveProjectId(id);
    setModalMode("preview");
  }, []);

  const openDelete = useCallback((id: string) => {
    setActiveProjectId(id);
    setModalMode("delete");
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setActiveProjectId(null);
  }, []);

  // ── CRUD operations ─────────────────────────────────────────────────────────

  /** Save as Draft — sets status=Draft, no publishedAt update */
  const saveDraft = useCallback(() => {
    const now = nowISO();
    if (modalMode === "edit" && activeProjectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, ...formData, status: "Draft", updatedAt: now }
            : p
        )
      );
    } else {
      const newProject: PortfolioProject = {
        ...formData,
        id: generateId("pf"),
        status: "Draft",
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [newProject, ...prev]);
    }
    closeModal();
  }, [formData, modalMode, activeProjectId, closeModal]);

  /** Publish — sets status=Published and publishedAt */
  const publishProject = useCallback(() => {
    const now = nowISO();
    if (modalMode === "edit" && activeProjectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? {
                ...p,
                ...formData,
                status: "Published",
                publishedAt: p.publishedAt ?? now,
                updatedAt: now,
              }
            : p
        )
      );
    } else {
      const newProject: PortfolioProject = {
        ...formData,
        id: generateId("pf"),
        status: "Published",
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [newProject, ...prev]);
    }
    closeModal();
  }, [formData, modalMode, activeProjectId, closeModal]);

  /** Duplicate a project */
  const duplicateProject = useCallback(
    (id: string) => {
      const source = projects.find((p) => p.id === id);
      if (!source) return;
      const now = nowISO();
      const duplicate: PortfolioProject = {
        ...source,
        id: generateId("pf"),
        title: `${source.title} (Copy)`,
        slug: slugify(`${source.slug}-copy`),
        status: "Draft",
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [duplicate, ...prev]);
    },
    [projects]
  );

  /** Delete a project */
  const deleteProject = useCallback(() => {
    if (!activeProjectId) return;
    setProjects((prev) => prev.filter((p) => p.id !== activeProjectId));
    closeModal();
  }, [activeProjectId, closeModal]);

  // ── Title → slug auto-generation ────────────────────────────────────────────
  const handleTitleChange = useCallback(
    (title: string, isEditing: boolean) => {
      updateForm("title", title);
      if (!isEditing) {
        updateForm("slug", slugify(title));
      }
    },
    [updateForm]
  );

  return {
    // Data
    projects,
    filteredProjects,
    activeProject,

    // Filters
    filters,
    updateFilter,

    // Modal
    modalMode,
    activeProjectId,
    openCreate,
    openEdit,
    openPreview,
    openDelete,
    closeModal,

    // Form
    formData,
    updateForm,
    updateFormNested,
    handleTitleChange,

    // Actions
    saveDraft,
    publishProject,
    duplicateProject,
    deleteProject,
  };
}

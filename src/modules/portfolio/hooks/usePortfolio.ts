"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio CMS Module — State Management Hook (Connected to Backend Actions)
// All state lives here. Swapped mock data for API calls without touching any UI.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  PortfolioProject,
  PortfolioFilters,
  PortfolioFormData,
  ModalMode,
} from "../types";
import { slugify } from "../utils";
import {
  getPortfolioListAction,
  createPortfolioAction,
  updatePortfolioAction,
  deletePortfolioAction,
  duplicatePortfolioAction,
} from "../actions";
import { toast } from "sonner";

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
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // ── Fetch / Load projects ────────────────────────────────────────────────────
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPortfolioListAction(filters);
      if (res.success && res.projects) {
        setProjects(res.projects);
      } else {
        toast.error(res.error || "Failed to load projects.");
      }
    } catch (err: any) {
      console.error("loadProjects error:", err);
      toast.error("Failed to load portfolio database records.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Load projects on filter change
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // For the UI, we can just return the filtered database list directly as filteredProjects
  const filteredProjects = projects;

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

  /** Save as Draft — sets status=Draft */
  const saveDraft = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload: PortfolioFormData = {
        ...formData,
        status: "Draft",
      };

      let res;
      if (modalMode === "edit" && activeProjectId) {
        res = await updatePortfolioAction(activeProjectId, payload);
      } else {
        res = await createPortfolioAction(payload);
      }

      if (res.success) {
        toast.success(
          modalMode === "edit" ? "Project updated successfully!" : "Draft created successfully!"
        );
        await loadProjects();
        closeModal();
      } else {
        toast.error(res.error || "Failed to save project.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, modalMode, activeProjectId, loadProjects, closeModal]);

  /** Publish — sets status=Published and sets/updates publishedAt */
  const publishProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload: PortfolioFormData = {
        ...formData,
        status: "Published",
      };

      let res;
      if (modalMode === "edit" && activeProjectId) {
        res = await updatePortfolioAction(activeProjectId, payload);
      } else {
        res = await createPortfolioAction(payload);
      }

      if (res.success) {
        toast.success(
          modalMode === "edit"
            ? "Project updated and published successfully!"
            : "Project published successfully!"
        );
        await loadProjects();
        closeModal();
      } else {
        toast.error(res.error || "Failed to publish project.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while publishing.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, modalMode, activeProjectId, loadProjects, closeModal]);

  /** Duplicate a project */
  const duplicateProject = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const res = await duplicatePortfolioAction(id);
        if (res.success) {
          toast.success("Project duplicated successfully!");
          await loadProjects();
        } else {
          toast.error(res.error || "Failed to duplicate project.");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred while duplicating.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadProjects]
  );

  /** Delete a project */
  const deleteProject = useCallback(async () => {
    if (!activeProjectId) return;
    setIsLoading(true);
    try {
      const res = await deletePortfolioAction(activeProjectId);
      if (res.success) {
        toast.success("Project deleted successfully!");
        await loadProjects();
        closeModal();
      } else {
        toast.error(res.error || "Failed to delete project.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while deleting.");
    } finally {
      setIsLoading(false);
    }
  }, [activeProjectId, loadProjects, closeModal]);

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
    isLoading,
    refresh: loadProjects,

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

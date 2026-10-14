"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBlogSchema } from "@/modules/blog/validation/schemas";
import { BlogListItem, BlogStatus } from "@/modules/blog/types/blog";
import { generateSlug } from "@/modules/blog/utils/helpers";
import BlogEditor from "./BlogEditor";
import BlogLivePreview from "./BlogLivePreview";
import {
  ArrowLeft,
  Loader2,
  Settings,
  Globe,
  Upload,
  X,
  FileText,
  Star,
  RefreshCw,
  Eye,
  Edit3,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Save as SaveIcon,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogFormProps {
  initialData?: BlogListItem & {
    content?: string;
    seoTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [currentPostId, setCurrentPostId] = useState<string | null>(initialData?.id || null);

  // ── Form Input States ──────────────────────────────────────────────────────
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "HexaKode Team");
  const [authorAvatar, setAuthorAvatar] = useState(initialData?.authorAvatar || "");
  const [status, setStatus] = useState<BlogStatus>(initialData?.status || "DRAFT");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [categoryId, setCategoryId] = useState(initialData?.category?.id || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map((t: any) => t.tag?.id || t.tagId) || []
  );

  // SEO states
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");

  // Taxonomies
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "author">("content");
  const [mobileMode, setMobileMode] = useState<"editor" | "preview">("editor");
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSlugAuto, setIsSlugAuto] = useState(!isEdit);

  // ── Save & Auto-Save State Machine ─────────────────────────────────────────
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "dirty" | "error">("saved");
  const [saveButtonState, setSaveButtonState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [publishButtonState, setPublishButtonState] = useState<"idle" | "publishing" | "published" | "error">("idle");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(
    initialData?.updatedAt ? new Date(initialData.updatedAt) : null
  );

  // Refs for race-condition-free saving and queuing
  const isSavingRef = useRef(false);
  const hasPendingChangesRef = useRef(false);
  const lastEditTimestampRef = useRef<number>(Date.now());
  const initialLoadRef = useRef(true);

  // Create initial data snapshot string for dirty comparison
  const buildDataSnapshot = useCallback(
    () =>
      JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        authorName,
        authorAvatar,
        status,
        featured,
        categoryId,
        selectedTagIds,
        seoTitle,
        metaDescription,
        focusKeyword,
        canonicalUrl,
        ogImage,
      }),
    [
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorName,
      authorAvatar,
      status,
      featured,
      categoryId,
      selectedTagIds,
      seoTitle,
      metaDescription,
      focusKeyword,
      canonicalUrl,
      ogImage,
    ]
  );

  const lastSavedSnapshotRef = useRef<string>(buildDataSnapshot());

  // ── Load Taxonomies ────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch("/api/blog/categories").then((r) => r.json()),
          fetch("/api/blog/tags").then((r) => r.json()),
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (tagRes.success) setTags(tagRes.tags);
      } catch {
        toast.error("Failed to load taxonomies");
      }
    }
    loadTaxonomies();
  }, []);

  // Sync slug with title when title changes and slug is auto
  useEffect(() => {
    if (isSlugAuto && !isEdit) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugAuto, isEdit]);

  // ── Mark Form Dirty on User Edits ──────────────────────────────────────────
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    const currentSnapshot = buildDataSnapshot();
    if (currentSnapshot !== lastSavedSnapshotRef.current) {
      setSaveStatus("dirty");
      lastEditTimestampRef.current = Date.now();
    }
  }, [buildDataSnapshot]);

  // ── Unsaved Changes Navigation Guard ───────────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === "dirty") {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveStatus]);

  // ── Core Save Execution Engine ─────────────────────────────────────────────
  const executeSave = useCallback(
    async (targetStatus?: BlogStatus, isAutoSave = false) => {
      // 1. Prevent duplicate concurrent saves; queue if user keeps typing
      if (isSavingRef.current) {
        hasPendingChangesRef.current = true;
        return;
      }

      const finalStatus = targetStatus || status;
      const currentData = {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        authorName,
        authorAvatar,
        status: finalStatus,
        featured,
        categoryId: categoryId || null,
        tagIds: selectedTagIds,
        seoTitle: seoTitle || title,
        metaDescription: metaDescription || excerpt,
        focusKeyword,
        canonicalUrl,
        ogImage: ogImage || featuredImage,
      };

      const currentSnapshot = JSON.stringify(currentData);

      // If nothing changed and not explicitly publishing, skip save
      if (currentSnapshot === lastSavedSnapshotRef.current && !targetStatus) {
        setSaveStatus("saved");
        return;
      }

      // Form validation
      const validation = createBlogSchema.safeParse(currentData);
      if (!validation.success) {
        if (!isAutoSave) {
          const errorMsgs = validation.error.flatten().fieldErrors;
          const firstError = Object.values(errorMsgs)[0]?.[0];
          toast.error(firstError || "Form validation failed");
        }
        return;
      }

      // Set loading states
      isSavingRef.current = true;
      setSaveStatus("saving");

      if (targetStatus === "PUBLISHED") {
        setPublishButtonState("publishing");
      } else {
        setSaveButtonState("saving");
      }

      try {
        const activeId = currentPostId;
        const url = activeId ? `/api/blog/${activeId}` : "/api/blog";
        const method = activeId ? "PATCH" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentData),
        }).then((r) => r.json());

        if (res.success && res.blog) {
          const savedBlog = res.blog;

          // If newly created post, update currentPostId and browser URL without page reload/redirect
          if (!activeId && savedBlog.id) {
            setCurrentPostId(savedBlog.id);
            window.history.replaceState(null, "", `/admin/cms/blogs/${savedBlog.id}`);
          }

          if (targetStatus) {
            setStatus(targetStatus);
          }

          lastSavedSnapshotRef.current = currentSnapshot;
          setSaveStatus("saved");
          const now = new Date();
          setLastSavedTime(now);
          lastEditTimestampRef.current = now.getTime();

          if (targetStatus === "PUBLISHED") {
            setPublishButtonState("published");
            toast.success("Published Successfully ✓");
            setTimeout(() => setPublishButtonState("idle"), 2500);
          } else {
            setSaveButtonState("saved");
            if (!isAutoSave) toast.success("Saved Successfully ✓");
            setTimeout(() => setSaveButtonState("idle"), 2000);
          }
        } else {
          throw new Error(res.error || "Save failed");
        }
      } catch (err: any) {
        setSaveStatus("error");
        if (targetStatus === "PUBLISHED") {
          setPublishButtonState("error");
          setTimeout(() => setPublishButtonState("idle"), 3000);
        } else {
          setSaveButtonState("error");
          setTimeout(() => setSaveButtonState("idle"), 3000);
        }
        if (!isAutoSave) {
          toast.error(err?.message || "Save failed. Keep editing or retry.");
        }
      } finally {
        isSavingRef.current = false;

        // Execute queued save if user made edits while save was processing
        if (hasPendingChangesRef.current) {
          hasPendingChangesRef.current = false;
          setTimeout(() => executeSave(undefined, true), 1000);
        }
      }
    },
    [
      currentPostId,
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorName,
      authorAvatar,
      status,
      featured,
      categoryId,
      selectedTagIds,
      seoTitle,
      metaDescription,
      focusKeyword,
      canonicalUrl,
      ogImage,
    ]
  );

  // ── Auto Save Interval (Triggers after 60s of inactivity or dirty state) ──
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const timeSinceLastEdit = Date.now() - lastEditTimestampRef.current;
      if (
        saveStatus === "dirty" &&
        timeSinceLastEdit >= 60000 &&
        !isSavingRef.current
      ) {
        executeSave(undefined, true);
      }
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [saveStatus, executeSave]);

  // ── Image Upload Handler ──────────────────────────────────────────────────
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "featured" | "og"
  ) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", target === "featured" ? "covers" : "seo");

    setIsUploading(true);
    const loadingToast = toast.loading("Uploading asset...");
    try {
      const res = await fetch("/api/blog/media/upload", {
        method: "POST",
        body: formData,
      }).then((r) => r.json());

      if (res.success) {
        if (target === "featured") {
          setFeaturedImage(res.url);
          if (!ogImage) setOgImage(res.url);
        } else {
          setOgImage(res.url);
        }
        toast.success("Upload complete", { id: loadingToast });
      } else {
        toast.error(res.error || "Upload failed", { id: loadingToast });
      }
    } catch {
      toast.error("Upload failed", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagToggle = (id: string) => {
    if (selectedTagIds.includes(id)) {
      setSelectedTagIds(selectedTagIds.filter((t) => t !== id));
    } else {
      setSelectedTagIds([...selectedTagIds, id]);
    }
  };

  // ── Live Preview Prepared Data ──────────────────────────────────────────────
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) || null,
    [categories, categoryId]
  );

  const selectedTagsList = useMemo(
    () =>
      tags
        .filter((t) => selectedTagIds.includes(t.id))
        .map((t) => ({ id: t.id, name: t.name })),
    [tags, selectedTagIds]
  );

  const previewData = useMemo(
    () => ({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorName,
      authorAvatar,
      category: selectedCategory ? { name: selectedCategory.name, slug: selectedCategory.slug } : null,
      tags: selectedTagsList,
      status,
      seoTitle,
      metaDescription,
      ogImage,
    }),
    [
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorName,
      authorAvatar,
      selectedCategory,
      selectedTagsList,
      status,
      seoTitle,
      metaDescription,
      ogImage,
    ]
  );

  // Format last saved display string
  const lastSavedText = useMemo(() => {
    if (!lastSavedTime) return "";
    return `Last saved ${lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [lastSavedTime]);

  return (
    <div className="space-y-5 text-left w-full max-w-[1600px] mx-auto pb-12">
      {/* ── Top Action Header Bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/20 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms/blogs"
            className="p-2 border border-outline-variant/30 hover:bg-surface-container-low rounded-xl text-on-surface-variant transition-colors cursor-pointer"
            title="Back to Blog List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-base font-bold text-primary">
                {currentPostId ? "Edit Insight Post" : "Draft New Insight"}
              </h1>

              {/* ── Status Indicator Badge ─────────────────────────────── */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/20 select-none">
                {saveStatus === "saving" ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                  </span>
                ) : saveStatus === "saved" ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {lastSavedText || "Saved"}
                  </span>
                ) : saveStatus === "error" ? (
                  <button
                    type="button"
                    onClick={() => executeSave()}
                    className="text-rose-600 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-500" /> Save Failed (Retry)
                  </button>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Unsaved Changes
                  </span>
                )}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
              {currentPostId
                ? "Make modifications to live published content or edit draft parameters."
                : "Begin drafting an industry insight or technical guide."}
            </p>
          </div>
        </div>

        {/* Top Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Mode Switcher (< 1024px) */}
          <div className="flex lg:hidden items-center bg-surface-container p-1 rounded-xl border border-outline-variant/20">
            <button
              type="button"
              onClick={() => setMobileMode("editor")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileMode === "editor"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setMobileMode("preview")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileMode === "preview"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Live Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullScreenPreview(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-outline-variant/30 hover:bg-surface-container text-on-surface transition-all rounded-lg text-xs font-semibold cursor-pointer"
            title="Full Screen Preview Modal"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Full Screen</span>
          </button>

          {/* Manual Save Button */}
          <button
            type="button"
            onClick={() => executeSave()}
            disabled={saveButtonState === "saving"}
            className="min-w-[85px] px-4 py-2 border border-outline-variant/40 hover:bg-surface-container text-on-surface transition-all rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {saveButtonState === "saving" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Saving...</span>
              </>
            ) : saveButtonState === "saved" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-bold">Saved ✓</span>
              </>
            ) : saveButtonState === "error" ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 font-bold">Failed</span>
              </>
            ) : (
              <>
                <SaveIcon className="w-3.5 h-3.5 text-on-surface-variant/70" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Publish Live Button */}
          <button
            type="button"
            onClick={() => executeSave("PUBLISHED")}
            disabled={publishButtonState === "publishing"}
            className="min-w-[110px] px-4 py-2 bg-primary hover:bg-primary/95 text-white transition-all rounded-lg text-xs font-semibold shadow-premium cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {publishButtonState === "publishing" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : publishButtonState === "published" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Published ✓</span>
              </>
            ) : publishButtonState === "error" ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Failed</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Split View Container ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Editor Column (~45% / col-span-5) ──────────────────────── */}
        <div
          className={`lg:col-span-5 space-y-6 ${
            mobileMode === "editor" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Editor Sub-Tabs */}
          <div className="flex border-b border-outline-variant/10 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "content"
                  ? "border-secondary text-primary font-bold"
                  : "border-transparent text-on-surface-variant/75 hover:text-primary"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Content &amp; Meta
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "seo"
                  ? "border-secondary text-primary font-bold"
                  : "border-transparent text-on-surface-variant/75 hover:text-primary"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> SEO Tuning
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("author")}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "author"
                  ? "border-secondary text-primary font-bold"
                  : "border-transparent text-on-surface-variant/75 hover:text-primary"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> Author &amp; Options
              </span>
            </button>
          </div>

          {/* Tab 1: Content & Meta */}
          {activeTab === "content" && (
            <div className="space-y-5">
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Post Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the title of the article..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all font-medium"
                  required
                />
              </div>

              {/* Slug input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-primary">URL Slug</label>
                  <button
                    type="button"
                    onClick={() => setIsSlugAuto(!isSlugAuto)}
                    className="text-[10px] text-secondary font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {isSlugAuto ? "Manual Slug" : "Auto slug from Title"}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant/40 select-none font-mono">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    disabled={isSlugAuto}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-14 pr-4 py-2.5 text-xs font-mono text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all disabled:bg-surface-container-low/40 disabled:text-on-surface-variant/60"
                    required
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Short Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Provide a quick summary (excerpt) for search results and cards..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all min-h-[75px]"
                />
              </div>

              {/* Tiptap Content Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Article Content</label>
                <BlogEditor content={content} onChange={setContent} />
              </div>

              {/* Publishing & Category Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/20">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">Post Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BlogStatus)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="DRAFT">Draft Mode</option>
                    <option value="PUBLISHED">Published Live</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                <label className="text-xs font-semibold text-primary">Featured Cover Image</label>
                {featuredImage ? (
                  <div className="relative w-full aspect-video rounded-xl border border-outline-variant/30 overflow-hidden bg-slate-50 group">
                    <Image src={featuredImage} alt="Cover preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage("")}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-outline-variant/50 hover:border-secondary/40 transition-all cursor-pointer bg-surface-container-low/20">
                    <div className="flex flex-col items-center p-4 text-center">
                      <Upload className="w-5 h-5 text-on-surface-variant/45 mb-1.5" />
                      <span className="text-xs font-bold text-primary">Upload Cover</span>
                      <span className="text-[9px] text-on-surface-variant/50 mt-0.5">
                        JPEG, PNG, WebP · Max 5MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "featured")}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Tags Selector */}
              <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                <label className="text-xs font-semibold text-primary">Tags Selection</label>
                {tags.length === 0 ? (
                  <span className="text-[10px] italic text-on-surface-variant/50 block">
                    No tags created. Manage tags from the menu.
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                    {tags.map((t) => {
                      const isSelected = selectedTagIds.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleTagToggle(t.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-secondary text-white border-secondary shadow-xs"
                              : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
                          }`}
                        >
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: SEO Tuning */}
          {activeTab === "seo" && (
            <div className="space-y-5 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-bold text-xs text-primary pb-2 border-b border-outline-variant/20 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <Globe className="w-4 h-4 text-secondary" />
                SEO &amp; OpenGraph Settings
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">SEO Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || "Enter title..."}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant/50">
                  <span>Target: 50-60 chars</span>
                  <span>{seoTitle.length} chars</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Focus Keyword</label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g. Next.js, app engineering"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || "Enter description..."}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all min-h-[75px]"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant/50">
                  <span>Target: 120-160 chars</span>
                  <span>{metaDescription.length} chars</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Canonical URL</label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://hexakode.in/blog/slug"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Social (OG) Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="Upload custom OG image..."
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  />
                  <label className="px-3 py-2 bg-surface-container border border-outline-variant/30 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer hover:bg-surface-container-high transition-all shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "og")}
                      className="hidden"
                    />
                    <Upload className="w-3.5 h-3.5" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Author & Options */}
          {activeTab === "author" && (
            <div className="space-y-5 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-bold text-xs text-primary pb-2 border-b border-outline-variant/20 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <Settings className="w-4 h-4 text-secondary" />
                Publishing Profile &amp; Flags
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Author Display Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Author Avatar URL</label>
                <input
                  type="url"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-primary flex items-center gap-1">
                    <Star
                      className={`w-3.5 h-3.5 ${
                        featured ? "fill-amber-500 text-amber-500" : "text-on-surface-variant/40"
                      }`}
                    />
                    Featured Post Flag
                  </span>
                  <span className="text-[9px] text-on-surface-variant/60">
                    Highlight this article in the hero slot of the blog listing.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer w-4 h-4"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Right Live Preview Column (~55% / col-span-7) ──────────────── */}
        <div
          className={`lg:col-span-7 sticky top-4 h-[calc(100vh-2rem)] ${
            mobileMode === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <BlogLivePreview
            post={previewData}
            onOpenFullScreen={() => setIsFullScreenPreview(true)}
          />
        </div>
      </div>

      {/* ── Full Screen Preview Modal Overlay ───────────────────────────── */}
      {isFullScreenPreview && (
        <div className="fixed inset-0 z-[1300] bg-black/80 backdrop-blur-md p-3 sm:p-6 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full max-w-[1500px] h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Full Screen Production Preview
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFullScreenPreview(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close Full Screen Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden">
              <BlogLivePreview post={previewData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

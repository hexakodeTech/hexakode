"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio CMS — Form Section Components
// Each section is a self-contained UI component receiving formData + updateForm.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback } from "react";
import {
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Globe,
  GitFork,
  Search,
} from "lucide-react";
import { PortfolioFormData, PortfolioCategory, PortfolioFeature } from "../types";
import { TechChip } from "../components/TechChip";
import { generateId, slugify } from "../utils";

// ─── Shared label style ────────────────────────────────────────────────────────
const LABEL_CLS =
  "block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1.5";
const INPUT_CLS =
  "w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all placeholder:text-on-surface-variant/30";
const TEXTAREA_CLS = `${INPUT_CLS} resize-none`;
const SECTION_TITLE_CLS =
  "flex items-center gap-2 font-headline-sm text-xs font-semibold text-primary pb-3 mb-4 border-b border-outline-variant/20";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Basic Information Section
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES: PortfolioCategory[] = [
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

interface BasicInfoProps {
  formData: PortfolioFormData;
  updateForm: <K extends keyof PortfolioFormData>(key: K, value: PortfolioFormData[K]) => void;
  isEditing: boolean;
  onTitleChange: (title: string, isEditing: boolean) => void;
}

export function BasicInfoSection({
  formData,
  updateForm,
  isEditing,
  onTitleChange,
}: BasicInfoProps) {
  return (
    <div>
      <p className={SECTION_TITLE_CLS}>Basic Information</p>
      <div className="space-y-4">
        {/* Title + Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => onTitleChange(e.target.value, isEditing)}
              placeholder="e.g. Fintech Analytics Dashboard"
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>URL Slug *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => updateForm("slug", slugify(e.target.value))}
                placeholder="fintech-analytics-dashboard"
                className={`${INPUT_CLS} font-label-mono text-[10px]`}
              />
            </div>
            <p className="text-[9px] text-on-surface-variant/40 mt-1 font-body-sm">
              Auto-generated from title. Editable.
            </p>
          </div>
        </div>

        {/* Category + Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => updateForm("category", e.target.value as PortfolioCategory)}
              className={INPUT_CLS}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL_CLS}>Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => updateForm("clientName", e.target.value)}
              placeholder="e.g. Acme Corporation"
              className={INPUT_CLS}
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Live Project URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-on-surface-variant/40" />
              <input
                type="url"
                value={formData.projectUrl}
                onChange={(e) => updateForm("projectUrl", e.target.value)}
                placeholder="https://example.com"
                className={`${INPUT_CLS} pl-8`}
              />
            </div>
          </div>
          <div>
            <label className={LABEL_CLS}>GitHub Repository</label>
            <div className="relative">
              <GitFork className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-on-surface-variant/40" />
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => updateForm("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
                className={`${INPUT_CLS} pl-8`}
              />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className={LABEL_CLS}>Short Description *</label>
          <textarea
            required
            rows={2}
            value={formData.shortDescription}
            onChange={(e) => updateForm("shortDescription", e.target.value)}
            placeholder="One or two sentence project summary shown on cards and previews..."
            className={TEXTAREA_CLS}
          />
          <p className="text-[9px] text-on-surface-variant/40 mt-1">
            {formData.shortDescription.length}/200 chars recommended
          </p>
        </div>

        {/* Long Description */}
        <div>
          <label className={LABEL_CLS}>Full Description</label>
          <div className="relative">
            <textarea
              rows={5}
              value={formData.longDescription}
              onChange={(e) => updateForm("longDescription", e.target.value)}
              placeholder="Detailed project narrative — approach, challenges, solutions, outcomes..."
              className={TEXTAREA_CLS}
            />
            <div className="absolute bottom-2 right-2 bg-surface-container-low border border-outline-variant/20 text-[9px] text-on-surface-variant/40 px-1.5 py-0.5 rounded font-label-mono">
              Rich Text Editor — Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Cover Image Section
// ─────────────────────────────────────────────────────────────────────────────

interface CoverImageProps {
  formData: PortfolioFormData;
  updateForm: <K extends keyof PortfolioFormData>(key: K, value: PortfolioFormData[K]) => void;
}

export function CoverImageSection({ formData, updateForm }: CoverImageProps) {
  const [urlInput, setUrlInput] = useState(formData.coverImage);

  const applyUrl = () => {
    updateForm("coverImage", urlInput.trim());
  };

  const remove = () => {
    updateForm("coverImage", "");
    setUrlInput("");
  };

  return (
    <div>
      <p className={SECTION_TITLE_CLS}>Cover Image</p>

      {formData.coverImage ? (
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden border border-outline-variant/30 h-48 bg-surface-container-low">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formData.coverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-lg">
                Cover Image
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUrlInput(formData.coverImage);
                updateForm("coverImage", "");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface-variant"
            >
              <Upload className="w-3 h-3" />
              Replace Image
            </button>
            <button
              type="button"
              onClick={remove}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-error/30 text-error rounded-lg hover:bg-error-container/10 transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Drop zone */}
          <div className="border-2 border-dashed border-outline-variant/40 rounded-xl h-40 flex flex-col items-center justify-center gap-3 bg-surface-container-low/30 hover:border-secondary/30 hover:bg-surface-container-low/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-on-surface-variant/40" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-on-surface-variant/60">
                Drag & drop cover image here
              </p>
              <p className="text-[10px] text-on-surface-variant/40 mt-0.5">
                PNG, JPG, WebP — Recommended 1200×675px
              </p>
            </div>
            <span className="text-[10px] text-on-surface-variant/30 font-label-mono border border-outline-variant/20 px-2 py-0.5 rounded">
              Upload — Coming Soon
            </span>
          </div>

          {/* URL fallback */}
          <div>
            <label className={LABEL_CLS}>Or enter image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/cover.jpg"
                className={`${INPUT_CLS} flex-1`}
              />
              <button
                type="button"
                onClick={applyUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-2 bg-secondary text-on-secondary text-xs font-semibold rounded-lg hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Gallery Section
// ─────────────────────────────────────────────────────────────────────────────

interface GalleryProps {
  formData: PortfolioFormData;
  updateForm: <K extends keyof PortfolioFormData>(key: K, value: PortfolioFormData[K]) => void;
}

export function GallerySection({ formData, updateForm }: GalleryProps) {
  const [urlInput, setUrlInput] = useState("");

  const addImage = () => {
    if (!urlInput.trim()) return;
    const newImg = {
      id: generateId("img"),
      url: urlInput.trim(),
      alt: `Gallery image ${formData.gallery.length + 1}`,
      isCover: formData.gallery.length === 0,
    };
    updateForm("gallery", [...formData.gallery, newImg]);
    setUrlInput("");
  };

  const removeImage = (id: string) => {
    updateForm(
      "gallery",
      formData.gallery.filter((img) => img.id !== id)
    );
  };

  return (
    <div>
      <p className={SECTION_TITLE_CLS}>Gallery</p>

      {/* Gallery grid */}
      {formData.gallery.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {formData.gallery.map((img, idx) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden border border-outline-variant/20 h-24 bg-surface-container-low"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <div className="absolute top-1 left-1">
                  <span className="text-[8px] bg-secondary text-on-secondary px-1.5 py-0.5 rounded font-semibold">
                    Cover
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-outline-variant/30 rounded-xl h-24 flex items-center justify-center mb-4 bg-surface-container-low/20">
          <p className="text-[10px] text-on-surface-variant/40">No gallery images yet</p>
        </div>
      )}

      {/* Add image URL */}
      <div>
        <label className={LABEL_CLS}>Add image via URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            placeholder="https://example.com/gallery-image.jpg"
            className={`${INPUT_CLS} flex-1`}
          />
          <button
            type="button"
            onClick={addImage}
            disabled={!urlInput.trim()}
            className="px-3 py-2 bg-surface-container-low border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <p className="text-[9px] text-on-surface-variant/40 mt-1">
          First image is automatically set as cover. Drag-to-reorder — coming soon.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Technologies Section
// ─────────────────────────────────────────────────────────────────────────────

const TECH_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Supabase", "Prisma",
  "PostgreSQL", "Node.js", "TailwindCSS", "Framer Motion", "Firebase",
  "MongoDB", "Redis", "Docker", "AWS", "GraphQL", "REST API",
  "React Native", "Expo", "Vue.js", "Angular", "Stripe", "Vercel",
];

interface TechnologiesProps {
  formData: PortfolioFormData;
  updateForm: <K extends keyof PortfolioFormData>(key: K, value: PortfolioFormData[K]) => void;
}

export function TechnologiesSection({ formData, updateForm }: TechnologiesProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTech = useCallback(
    (tech: string) => {
      const cleaned = tech.trim();
      if (!cleaned || formData.technologies.includes(cleaned)) return;
      updateForm("technologies", [...formData.technologies, cleaned]);
      setInput("");
      setShowSuggestions(false);
    },
    [formData.technologies, updateForm]
  );

  const removeTech = useCallback(
    (tech: string) => {
      updateForm(
        "technologies",
        formData.technologies.filter((t) => t !== tech)
      );
    },
    [formData.technologies, updateForm]
  );

  const filteredSuggestions = TECH_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !formData.technologies.includes(s)
  );

  return (
    <div>
      <p className={SECTION_TITLE_CLS}>Technologies Used</p>

      {/* Current chips */}
      {formData.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {formData.technologies.map((tech) => (
            <TechChip key={tech} label={tech} onRemove={() => removeTech(tech)} />
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-on-surface-variant/40" />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech(input);
              }
            }}
            placeholder="Type or select a technology, press Enter to add..."
            className={`${INPUT_CLS} pl-8`}
          />
        </div>

        {/* Dropdown suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-premium overflow-hidden">
            <div className="max-h-36 overflow-y-auto">
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTech(s)}
                  className="w-full text-left px-3 py-2 text-xs text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick add suggestions row */}
      <div className="mt-3">
        <p className="text-[9px] text-on-surface-variant/40 mb-2 font-label-mono uppercase tracking-wider">
          Quick add
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TECH_SUGGESTIONS.slice(0, 10)
            .filter((s) => !formData.technologies.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTech(s)}
                className="inline-flex items-center gap-0.5 border border-outline-variant/30 text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full hover:border-secondary/30 hover:text-secondary hover:bg-secondary/5 transition-all cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                {s}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Features Section
// ─────────────────────────────────────────────────────────────────────────────

interface FeaturesProps {
  formData: PortfolioFormData;
  updateForm: <K extends keyof PortfolioFormData>(key: K, value: PortfolioFormData[K]) => void;
}

export function FeaturesSection({ formData, updateForm }: FeaturesProps) {
  const addFeature = () => {
    const newFeature: PortfolioFeature = {
      id: generateId("feat"),
      title: "",
      description: "",
    };
    updateForm("features", [...formData.features, newFeature]);
  };

  const updateFeature = (id: string, field: "title" | "description", value: string) => {
    updateForm(
      "features",
      formData.features.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const removeFeature = (id: string) => {
    updateForm(
      "features",
      formData.features.filter((f) => f.id !== id)
    );
  };

  return (
    <div>
      <p className={SECTION_TITLE_CLS}>Key Features</p>

      <div className="space-y-3 mb-4">
        {formData.features.map((feature, idx) => (
          <div
            key={feature.id}
            className="p-4 bg-surface-container-low/40 border border-outline-variant/20 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/50">
                Feature {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeFeature(feature.id)}
                className="p-1 text-on-surface-variant/50 hover:text-error hover:bg-error-container/10 rounded transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <input
              type="text"
              value={feature.title}
              onChange={(e) => updateFeature(feature.id, "title", e.target.value)}
              placeholder="Feature title..."
              className={INPUT_CLS}
            />
            <textarea
              rows={2}
              value={feature.description}
              onChange={(e) => updateFeature(feature.id, "description", e.target.value)}
              placeholder="Describe this feature in one or two sentences..."
              className={TEXTAREA_CLS}
            />
          </div>
        ))}

        {formData.features.length === 0 && (
          <div className="border-2 border-dashed border-outline-variant/25 rounded-lg h-20 flex items-center justify-center">
            <p className="text-[10px] text-on-surface-variant/40">No features added yet</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={addFeature}
        className="flex items-center gap-1.5 text-xs text-secondary border border-secondary/25 px-3 py-1.5 rounded-lg hover:bg-secondary/5 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Feature
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SEO Section
// ─────────────────────────────────────────────────────────────────────────────

interface SEOProps {
  formData: PortfolioFormData;
  updateFormNested: <Parent extends "seo" | "settings", K extends keyof PortfolioFormData[Parent]>(
    parent: Parent,
    key: K,
    value: PortfolioFormData[Parent][K]
  ) => void;
}

export function SEOSection({ formData, updateFormNested }: SEOProps) {
  return (
    <div>
      <p className={SECTION_TITLE_CLS}>SEO & Open Graph</p>
      <div className="space-y-4">
        <div>
          <label className={LABEL_CLS}>Meta Title</label>
          <input
            type="text"
            value={formData.seo.metaTitle}
            onChange={(e) => updateFormNested("seo", "metaTitle", e.target.value)}
            placeholder="Project Name — Client | HexaKode"
            className={INPUT_CLS}
          />
          <p className="text-[9px] text-on-surface-variant/40 mt-1">
            {formData.seo.metaTitle.length}/60 chars recommended
          </p>
        </div>

        <div>
          <label className={LABEL_CLS}>Meta Description</label>
          <textarea
            rows={2}
            value={formData.seo.metaDescription}
            onChange={(e) => updateFormNested("seo", "metaDescription", e.target.value)}
            placeholder="Brief description for search engines and social sharing..."
            className={TEXTAREA_CLS}
          />
          <p className="text-[9px] text-on-surface-variant/40 mt-1">
            {formData.seo.metaDescription.length}/160 chars recommended
          </p>
        </div>

        <div>
          <label className={LABEL_CLS}>OG Image URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={formData.seo.ogImage}
              onChange={(e) => updateFormNested("seo", "ogImage", e.target.value)}
              placeholder="https://example.com/og-image.jpg (1200×630)"
              className={`${INPUT_CLS} flex-1`}
            />
          </div>
          {formData.seo.ogImage && (
            <div className="mt-2 rounded-lg overflow-hidden border border-outline-variant/20 h-20 bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.seo.ogImage}
                alt="OG preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!formData.seo.ogImage && (
            <div className="mt-2 rounded-lg border-2 border-dashed border-outline-variant/20 h-20 flex items-center justify-center bg-surface-container-low/20">
              <p className="text-[10px] text-on-surface-variant/30">
                Recommended: 1200×630px
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Project Settings Section
// ─────────────────────────────────────────────────────────────────────────────

interface SettingsProps {
  formData: PortfolioFormData;
  updateFormNested: <Parent extends "seo" | "settings", K extends keyof PortfolioFormData[Parent]>(
    parent: Parent,
    key: K,
    value: PortfolioFormData[Parent][K]
  ) => void;
}

function ToggleSwitch({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none flex-shrink-0 ${
        checked ? "bg-secondary" : "bg-outline-variant/60"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out mt-0.5 ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function ProjectSettingsSection({ formData, updateFormNested }: SettingsProps) {
  const settings = [
    {
      id: "toggle-featured",
      key: "featured" as const,
      label: "Featured Project",
      description:
        "Displays a featured badge on the card and prioritizes this project in sorted views.",
    },
    {
      id: "toggle-homepage",
      key: "showOnHomepage" as const,
      label: "Show on Homepage",
      description: "Include this project in the homepage portfolio showcase section.",
    },
    {
      id: "toggle-preview",
      key: "allowPreview" as const,
      label: "Allow Preview",
      description: "Allow visitors to preview project details before the full case study is published.",
    },
  ];

  return (
    <div>
      <p className={SECTION_TITLE_CLS}>Project Settings</p>
      <div className="space-y-4">
        {settings.map(({ id, key, label, description }) => (
          <div key={key} className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-surface-container-low/30 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary">{label}</p>
              <p className="text-[10px] text-on-surface-variant/60 mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
            <ToggleSwitch
              id={id}
              checked={formData.settings[key]}
              onChange={(v) => updateFormNested("settings", key, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

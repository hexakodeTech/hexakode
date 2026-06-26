"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Info,
  Image,
  LayoutGrid,
  Code2,
  Zap,
  Search,
  Settings,
  Save,
  Globe,
  ChevronRight,
} from "lucide-react";
import { PortfolioFormData } from "../types";
import {
  BasicInfoSection,
  CoverImageSection,
  GallerySection,
  TechnologiesSection,
  FeaturesSection,
  SEOSection,
  ProjectSettingsSection,
} from "../forms/PortfolioFormSections";
import { StatusBadge } from "../components/StatusBadge";

// ─────────────────────────────────────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────────────────────────────────────

type TabId =
  | "basic"
  | "cover"
  | "gallery"
  | "technologies"
  | "features"
  | "seo"
  | "settings";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "Basic Info", icon: Info },
  { id: "cover", label: "Cover Image", icon: Image },
  { id: "gallery", label: "Gallery", icon: LayoutGrid },
  { id: "technologies", label: "Technologies", icon: Code2 },
  { id: "features", label: "Features", icon: Zap },
  { id: "seo", label: "SEO", icon: Search },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Modal
// ─────────────────────────────────────────────────────────────────────────────

interface PortfolioFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: PortfolioFormData;
  updateForm: <K extends keyof PortfolioFormData>(key: K, value: PortfolioFormData[K]) => void;
  updateFormNested: <
    Parent extends "seo" | "settings",
    K extends keyof PortfolioFormData[Parent]
  >(
    parent: Parent,
    key: K,
    value: PortfolioFormData[Parent][K]
  ) => void;
  handleTitleChange: (title: string, isEditing: boolean) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export function PortfolioFormModal({
  isOpen,
  isEditing,
  formData,
  updateForm,
  updateFormNested,
  handleTitleChange,
  onSaveDraft,
  onPublish,
  onCancel,
}: PortfolioFormModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("basic");

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoSection
            formData={formData}
            updateForm={updateForm}
            isEditing={isEditing}
            onTitleChange={handleTitleChange}
          />
        );
      case "cover":
        return <CoverImageSection formData={formData} updateForm={updateForm} />;
      case "gallery":
        return <GallerySection formData={formData} updateForm={updateForm} />;
      case "technologies":
        return <TechnologiesSection formData={formData} updateForm={updateForm} />;
      case "features":
        return <FeaturesSection formData={formData} updateForm={updateForm} />;
      case "seo":
        return (
          <SEOSection formData={formData} updateFormNested={updateFormNested} />
        );
      case "settings":
        return (
          <ProjectSettingsSection
            formData={formData}
            updateFormNested={updateFormNested}
          />
        );
    }
  };

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const canGoPrev = currentTabIndex > 0;
  const canGoNext = currentTabIndex < TABS.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-4xl max-h-[92vh] bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-premium flex flex-col overflow-hidden"
          >
            {/* ── Modal Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 flex-shrink-0 bg-surface-container-lowest">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-secondary" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-headline-sm text-sm font-semibold text-primary leading-tight truncate">
                    {isEditing ? "Edit Portfolio Project" : "Create New Portfolio Project"}
                  </h2>
                  {formData.title && (
                    <p className="text-[10px] text-on-surface-variant/50 truncate mt-0.5">
                      {formData.title}
                    </p>
                  )}
                </div>
                <StatusBadge status={formData.status} />
              </div>
              <button
                onClick={onCancel}
                className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Tab Navigation ─────────────────────────────────────────────── */}
            <div className="flex-shrink-0 border-b border-outline-variant/20 bg-surface-container-lowest overflow-x-auto">
              <div className="flex min-w-max">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-1.5 px-4 py-3 text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "text-secondary border-b-2 border-secondary"
                          : "text-on-surface-variant/60 hover:text-primary hover:bg-surface-container-low/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Tab Content ────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer Actions ─────────────────────────────────────────────── */}
            <div className="flex-shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant/20 bg-surface-container-lowest">
              {/* Tab nav prev/next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    canGoPrev && setActiveTab(TABS[currentTabIndex - 1].id)
                  }
                  disabled={!canGoPrev}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-on-surface-variant border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    canGoNext && setActiveTab(TABS[currentTabIndex + 1].id)
                  }
                  disabled={!canGoNext}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-on-surface-variant border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </button>
                <span className="font-label-mono text-[9px] text-on-surface-variant/40 ml-1">
                  {currentTabIndex + 1} / {TABS.length}
                </span>
              </div>

              {/* Main actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSaveDraft}
                  disabled={!formData.title.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant/40 bg-surface-container-low text-xs font-semibold rounded-lg hover:bg-surface-container transition-all cursor-pointer text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={onPublish}
                  disabled={!formData.title.trim() || !formData.shortDescription.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/15 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {isEditing && formData.status === "Published"
                    ? "Update & Publish"
                    : "Publish Project"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

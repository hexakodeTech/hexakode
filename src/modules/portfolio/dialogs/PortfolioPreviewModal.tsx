"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Star, Globe, ChevronRight } from "lucide-react";
import { PortfolioProject } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { FeaturedBadge } from "../components/FeaturedBadge";
import { formatDate } from "../utils";

interface PortfolioPreviewModalProps {
  isOpen: boolean;
  project: PortfolioProject | null;
  onClose: () => void;
}

export function PortfolioPreviewModal({
  isOpen,
  project,
  onClose,
}: PortfolioPreviewModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-3xl max-h-[90vh] bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-premium overflow-hidden flex flex-col"
          >
            {/* ── Hero Cover ──────────────────────────────────────────────────── */}
            <div className="relative h-56 w-full bg-slate-900 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Read-only label */}
              <div className="absolute top-4 left-4">
                <span className="font-label-mono text-[9px] bg-white/20 backdrop-blur-sm text-white border border-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Preview Mode
                </span>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-label-mono text-[9px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {project.category}
                  </span>
                  {project.settings.featured && <FeaturedBadge />}
                  <StatusBadge status={project.status} />
                </div>
                <h2 className="font-headline-md text-2xl font-bold text-white drop-shadow-md leading-tight">
                  {project.title}
                </h2>
                {project.clientName && (
                  <p className="text-sm text-white/70 mt-1">{project.clientName}</p>
                )}
              </div>
            </div>

            {/* ── Scrollable Content ──────────────────────────────────────────── */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Links row */}
              {project.projectUrl && (
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-secondary hover:text-secondary/80 border border-secondary/25 hover:border-secondary/50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    View Live Site
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Short description */}
              <div>
                <p className="text-sm text-on-surface-variant/80 font-body-sm leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {/* Gallery (if available) */}
              {project.gallery.length > 1 && (
                <div>
                  <h3 className="font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-3">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {project.gallery.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.id}
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-24 object-cover rounded-lg border border-outline-variant/20"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Long description */}
              {project.longDescription && (
                <div>
                  <h3 className="font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-3">
                    About This Project
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 font-body-sm leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>
              )}

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <div>
                  <h3 className="font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-3">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center bg-secondary/8 text-on-surface-variant border border-secondary/15 text-[11px] font-medium px-2.5 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {project.features.length > 0 && (
                <div>
                  <h3 className="font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-3">
                    Key Features
                  </h3>
                  <div className="space-y-3">
                    {project.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-3 p-3 bg-surface-container-low/40 border border-outline-variant/15 rounded-lg"
                      >
                        <div className="w-5 h-5 rounded-md bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ChevronRight className="w-3 h-3 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-primary">{feature.title}</p>
                          <p className="text-[11px] text-on-surface-variant/70 mt-0.5 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta row */}
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/50 mb-0.5">
                      Status
                    </p>
                    <StatusBadge status={project.status} size="md" />
                  </div>
                  {project.publishedAt && (
                    <div>
                      <p className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/50 mb-0.5">
                        Published
                      </p>
                      <p className="text-[11px] font-body-sm text-on-surface-variant/70">
                        {formatDate(project.publishedAt)}
                      </p>
                    </div>
                  )}
                  {project.settings.featured && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500" />
                      Featured Project
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

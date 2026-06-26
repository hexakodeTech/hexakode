"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { PortfolioProject } from "../types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  project: PortfolioProject | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  project,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error-container/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-sm font-semibold text-primary">
                    Delete Portfolio Project
                  </h3>
                  <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Project preview */}
            <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant/20 rounded-lg mb-5">
              {project.coverImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-12 h-10 object-cover rounded-md border border-outline-variant/20 flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary truncate">{project.title}</p>
                <p className="text-[10px] text-on-surface-variant/60 truncate">{project.category}</p>
              </div>
            </div>

            {/* Warning text */}
            <p className="text-xs text-on-surface-variant/70 font-body-sm leading-relaxed mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-primary">&ldquo;{project.title}&rdquo;</span>? All
              associated data including gallery images, features, and SEO settings will be removed.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:bg-error/90 hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Project
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

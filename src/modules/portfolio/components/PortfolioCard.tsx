"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Eye,
  Copy,
  Trash2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { PortfolioProject } from "../types";
import { StatusBadge } from "./StatusBadge";
import { TechChip } from "./TechChip";
import { FeaturedBadge } from "./FeaturedBadge";
import { formatDate, getTechChipDisplay } from "../utils";

interface PortfolioCardProps {
  project: PortfolioProject;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export function PortfolioCard({
  project,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  index = 0,
}: PortfolioCardProps) {
  const { visible: visibleTech, overflow } = getTechChipDisplay(
    project.technologies,
    4
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="group relative bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-card hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300"
    >
      {/* ── Cover Image ──────────────────────────────────────────────────────── */}
      <div className="relative h-44 w-full overflow-hidden bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="font-label-mono text-[9px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">
            {project.category}
          </span>
          {project.settings.featured && <FeaturedBadge />}
        </div>

        {/* Quick action overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onPreview(project.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-on-surface hover:bg-white hover:text-secondary transition-all shadow-lg cursor-pointer"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(project.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-on-surface hover:bg-white hover:text-secondary transition-all shadow-lg cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Card Body ────────────────────────────────────────────────────────── */}
      <div className="p-4 space-y-3">
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-headline-sm text-sm font-semibold text-primary leading-tight line-clamp-1">
              {project.title}
            </h3>
            {project.clientName && (
              <p className="text-[10px] text-on-surface-variant/60 mt-0.5 font-body-sm">
                {project.clientName}
              </p>
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Short Description */}
        <p className="text-[11px] text-on-surface-variant/70 font-body-sm leading-relaxed line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Tech chips */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleTech.map((tech) => (
              <TechChip key={tech} label={tech} />
            ))}
            {overflow > 0 && (
              <span className="inline-flex items-center text-[10px] text-on-surface-variant/50 px-1.5">
                +{overflow} more
              </span>
            )}
          </div>
        )}

        {/* Date + Project URL */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/50">
            <Calendar className="w-3 h-3" />
            <span className="font-label-mono">
              {project.status === "Published" && project.publishedAt
                ? formatDate(project.publishedAt)
                : `Draft · ${formatDate(project.createdAt)}`}
            </span>
          </div>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-secondary/70 hover:text-secondary flex items-center gap-0.5 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* ── Action Footer ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-1 px-4 pb-3 border-t border-outline-variant/10 pt-2.5">
        <button
          onClick={() => onEdit(project.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-all cursor-pointer"
          title="Edit project"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={() => onPreview(project.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-lg transition-all cursor-pointer"
          title="Preview project"
        >
          <Eye className="w-3 h-3" />
          Preview
        </button>
        <button
          onClick={() => onDuplicate(project.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-all cursor-pointer"
          title="Duplicate project"
        >
          <Copy className="w-3 h-3" />
          Duplicate
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium text-on-surface-variant hover:text-error hover:bg-error-container/10 rounded-lg transition-all cursor-pointer"
          title="Delete project"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}

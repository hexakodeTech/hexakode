"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioProject } from "../types";
import { PortfolioCard } from "./PortfolioCard";
import { EmptyState } from "./EmptyState";

interface PortfolioGridProps {
  projects: PortfolioProject[];
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateFirst: () => void;
}

export function PortfolioGrid({
  projects,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onCreateFirst,
}: PortfolioGridProps) {
  if (projects.length === 0) {
    return <EmptyState onCreateFirst={onCreateFirst} />;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key="grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {projects.map((project, index) => (
          <PortfolioCard
            key={project.id}
            project={project}
            index={index}
            onEdit={onEdit}
            onPreview={onPreview}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

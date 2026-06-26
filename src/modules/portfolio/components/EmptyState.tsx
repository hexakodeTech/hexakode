"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateFirst: () => void;
}

export function EmptyState({ onCreateFirst }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-outline-variant/20 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-outline-variant/30" />
        </div>
        {/* Icon container */}
        <div className="relative z-10 w-20 h-20 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex items-center justify-center shadow-card">
          <LayoutGrid className="w-9 h-9 text-on-surface-variant/40" />
        </div>
      </div>

      {/* Text */}
      <h3 className="font-headline-sm text-base font-semibold text-primary mb-2">
        No portfolio projects yet
      </h3>
      <p className="text-xs text-on-surface-variant/60 font-body-sm max-w-xs leading-relaxed mb-8">
        Start building your portfolio by adding your first project. Showcase your best work and attract
        new clients.
      </p>

      {/* CTA */}
      <motion.button
        onClick={onCreateFirst}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 bg-primary text-on-primary text-xs font-semibold px-5 py-2.5 rounded-lg shadow-premium hover:shadow-premium-hover transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Create First Portfolio
      </motion.button>
    </motion.div>
  );
}

"use client";

import React from "react";

interface TechChipProps {
  label: string;
  onRemove?: () => void;
}

export function TechChip({ label, onRemove }: TechChipProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-secondary/8 text-on-surface-variant border border-secondary/15 text-[10px] font-medium px-2 py-0.5 rounded-full">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-3 h-3 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:text-error hover:bg-error-container/20 transition-colors ml-0.5 cursor-pointer"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

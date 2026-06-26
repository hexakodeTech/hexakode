"use client";

import React from "react";
import { CheckCircle2, FileText } from "lucide-react";
import { PortfolioStatus } from "../types";

interface StatusBadgeProps {
  status: PortfolioStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const isPublished = status === "Published";

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
        size === "md" ? "text-[11px] px-2.5 py-1" : "text-[9px] px-2 py-0.5"
      } ${
        isPublished
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-surface-container text-on-surface-variant/70 border-outline-variant/30"
      }`}
    >
      {isPublished ? (
        <CheckCircle2 className={size === "md" ? "w-3 h-3" : "w-2.5 h-2.5"} />
      ) : (
        <FileText className={size === "md" ? "w-3 h-3" : "w-2.5 h-2.5"} />
      )}
      {status}
    </span>
  );
}

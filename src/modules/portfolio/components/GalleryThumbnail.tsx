"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryThumbnailProps {
  url: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
}

export default function GalleryThumbnail({
  url,
  alt,
  isActive,
  onClick,
}: GalleryThumbnailProps) {
  const isSupabase = url.includes("supabase.co") || url.includes("/storage/v1/object/");

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative h-14 w-20 flex-shrink-0 rounded-lg overflow-hidden border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-secondary",
        isActive
          ? "border-secondary scale-105 opacity-100 shadow-md ring-1 ring-secondary/30"
          : "border-outline-variant/30 opacity-50 hover:opacity-80 hover:scale-[1.02]"
      )}
      aria-label={`View ${alt}`}
    >
      <div className="absolute inset-0 bg-surface-container animate-pulse z-0" />
      <Image
        src={url}
        alt={alt}
        fill
        sizes="80px"
        unoptimized={isSupabase}
        className="object-cover z-10"
      />
    </button>
  );
}

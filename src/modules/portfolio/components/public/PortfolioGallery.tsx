"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import GalleryLightbox from "../GalleryLightbox";

interface GalleryImageItem {
  url: string;
  alt: string;
  order: number;
}

interface PortfolioGalleryProps {
  images: GalleryImageItem[];
}

export default function PortfolioGallery({ images }: PortfolioGalleryProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleImageError = (url: string) => {
    setFailedImages((prev) => ({ ...prev, [url]: true }));
  };

  const activeImages = images.filter((img) => !failedImages[img.url]);

  if (activeImages.length === 0) {
    return null;
  }

  const isSingle = activeImages.length === 1;

  return (
    <div className="flex flex-col gap-6 mt-12 pt-12 border-t border-outline-variant/10">
      <div>
        <h3 className="font-headline-md text-headline-sm text-on-background mb-2 uppercase tracking-wider border-l-2 border-secondary pl-4">
          Project Gallery
        </h3>
        <p className="font-body-sm text-xs text-on-surface-variant/70 pl-5">
          Visual documentation and platform highlights. Click any image to enlarge.
        </p>
      </div>

      <div
        className={cn(
          "grid gap-6 w-full mt-2 pl-5",
          isSingle
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {activeImages.map((img, idx) => {
          const isSupabase =
            img.url.includes("supabase.co") || img.url.includes("/storage/v1/object/");

          return (
            <button
              key={img.url}
              onClick={() => setLightboxIndex(idx)}
              className={cn(
                "group relative overflow-hidden bg-surface-container rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-premium-hover hover:border-secondary-container/30 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-secondary/50",
                isSingle ? "aspect-[16/9] w-full" : "aspect-[16/10] w-full"
              )}
            >
              {/* Background Skeleton Loader */}
              <div className="absolute inset-0 bg-surface-container animate-pulse z-0 rounded-xl" />

              <Image
                src={img.url}
                alt={img.alt}
                fill
                priority={isSingle}
                loading={isSingle ? undefined : "lazy"}
                unoptimized={isSupabase}
                sizes={
                  isSingle
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                }
                onError={() => handleImageError(img.url)}
                className="object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500 ease-out z-10"
              />
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={activeImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}


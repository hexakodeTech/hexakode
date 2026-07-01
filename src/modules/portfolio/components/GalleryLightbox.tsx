"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import GalleryViewer from "./GalleryViewer";
import GalleryNavigation from "./GalleryNavigation";
import GalleryThumbnail from "./GalleryThumbnail";

interface GalleryImageItem {
  url: string;
  alt: string;
  order: number;
}

interface GalleryLightboxProps {
  images: GalleryImageItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function GalleryLightbox({
  images,
  initialIndex,
  onClose,
}: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoomScale, setZoomScale] = useState(1);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    setZoomScale(1);
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setZoomScale(1);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Disable background scrolling when lightbox is active
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Keyboard navigation & trap focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    lightboxRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, onClose, handleNext, handlePrev]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const activeElement = container.children[activeIndex] as HTMLElement;
      if (activeElement) {
        const activeOffset = activeElement.offsetLeft;
        const activeWidth = activeElement.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPosition = activeOffset - containerWidth / 2 + activeWidth / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  const currentImage = images[activeIndex];

  if (!currentImage) return null;

  return (
    <div
      ref={lightboxRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between focus:outline-none select-none"
    >
      {/* Lightbox Navigation Controls */}
      <GalleryNavigation
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={onClose}
        currentIndex={activeIndex}
        totalCount={images.length}
        onZoomIn={() => setZoomScale((prev) => Math.min(prev + 0.5, 4))}
        onZoomOut={() => setZoomScale((prev) => Math.max(prev - 0.5, 1))}
        onResetZoom={() => setZoomScale(1)}
        zoomScale={zoomScale}
      />

      {/* Main Image Viewer Area */}
      <div className="flex-1 w-full flex items-center justify-center pt-20 pb-4">
        <GalleryViewer
          url={currentImage.url}
          alt={currentImage.alt}
          zoomScale={zoomScale}
          onZoomChange={setZoomScale}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>

      {/* Bottom Information Panel & Thumbnail List */}
      <div className="w-full bg-gradient-to-t from-black/90 via-black/75 to-transparent pt-6 pb-6 px-4 md:px-8 flex flex-col items-center gap-4 z-40">
        {/* Caption/Alt Text */}
        {currentImage.alt && (
          <p className="text-white/80 font-body-sm text-xs text-center max-w-2xl line-clamp-2 select-text">
            {currentImage.alt}
          </p>
        )}

        {/* Thumbnails list */}
        {images.length > 1 && (
          <div
            ref={thumbnailContainerRef}
            className="flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar py-1 scroll-smooth px-10"
          >
            {images.map((img, idx) => (
              <GalleryThumbnail
                key={img.url}
                url={img.url}
                alt={img.alt}
                isActive={idx === activeIndex}
                onClick={() => {
                  setZoomScale(1);
                  setActiveIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

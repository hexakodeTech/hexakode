"use client";

import React from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  currentIndex: number;
  totalCount: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  zoomScale?: number;
}

export default function GalleryNavigation({
  onPrev,
  onNext,
  onClose,
  currentIndex,
  totalCount,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoomScale = 1,
}: GalleryNavigationProps) {
  return (
    <>
      {/* Top Header Panel: Counter + Zoom Controls + Close */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
        {/* Counter */}
        <div className="text-white/90 font-label-mono text-xs tracking-widest bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10 select-none">
          {currentIndex + 1} <span className="text-white/40">/</span> {totalCount}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Buttons (If Zoom support functions are supplied) */}
          {onZoomIn && onZoomOut && onResetZoom && (
            <div className="hidden sm:flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10 text-white/80 mr-2">
              <button
                onClick={onZoomOut}
                disabled={zoomScale <= 0.5}
                className="p-1.5 hover:text-white disabled:opacity-30 disabled:hover:text-white/80 transition-colors focus:outline-none"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-label-mono px-2 select-none w-10 text-center text-white/90">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={onZoomIn}
                disabled={zoomScale >= 4}
                className="p-1.5 hover:text-white disabled:opacity-30 disabled:hover:text-white/80 transition-colors focus:outline-none"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomScale !== 1 && (
                <button
                  onClick={onResetZoom}
                  className="p-1.5 hover:text-white border-l border-white/10 pl-2 ml-1 transition-colors focus:outline-none"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:text-white text-white/80 rounded-full border border-white/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Close image viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/30 backdrop-blur-sm hover:bg-black/60 text-white/85 hover:text-white rounded-full border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 select-none group"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/30 backdrop-blur-sm hover:bg-black/60 text-white/85 hover:text-white rounded-full border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 select-none group"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </>
  );
}

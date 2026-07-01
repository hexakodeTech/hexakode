"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryViewerProps {
  url: string;
  alt: string;
  zoomScale: number;
  onZoomChange: (scale: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryViewer({
  url,
  alt,
  zoomScale,
  onZoomChange,
  onNext,
  onPrev,
}: GalleryViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Touch swipe support
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const isSupabase = url.includes("supabase.co") || url.includes("/storage/v1/object/");

  // Adapt state when url or zoomScale change during rendering
  const [prevUrl, setPrevUrl] = useState(url);
  if (url !== prevUrl) {
    setPrevUrl(url);
    setPosition({ x: 0, y: 0 });
    setIsLoading(true);
  }

  const [prevZoomScale, setPrevZoomScale] = useState(zoomScale);
  if (zoomScale !== prevZoomScale) {
    setPrevZoomScale(zoomScale);
    if (zoomScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }

  // Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    const nextScale = Math.min(Math.max(zoomScale * factor, 1), 4);
    onZoomChange(nextScale);
  };

  // Drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    // Boundary constraints based on container sizing
    const maxDragX = (zoomScale - 1) * 250;
    const maxDragY = (zoomScale - 1) * 150;
    setPosition({
      x: Math.min(Math.max(newX, -maxDragX), maxDragX),
      y: Math.min(Math.max(newY, -maxDragY), maxDragY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile: Swiping and Panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (zoomScale > 1) {
        setIsDragging(true);
        dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
      } else {
        touchStart.current = touch.clientX;
        touchEnd.current = null;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isDragging && zoomScale > 1) {
        const newX = touch.clientX - dragStart.current.x;
        const newY = touch.clientY - dragStart.current.y;
        setPosition({ x: newX, y: newY });
      } else if (zoomScale === 1 && touchStart.current !== null) {
        touchEnd.current = touch.clientX;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Swipe validation
    if (zoomScale === 1 && touchStart.current !== null && touchEnd.current !== null) {
      const swipeDistance = touchStart.current - touchEnd.current;
      const minSwipeDistance = 50;

      if (swipeDistance > minSwipeDistance) {
        onNext();
      } else if (swipeDistance < -minSwipeDistance) {
        onPrev();
      }
    }
    touchStart.current = null;
    touchEnd.current = null;
  };

  // Double tap to quick zoom in/out
  const lastTap = useRef(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (zoomScale > 1) {
        onZoomChange(1);
      } else {
        onZoomChange(2.5);
      }
    }
    lastTap.current = now;
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleDoubleTap}
      className={cn(
        "relative flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab select-none active:cursor-grabbing",
        isDragging && "active:cursor-grabbing"
      )}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/10">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      )}

      {/* Main Image View Container */}
      <div
        ref={imageRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoomScale})`,
          transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="relative max-w-[85vw] max-h-[70vh] aspect-[16/10] sm:aspect-auto w-full h-full max-h-image-limit"
      >
        <Image
          src={url}
          alt={alt}
          fill
          unoptimized={isSupabase}
          priority
          sizes="(max-width: 1024px) 100vw, 85vw"
          className={cn(
            "object-contain transition-opacity duration-300 pointer-events-none rounded-lg",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}

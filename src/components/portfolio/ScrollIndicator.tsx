"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      id="scroll-indicator"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/70 pointer-events-none transition-opacity duration-500 animate-float-down"
      style={{ opacity: isVisible ? 0.7 : 0 }}
    >
      <span className="font-label-mono text-[9px] uppercase tracking-widest">
        Scroll
      </span>
      <ChevronDown className="w-4 h-4" />
    </div>
  );
}

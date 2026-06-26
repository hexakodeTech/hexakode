"use client";

import React from "react";
import { Star } from "lucide-react";

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold px-2 py-0.5 rounded-full">
      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
      Featured
    </span>
  );
}

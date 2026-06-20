"use client";

import React from "react";
import { TrustMetric } from "../../types/about";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  metric: TrustMetric;
  className?: string;
}

export default function MetricCard({ metric, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-6 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-premium-hover hover:border-secondary/30",
        className
      )}
    >
      <span className="font-display-lg text-headline-lg text-secondary-container">{metric.value}</span>
      <p className="font-label-mono text-label-mono uppercase mt-2 tracking-widest text-on-primary-container">{metric.label}</p>
    </div>
  );
}

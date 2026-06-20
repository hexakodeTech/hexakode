import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
}

export default function StatsCard({ title, value, subtext, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-card hover:shadow-premium hover:border-outline-variant/60 transition-all duration-300 group">
      {/* Background Subtle Icon Accent */}
      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.02] text-primary group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        <Icon className="w-32 h-32" />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider">
          {title}
        </span>
        <div className="rounded-lg bg-surface-container p-2 text-secondary group-hover:bg-secondary-container/20 group-hover:text-secondary transition-colors duration-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-headline-md text-2xl font-bold tracking-tight text-primary leading-none">
          {value}
        </span>
        {trend && (
          <span
            className={`font-label-mono text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
              trend.type === "positive"
                ? "bg-secondary-container/30 text-on-secondary-container"
                : trend.type === "negative"
                ? "bg-error-container/30 text-on-error-container"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-on-surface-variant/60 font-body-sm">{subtext}</p>
    </div>
  );
}

import React from "react";
import { cn } from "../../lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "left",
  theme = "light",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-12 md:mb-16 max-w-3xl",
        align === "center" ? "mx-auto text-center items-center" : "text-left",
        className
      )}
      {...props}
    >
      {badge && (
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4",
            theme === "light"
              ? "bg-sky-50 text-sky-600 border border-sky-100/80"
              : "bg-white/5 text-sky-400 border border-white/10"
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight mb-4",
          theme === "light" ? "text-navy-dark" : "text-white"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-base md:text-lg leading-relaxed font-normal max-w-2xl",
            theme === "light" ? "text-slate-500" : "text-slate-400"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

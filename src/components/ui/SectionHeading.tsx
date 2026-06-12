import React from "react";
import { cn } from "../../lib/utils";
import Badge from "./Badge";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  underline?: boolean;
  titleSize?: "md" | "lg";
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "left",
  theme = "light",
  underline = false,
  titleSize = "md",
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
            "font-label-mono text-label-mono mb-4 tracking-widest uppercase",
            theme === "light" ? "text-secondary" : "text-secondary-container"
          )}
        >
          {badge}
        </span>
      )}

      <h2
        className={cn(
          "mb-4 font-bold tracking-tight",
          titleSize === "lg"
            ? "text-3xl sm:text-4xl md:text-5xl font-headline-lg"
            : "text-2xl sm:text-3xl font-headline-md",
          theme === "light" ? "text-on-background" : "text-white"
        )}
      >
        {title}
      </h2>

      {underline && (
        <div
          className={cn(
            "h-1 w-20 mt-1 mb-4",
            theme === "light" ? "bg-secondary" : "bg-secondary-container"
          )}
        />
      )}

      {subtitle && (
        <p
          className={cn(
            "font-body-lg text-body-lg max-w-2xl mt-4",
            theme === "light" ? "text-on-surface-variant" : "text-on-primary-container"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

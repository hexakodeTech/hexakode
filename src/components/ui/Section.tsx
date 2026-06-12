import React from "react";
import { cn } from "../../lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "white" | "muted" | "navy" | "surface-container-low" | "surface-container-highest";
  spacing?: "none" | "small" | "medium" | "large" | "cta";
}

export default function Section({
  children,
  className,
  variant = "white",
  spacing = "large",
  ...props
}: SectionProps) {
  const bgClasses = {
    white: "bg-white text-on-background",
    muted: "bg-surface-container-low text-on-background border-y border-outline-variant/30",
    navy: "bg-primary-container text-white",
    "surface-container-low": "bg-surface-container-low text-on-background",
    "surface-container-highest": "bg-surface-container-highest text-on-background border-y border-outline-variant/30",
  };

  const spacingClasses = {
    none: "",
    small: "py-12 md:py-16",
    medium: "py-16 md:py-24",
    large: "py-24 md:py-32",
    cta: "py-24",
  };

  return (
    <section
      className={cn(
        bgClasses[variant],
        spacingClasses[spacing],
        "relative overflow-hidden w-full",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

import React from "react";
import { cn } from "../../lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "white" | "muted" | "navy";
  spacing?: "none" | "small" | "medium" | "large";
}

export default function Section({
  children,
  className,
  variant = "white",
  spacing = "large",
  ...props
}: SectionProps) {
  const bgClasses = {
    white: "bg-white text-navy-dark",
    muted: "bg-slate-50/50 text-navy-dark border-y border-slate-100/60",
    navy: "bg-navy-deep text-white",
  };

  const spacingClasses = {
    none: "",
    small: "py-12 md:py-16",
    medium: "py-16 md:py-24",
    large: "py-24 md:py-32",
  };

  return (
    <section
      className={cn(bgClasses[variant], spacingClasses[spacing], "relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </section>
  );
}

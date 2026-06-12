import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "mono-tag" | "capabilities" | "outline";
}

export default function Badge({
  children,
  className,
  variant = "mono-tag",
  ...props
}: BadgeProps) {
  const baseClasses = "inline-block font-label-mono text-label-mono select-none transition-all duration-300";

  const variantClasses = {
    primary: "bg-primary text-on-primary px-3 py-1 rounded",
    secondary: "bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full",
    "mono-tag": "bg-surface-container px-3 py-1 rounded text-[10px] uppercase font-medium text-on-surface-variant tracking-wider",
    capabilities: "bg-secondary-container/20 text-on-secondary-container px-4 py-1 rounded-full uppercase tracking-wider mb-6",
    outline: "border border-outline/30 text-on-surface-variant px-3 py-1 rounded",
  };

  return (
    <span
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}

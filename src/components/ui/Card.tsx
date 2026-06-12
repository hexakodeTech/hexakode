import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "light" | "dark" | "glass" | "gradient";
  hoverEffect?: boolean;
}

export default function Card({
  children,
  className,
  variant = "light",
  hoverEffect = true,
  ...props
}: CardProps) {
  const baseClasses = "rounded-xl border transition-all duration-300 relative overflow-hidden";

  const variantClasses = {
    light: "bg-white border-outline-variant/30 text-on-background shadow-sm",
    dark: "bg-primary-container border-outline-variant/10 text-white shadow-sm",
    glass: "glass-card text-on-background shadow-sm",
    gradient: "animate-gradient-shift text-white border-outline-variant/10",
  };

  const hoverClasses = hoverEffect
    ? variant === "gradient"
      ? "hover:shadow-2xl hover:-translate-y-1"
      : "hover:shadow-2xl hover:-translate-y-1 hover:border-secondary/40"
    : "";

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

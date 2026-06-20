import React from "react";
import { cn } from "../../lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "full";
}

export default function Container({
  children,
  className,
  size = "large",
  ...props
}: ContainerProps) {
  const sizeClasses = {
    small: "max-w-3xl",
    medium: "max-w-5xl",
    large: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-8 w-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

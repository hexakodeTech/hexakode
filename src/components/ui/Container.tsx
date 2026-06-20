import React from "react";
import { cn } from "../../lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  clean?: boolean; // If true, does not apply max-w and margins
}

export default function Container({
  children,
  className,
  clean = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        clean
          ? ""
          : "max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

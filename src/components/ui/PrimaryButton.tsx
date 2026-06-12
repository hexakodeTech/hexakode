"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

const MotionLink = motion(Link);

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "white";
  shimmer?: boolean;
  magnetic?: boolean;
  size?: "md" | "lg";
}

export default function PrimaryButton({
  children,
  href,
  variant = "primary",
  shimmer = true,
  magnetic = true,
  size = "md",
  className,
  ...props
}: PrimaryButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  // Framer Motion spring-loaded tracking for magnetic target pulls
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(clientX - centerX, clientY - centerY);

    if (distance < 100) {
      x.set((clientX - centerX) * 0.2);
      y.set((clientY - centerY) * 0.2);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = cn(
    "inline-flex items-center justify-center font-label-mono text-label-mono rounded transition-all duration-300 scale-100 active:scale-95 cursor-pointer select-none",
    shimmer ? "btn-shimmer" : "",
    size === "md" ? "px-6 py-3" : "px-8 py-4 rounded-lg"
  );

  const variantClasses = {
    primary: "bg-primary text-on-primary hover:shadow-lg",
    secondary: "bg-secondary text-on-secondary hover:shadow-lg",
    white: "bg-white text-primary border border-outline-variant/30 hover:bg-surface-container",
  };

  const motionProps = {
    ref: ref as any,
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: cn(baseClasses, variantClasses[variant], className),
  };

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("#");
    if (isExternal) {
      return (
        <motion.a href={href} {...motionProps}>
          {children}
        </motion.a>
      );
    }
    return (
      <MotionLink href={href} {...(motionProps as any)}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button {...motionProps} {...(props as any)}>
      {children}
    </motion.button>
  );
}

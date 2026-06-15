"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

const MotionLink = motion.create(Link);

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  magnetic?: boolean;
  size?: "md" | "lg";
}

type CleanButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onTransitionEnd" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop"
>;

export default function SecondaryButton({
  children,
  href,
  magnetic = false,
  size = "md",
  className,
  ...props
}: SecondaryButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

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
    "inline-flex items-center justify-center font-label-mono text-label-mono border border-outline/80 rounded hover:bg-surface-container transition-all duration-300 scale-100 active:scale-95 cursor-pointer select-none",
    size === "md" ? "px-6 py-3" : "px-8 py-4 rounded-lg"
  );

  const motionProps = {
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: cn(baseClasses, className),
  };

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("#");
    if (isExternal) {
      return (
        <motion.a 
          href={href} 
          ref={ref as React.Ref<HTMLAnchorElement>} 
          {...motionProps}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <MotionLink 
        href={href} 
        ref={ref as React.Ref<HTMLAnchorElement>} 
        {...motionProps}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button 
      ref={ref as React.Ref<HTMLButtonElement>} 
      {...motionProps} 
      {...(props as CleanButtonProps)}
    >
      {children}
    </motion.button>
  );
}

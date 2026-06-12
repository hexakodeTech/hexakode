"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Container from "../ui/Container";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import Badge from "../ui/Badge";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function ServicesHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring configurations for smooth physical mouse glow tracking
  const glowX = useMotionValue(-1000);
  const glowY = useMotionValue(-1000);
  const glowOpacity = useMotionValue(0);

  const springGlowX = useSpring(glowX, { damping: 30, stiffness: 200 });
  const springGlowY = useSpring(glowY, { damping: 30, stiffness: 200 });
  const springGlowOpacity = useSpring(glowOpacity, { damping: 20, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        glowOpacity.set(1);
        glowX.set(e.clientX);
        glowY.set(e.clientY + window.scrollY);
      } else {
        glowOpacity.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [glowOpacity, glowX, glowY]);

  return (
    <header
      ref={containerRef}
      id="hero"
      className="relative pt-40 pb-24 overflow-hidden bg-background w-full min-h-[600px] flex items-center"
    >
      {/* Tracking Glow Spot Element */}
      <motion.div
        className="hero-glow pointer-events-none"
        style={{
          left: springGlowX,
          top: springGlowY,
          opacity: springGlowOpacity,
        }}
      />

      {/* Animated SVG background illustration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-1/2 h-[500px] lg:h-[600px] z-0 pointer-events-none select-none opacity-20 lg:opacity-100 flex items-center justify-center lg:justify-end lg:pr-12">
        <svg
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[450px] h-[450px] lg:w-[550px] lg:h-[550px]"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
            </linearGradient>
            <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(93, 202, 253, 0.28)" />
              <stop offset="100%" stopColor="rgba(0, 102, 136, 0.05)" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(93, 202, 253, 0.08)" />
              <stop offset="100%" stopColor="rgba(93, 202, 253, 0)" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="rgba(93, 202, 253, 0.1)" />
            </linearGradient>
            <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" />
            </filter>
          </defs>

          {/* Glowing background blobs */}
          <circle cx="350" cy="300" r="180" fill="url(#glowGrad)" filter="url(#blurFilter)" />
          <circle cx="200" cy="250" r="100" fill="rgba(93, 202, 253, 0.05)" filter="url(#blurFilter)" />

          {/* Network Connections (API/Cloud lines) */}
          <g stroke="url(#lineGrad)" strokeWidth="1.5">
            <motion.line
              x1="120" y1="420" x2="280" y2="280"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.line
              x1="280" y1="280" x2="420" y2="180"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
            />
            <motion.line
              x1="280" y1="280" x2="450" y2="380"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
          </g>

          {/* Connecting Nodes (Glow circles) */}
          <motion.circle
            cx="280" cy="280" r="6" fill="#006688" stroke="#ffffff" strokeWidth="2"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="420" cy="180" r="4" fill="#5dcafd" stroke="#ffffff" strokeWidth="1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.circle
            cx="450" cy="380" r="5" fill="#5dcafd" stroke="#ffffff" strokeWidth="1.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />

          {/* Floating 3D Base Ellipses */}
          <motion.ellipse
            cx="320"
            cy="470"
            rx="160"
            ry="45"
            fill="none"
            stroke="rgba(0, 102, 136, 0.12)"
            strokeWidth="2"
            animate={{ y: [0, -5, 0], scaleX: [1, 0.98, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="320"
            cy="470"
            rx="120"
            ry="34"
            fill="rgba(0, 102, 136, 0.02)"
            stroke="rgba(93, 202, 253, 0.15)"
            strokeWidth="1.5"
            animate={{ y: [0, -5, 0], scaleX: [1, 0.98, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Floating Card 1 (Main structure) */}
          <motion.g
            animate={{
              y: [0, -15, 0],
              rotate: [0, 1, 0]
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Glass Blur Background card */}
            <rect
              x="180"
              y="120"
              width="240"
              height="280"
              rx="24"
              fill="url(#cardGrad1)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            />
            {/* Interior lines inside the main card */}
            <rect x="210" y="160" width="60" height="8" rx="4" fill="rgba(93, 202, 253, 0.25)" />
            <rect x="210" y="180" width="180" height="4" rx="2" fill="rgba(0, 0, 0, 0.04)" />
            <rect x="210" y="192" width="140" height="4" rx="2" fill="rgba(0, 0, 0, 0.04)" />
            <rect x="210" y="204" width="160" height="4" rx="2" fill="rgba(0, 0, 0, 0.04)" />
            
            {/* Dashboard Panel inside main card */}
            <rect x="210" y="230" width="180" height="130" rx="12" fill="rgba(255, 255, 255, 0.25)" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="1" />
            <circle cx="245" cy="270" r="16" fill="rgba(93, 202, 253, 0.1)" stroke="var(--color-secondary)" strokeWidth="1" />
            
            <motion.path
              d="M 237,270 L 242,264 L 246,275 L 253,267"
              stroke="var(--color-secondary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
            />
            
            <rect x="275" y="260" width="95" height="5" rx="2.5" fill="rgba(0, 0, 0, 0.04)" />
            <rect x="275" y="272" width="65" height="5" rx="2.5" fill="rgba(0, 0, 0, 0.04)" />
            
            {/* Visual metric progress bar */}
            <rect x="230" y="310" width="140" height="6" rx="3" fill="rgba(0, 0, 0, 0.04)" />
            <motion.rect
              x="230"
              y="310"
              width="100"
              height="6"
              rx="3"
              fill="var(--color-secondary)"
              animate={{ width: [30, 120, 30] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>

          {/* Floating Card 2 (Overlaying Glass panel) */}
          <motion.g
            animate={{
              y: [0, -25, 0],
              x: [0, 6, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <rect
              x="300"
              y="220"
              width="180"
              height="180"
              rx="16"
              fill="url(#cardGrad2)"
              stroke="rgba(93, 202, 253, 0.35)"
              strokeWidth="1"
              style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            />
            {/* Spinning high-tech indicators */}
            <circle cx="390" cy="310" r="35" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="4" />
            <motion.circle
              cx="390"
              cy="310"
              r="35"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeDasharray="60 160"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <rect x="330" y="250" width="40" height="5" rx="2.5" fill="rgba(255, 255, 255, 0.25)" />
          </motion.g>

          {/* Floating Sphere */}
          <motion.circle
            cx="140"
            cy="200"
            r="28"
            fill="url(#cardGrad2)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            animate={{
              y: [0, -30, 0],
              x: [0, -8, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Small Floating Nodes */}
          <motion.circle
            cx="480" cy="120" r="8" fill="rgba(93, 202, 253, 0.2)"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.circle
            cx="110" cy="320" r="12" fill="rgba(0, 102, 136, 0.03)" stroke="rgba(93, 202, 253, 0.1)" strokeWidth="1"
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

        </svg>
      </div>

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl flex flex-col items-start"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <Badge variant="capabilities">Our Capabilities</Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-headline-xl font-headline-xl mb-8 text-on-background"
          >
            Expertise That Powers Innovation
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            variants={fadeUp}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12 leading-relaxed"
          >
            HexaKode delivers high-performance engineering solutions designed for scale. 
            From cloud-native architectures to intuitive user experiences, we build the 
            technical foundations for global industry leaders.
          </motion.p>

          {/* Call to action buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 items-center">
            <PrimaryButton
              href="#services-grid"
              size="lg"
              className="gap-2 group"
            >
              Explore Services{" "}
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
            </PrimaryButton>
            <SecondaryButton
              href="#technologies"
              size="lg"
            >
              Technical Stack
            </SecondaryButton>
          </motion.div>
        </motion.div>
      </Container>
    </header>
  );
}

"use client";

import React, { useRef, useEffect } from "react";
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
      className="relative pt-40 pb-24 overflow-hidden bg-[#f8f9fa] w-full min-h-[600px] flex items-center"
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

      {/* Premium background mesh & grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Mesh Glows */}
        <div className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(93,202,253,0.18)_0%,rgba(93,202,253,0)_70%)] filter blur-[60px]" />
        <div className="absolute top-[20%] -left-10 w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(0,102,136,0.06)_0%,rgba(0,102,136,0)_70%)] filter blur-[55px]" />
        <div className="absolute -bottom-1/3 right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(186,200,220,0.18)_0%,rgba(186,200,220,0)_75%)] filter blur-[70px]" />
        
        {/* Premium Geometric Thin Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--color-outline) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-outline) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Animated SVG background illustration representing mockup */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-1/2 h-[500px] lg:h-[600px] z-0 pointer-events-none select-none opacity-20 lg:opacity-100 flex items-center justify-center lg:justify-end lg:pr-12">
        <svg
          viewBox="0 0 700 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[450px] h-[450px] lg:w-[600px] lg:h-[600px]"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="laptopScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
            </linearGradient>
            <linearGradient id="laptopBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(225, 232, 242, 0.85)" />
              <stop offset="100%" stopColor="rgba(175, 185, 202, 0.55)" />
            </linearGradient>
            <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(15, 23, 42, 0.85)" />
              <stop offset="100%" stopColor="rgba(30, 41, 59, 0.7)" />
            </linearGradient>
            <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
            </linearGradient>
            <linearGradient id="pillGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(93, 202, 253, 0.35)" />
              <stop offset="100%" stopColor="rgba(0, 102, 136, 0.1)" />
            </linearGradient>
            <linearGradient id="pillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(93, 202, 253, 0.4)" />
              <stop offset="100%" stopColor="rgba(93, 202, 253, 0.05)" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.15)" />
            </linearGradient>
            <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(93, 202, 253, 0.12)" />
              <stop offset="100%" stopColor="rgba(93, 202, 253, 0)" />
            </linearGradient>
            <linearGradient id="blueAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5dcafd" />
              <stop offset="100%" stopColor="#006688" />
            </linearGradient>
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="rgba(15, 23, 42, 0.08)" />
            </filter>
            <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>

          {/* Glowing background blobs */}
          <circle cx="350" cy="300" r="220" fill="url(#accentGlow)" filter="url(#blurFilter)" />
          <circle cx="200" cy="220" r="130" fill="rgba(93, 202, 253, 0.06)" filter="url(#blurFilter)" />

          {/* Network Connections / Orbits */}
          <g fill="none" strokeWidth="1">
            <motion.ellipse
              cx="380"
              cy="320"
              rx="280"
              ry="110"
              stroke="rgba(0, 102, 136, 0.08)"
              strokeDasharray="6 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              style={{ originX: "380px", originY: "320px" }}
            />
            <motion.ellipse
              cx="380"
              cy="320"
              rx="190"
              ry="75"
              stroke="rgba(93, 202, 253, 0.12)"
              strokeDasharray="4 4"
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              style={{ originX: "380px", originY: "320px" }}
            />
          </g>

          {/* Tilted Tablet Glass Screen (Background Element) */}
          <motion.g
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <rect
              x="440"
              y="110"
              width="160"
              height="110"
              rx="12"
              fill="url(#tabletGrad)"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="1.2"
              style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            />
            {/* Concentric Progress Meter inside tablet */}
            <circle cx="490" cy="165" r="24" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="3" fill="none" />
            <motion.circle
              cx="490"
              cy="165"
              r="24"
              stroke="url(#blueAccent)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="150"
              animate={{ strokeDashoffset: [150, 40] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <rect x="530" y="140" width="50" height="4" rx="2" fill="rgba(255, 255, 255, 0.25)" />
            <rect x="530" y="150" width="40" height="4" rx="2" fill="rgba(255, 255, 255, 0.15)" />
            <rect x="530" y="175" width="50" height="8" rx="4" fill="rgba(93, 202, 253, 0.2)" />
          </motion.g>

          {/* Laptop Screen & Keyboard Base (Center element) */}
          <motion.g
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Keyboard Base in perspective */}
            <polygon
              points="210,360 510,360 540,390 180,390"
              fill="url(#laptopBaseGrad)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
            />
            <polygon
              points="330,380 390,380 392,386 328,386"
              fill="rgba(255, 255, 255, 0.3)"
            />
            {/* Laptop Base Key rows representation */}
            <line x1="230" y1="368" x2="490" y2="368" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
            <line x1="225" y1="373" x2="495" y2="373" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />

            {/* Laptop Lid Screen */}
            <polygon
              points="230,195 490,195 510,360 210,360"
              fill="rgba(15, 23, 42, 0.8)"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="1.5"
              style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            />
            <polygon
              points="236,201 484,201 502,354 218,354"
              fill="url(#laptopScreenGrad)"
            />

            {/* Laptop Screen Content - Window details */}
            <circle cx="246" cy="211" r="2.5" fill="#ef4444" />
            <circle cx="253" cy="211" r="2.5" fill="#f59e0b" />
            <circle cx="260" cy="211" r="2.5" fill="#10b981" />

            {/* Mock Editor Code Lines */}
            <rect x="245" y="222" width="70" height="5" rx="2" fill="rgba(93, 202, 253, 0.45)" />
            <rect x="245" y="234" width="110" height="4" rx="2" fill="rgba(255, 255, 255, 0.35)" />
            <rect x="255" y="244" width="80" height="4" rx="2" fill="rgba(255, 255, 255, 0.2)" />
            <rect x="255" y="254" width="95" height="4" rx="2" fill="rgba(93, 202, 253, 0.25)" />
            <rect x="245" y="264" width="50" height="4" rx="2" fill="rgba(255, 255, 255, 0.35)" />

            {/* Mock Dashboard Widget (Right side of Laptop screen) */}
            <rect
              x="365"
              y="222"
              width="120"
              height="115"
              rx="8"
              fill="rgba(255, 255, 255, 0.12)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.8"
            />
            <line x1="375" y1="310" x2="475" y2="310" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            <line x1="375" y1="280" x2="475" y2="280" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            <line x1="375" y1="250" x2="475" y2="250" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            
            {/* Animated Graph Path inside laptop display */}
            <motion.path
              d="M 375,300 C 395,290 405,240 425,260 S 445,230 475,270"
              stroke="url(#blueAccent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="475"
              cy="270"
              r="3"
              fill="#ffffff"
              stroke="#5dcafd"
              strokeWidth="1"
              animate={{ scale: [1, 1.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>

          {/* Smartphone (Foreground left, overlapping laptop) */}
          <motion.g
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            {/* Phone Body Shell */}
            <rect
              x="155"
              y="240"
              width="95"
              height="165"
              rx="16"
              fill="url(#phoneGrad)"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1.5"
              style={{ filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))" }}
            />
            {/* Phone Screen display */}
            <rect x="159" y="244" width="87" height="157" rx="12" fill="rgba(10, 18, 30, 0.85)" />
            {/* Island notch */}
            <rect x="188" y="250" width="29" height="5" rx="2.5" fill="rgba(255, 255, 255, 0.3)" />

            {/* Smartphone UI details */}
            <circle cx="178" cy="272" r="8" fill="rgba(255, 255, 255, 0.25)" />
            <rect x="192" y="269" width="40" height="3" rx="1.5" fill="rgba(255, 255, 255, 0.35)" />
            <rect x="192" y="275" width="25" height="3" rx="1.5" fill="rgba(255, 255, 255, 0.2)" />

            {/* Mock widget item card */}
            <rect
              x="167"
              y="292"
              width="71"
              height="26"
              rx="6"
              fill="rgba(255, 255, 255, 0.08)"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="0.5"
            />
            <rect x="175" y="300" width="40" height="3" rx="1" fill="rgba(255, 255, 255, 0.3)" />
            <rect x="175" y="307" width="25" height="3" rx="1" fill="rgba(255, 255, 255, 0.15)" />
            <circle cx="225" cy="305" r="5" fill="url(#blueAccent)" />

            {/* Mock bar chart card widget */}
            <rect
              x="167"
              y="324"
              width="71"
              height="66"
              rx="6"
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="0.5"
            />
            {/* Animated vertical graph bars */}
            <motion.rect
              x="176"
              y="360"
              width="6"
              height="20"
              rx="1.2"
              fill="rgba(93, 202, 253, 0.4)"
              animate={{ height: [10, 24, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.rect
              x="187"
              y="352"
              width="6"
              height="28"
              rx="1.2"
              fill="rgba(93, 202, 253, 0.7)"
              animate={{ height: [15, 30, 15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.rect
              x="198"
              y="358"
              width="6"
              height="22"
              rx="1.2"
              fill="rgba(93, 202, 253, 0.4)"
              animate={{ height: [8, 20, 8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
            <motion.rect
              x="209"
              y="344"
              width="6"
              height="36"
              rx="1.2"
              fill="url(#blueAccent)"
              animate={{ height: [20, 38, 20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            />
            <motion.rect
              x="220"
              y="355"
              width="6"
              height="25"
              rx="1.2"
              fill="rgba(255, 255, 255, 0.2)"
              animate={{ height: [12, 28, 12] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            />
          </motion.g>

          {/* Floating Glass Pills/Capsules (Mockup shapes) */}
          {/* Pill 1 (Top Left) */}
          <motion.g
            animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect
              x="120"
              y="80"
              width="100"
              height="28"
              rx="14"
              fill="url(#pillGrad1)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            />
            <circle cx="134" cy="94" r="5" fill="#5dcafd" />
          </motion.g>

          {/* Pill 2 (Right/Foreground) */}
          <motion.g
            animate={{ y: [0, -22, 0], x: [0, 8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <rect
              x="530"
              y="270"
              width="110"
              height="32"
              rx="16"
              fill="url(#pillGrad2)"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1"
              style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            />
            <rect x="552" y="284" width="40" height="4" rx="2" fill="rgba(255, 255, 255, 0.3)" />
            <circle cx="610" cy="286" r="4" fill="#5dcafd" />
          </motion.g>

          {/* Large Floating Sphere (Top Right) */}
          <motion.circle
            cx="490"
            cy="80"
            r="32"
            fill="url(#glassGrad)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1.2"
            style={{ backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)" }}
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Additional Floating Nodes */}
          <motion.circle
            cx="110"
            cy="360"
            r="16"
            fill="url(#tabletGrad)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
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

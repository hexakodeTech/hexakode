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

      {/* Absolute background graphics */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none select-none">
        <Image
          alt="Hero Background Illustration"
          src="https://lh3.googleusercontent.com/aida/AP1WRLuPBpHI5blWM3nYdIUFQVaWirZr8lXM7aqGzOFXwplGPwzH_v4Rm3AcvHcEjGlfvc_VMT-Ta_l1ZbCnidQ0M9cBdMWaBeL8Co_Jd4QAkToPDyIZnUKRjxFb8IHqGqrShK4z5mfi5ISFZQrpBsyQmHwd2CdOECuy8op0_aSe2VYTiBVTkOA0IqaPNsKjSNsTF2HMktYycFzFTL6_GMvzPPgbJfzm0fGRBQVO76UB07sbDjIUc6WOlly50x3_"
          fill
          priority
          className="object-cover"
        />
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

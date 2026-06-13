"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import Container from "../ui/Container";
import ContactForm from "./ContactForm";
import ContactSidebar from "./ContactSidebar";

export default function ContactGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mouse parallax setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Weighted smoothing configuration to create a premium organic tracking lag
  const springConfig = { damping: 60, stiffness: 80, mass: 1.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Layered parallax values representing depth levels: Orb 1 (100%), Orb 2 (70%), Orb 3 (50%), Orb 4 (30%)
  const orb1ParallaxX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const orb1ParallaxY = useTransform(smoothY, [-1, 1], [-15, 15]);

  const orb2ParallaxX = useTransform(smoothX, [-1, 1], [-10.5, 10.5]);
  const orb2ParallaxY = useTransform(smoothY, [-1, 1], [-10.5, 10.5]);

  const orb3ParallaxX = useTransform(smoothX, [-1, 1], [-7.5, 7.5]);
  const orb3ParallaxY = useTransform(smoothY, [-1, 1], [-7.5, 7.5]);

  const orb4ParallaxX = useTransform(smoothX, [-1, 1], [-4.5, 4.5]);
  const orb4ParallaxY = useTransform(smoothY, [-1, 1], [-4.5, 4.5]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = (clientX / width) * 2 - 1;
      const y = (clientY / height) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Track the scroll position relative to the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center", "end start"],
  });

  // Toggle the dark class when the section is mostly within the viewport
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Prevent turning dark on initial page render / top of page
    if (typeof window !== "undefined" && window.scrollY < 100) {
      setIsDark(false);
      return;
    }

    if (latest > 0.15 && latest < 0.85) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  });

  return (
    <section
      ref={sectionRef}
      className={cn(
        "transition-colors duration-1000 relative overflow-hidden w-full pb-20 pt-16",
        isDark ? "bg-[#020617] text-white dark" : "bg-white text-on-background"
      )}
    >
      {/* Animated Ambient Backdrop System (No grid lines, strictly ambient moving light) */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 overflow-hidden",
          isDark && mounted ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Orb 1: Top Left */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "-15%",
            left: "-10%",
            width: "500px",
            height: "500px",
            x: orb1ParallaxX,
            y: orb1ParallaxY,
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: "#5dcafd",
              filter: "blur(180px)",
              willChange: "transform, opacity",
              transformStyle: "preserve-3d",
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 0.18,
            }}
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.08, 0.95, 1],
              opacity: [0.18, 0.22, 0.15, 0.18],
            }}
            transition={{
              type: "tween",
              duration: 20,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Orb 2: Center Right */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "25%",
            right: "-10%",
            width: "450px",
            height: "450px",
            x: orb2ParallaxX,
            y: orb2ParallaxY,
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: "#006688",
              filter: "blur(220px)",
              willChange: "transform, opacity",
              transformStyle: "preserve-3d",
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 0.12,
            }}
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 20, -25, 0],
              scale: [1, 0.95, 1.1, 1],
              opacity: [0.12, 0.16, 0.10, 0.12],
            }}
            transition={{
              type: "tween",
              duration: 26,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Orb 3: Bottom Left */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: "-10%",
            left: "-5%",
            width: "350px",
            height: "350px",
            x: orb3ParallaxX,
            y: orb3ParallaxY,
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: "#38bdf8",
              filter: "blur(160px)",
              willChange: "transform, opacity",
              transformStyle: "preserve-3d",
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 0.10,
            }}
            animate={{
              x: [0, 25, -15, 0],
              y: [0, -20, 15, 0],
              scale: [1, 1.05, 0.92, 1],
              opacity: [0.10, 0.13, 0.08, 0.10],
            }}
            transition={{
              type: "tween",
              duration: 22,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Orb 4: Center */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "40%",
            left: "40%",
            width: "300px",
            height: "300px",
            x: orb4ParallaxX,
            y: orb4ParallaxY,
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: "#0ea5e9",
              filter: "blur(140px)",
              willChange: "transform, opacity",
              transformStyle: "preserve-3d",
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 0.08,
            }}
            animate={{
              x: [0, -20, 20, 0],
              y: [0, 15, -15, 0],
              scale: [1, 1.03, 0.97, 1],
              opacity: [0.08, 0.11, 0.06, 0.08],
            }}
            transition={{
              type: "tween",
              duration: 30,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      <Container className="relative">
        {/* Glow behind the form container */}
        <div
          className={cn(
            "absolute pointer-events-none z-0 transition-opacity duration-1000",
            isDark ? "opacity-100" : "opacity-0"
          )}
          style={{
            top: "50%",
            left: "35%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(93,202,253,0.12), transparent 70%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          <ContactForm isDark={isDark} />
          <ContactSidebar isDark={isDark} />
        </div>
      </Container>
    </section>
  );
}

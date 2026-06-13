"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "../../lib/utils";
import Container from "../ui/Container";
import ContactForm from "./ContactForm";
import ContactSidebar from "./ContactSidebar";

export default function ContactGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

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
      {/* Animated Ambient Backdrop System */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 overflow-hidden",
          isDark ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Low-opacity grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.07]" />

        {/* Orb 1: Top Left */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "-10%",
            left: "-5%",
            width: "400px",
            height: "400px",
            backgroundColor: "#5dcafd",
            opacity: 0.15,
            filter: "blur(140px)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, 30, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 2: Bottom Right */}
        <motion.div
          className="absolute rounded-full"
          style={{
            bottom: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            backgroundColor: "#006688",
            opacity: 0.12,
            filter: "blur(180px)",
          }}
          animate={{
            x: [0, -60, 30, 0],
            y: [0, -40, -60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 3: Center */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "30%",
            left: "35%",
            width: "350px",
            height: "350px",
            backgroundColor: "#0ea5e9",
            opacity: 0.08,
            filter: "blur(160px)",
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          <ContactForm isDark={isDark} />
          <ContactSidebar isDark={isDark} />
        </div>
      </Container>
    </section>
  );
}

"use client";

import React, { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "../../lib/utils";
import Container from "../ui/Container";
import ContactForm from "./ContactForm";
import ContactSidebar from "./ContactSidebar";
import BouncingCircles from "./BouncingCircles";

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
        isDark ? "bg-[#090b0f] text-white dark" : "bg-white text-on-background"
      )}
    >
      {/* Moving background circles bouncing off container walls */}
      <BouncingCircles isDark={isDark} />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          <ContactForm isDark={isDark} />
          <ContactSidebar isDark={isDark} />
        </div>
      </Container>
    </section>
  );
}

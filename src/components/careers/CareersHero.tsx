"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  Variants,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  animate,
  useInView,
  MotionValue,
  MotionStyle,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

// Count-up helper component for stats cards
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      Promise.resolve().then(() => {
        setCount(value);
      });
      return;
    }

    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => {
        setCount(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [value, isInView, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function CareersHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // MotionValues for mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor interpolation
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });

  // Map mouse movement to layer translations
  const glassX = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const glassY = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const sphereX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const sphereY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  const gridX = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const gridY = useTransform(springY, [-0.5, 0.5], [-5, 5]);

  // Track responsive screen size
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; left: number; size: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    Promise.resolve().then(() => {
      handleResize();
    });
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate particle systems properties client-side to prevent hydration mismatch
  useEffect(() => {
    const count = isMobile ? 12 : 30;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() < 0.8 ? Math.random() * 2 + 1 : Math.random() * 3 + 2,
      delay: Math.random() * 6,
      duration: Math.random() * 8 + 10, // 10s to 18s for slow engineering aesthetic
    }));
    Promise.resolve().then(() => {
      setParticles(newParticles);
    });
  }, [isMobile]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || prefersReducedMotion) return;
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  // Reset values when mouse leaves container
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Return style only if parallax should run
  const parallaxStyle = (x: MotionValue<number>, y: MotionValue<number>): MotionStyle => {
    if (isMobile || prefersReducedMotion) return {};
    return { x, y };
  };

  // Entrance animations for hero elements
  const fadeInUp = (delay: number): Variants => ({
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  });

  const statsContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.12,
      },
    },
  };

  const statCardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const stats = [
    { value: 20, suffix: "+", label: "Projects Delivered" },
    { value: 1, suffix: "", label: "Countries" },
    { value: 100, suffix: "+", label: "Features Released" },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-primary-container"
    >
      {/* Base Hero background image */}
      <Image
        src="/careers-hero-bg.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover object-center opacity-40 select-none pointer-events-none"
        sizes="100vw"
      />

      {/* Left-to-right gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/85 to-primary-container/20 pointer-events-none z-[1]"
      />

      {/* -------------------- BACKGROUND ANIMATION LAYERS -------------------- */}

      {/* Layer 4: Light Rays (Atmospheric Depth) */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          x: [-30, 30, -30],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-1/4 left-0 w-[40%] h-[150%] pointer-events-none z-[1] bg-gradient-to-b from-transparent via-[#5dcafd]/[0.015] to-transparent transform -rotate-[35deg] origin-top-left filter blur-2xl"
      />

      <motion.div
        animate={prefersReducedMotion ? {} : {
          x: [25, -25, 25],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-1/3 right-[15%] w-[30%] h-[160%] pointer-events-none z-[1] bg-gradient-to-b from-transparent via-[#006688]/[0.025] to-transparent transform -rotate-[35deg] origin-top-left filter blur-3xl"
      />

      {/* Layer 2: Floating Spheres */}
      {/* Sphere 1 (Accent Glow - Top/Center) */}
      <motion.div
        style={parallaxStyle(sphereX, sphereY)}
        className="absolute top-[12%] left-[35%] w-[150px] h-[150px] pointer-events-none z-[1]"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : {
            y: [-25, 25, -25],
            x: [-15, 15, -15],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full bg-gradient-to-br from-secondary/15 to-secondary-container/25 rounded-full filter blur-xl"
        />
      </motion.div>

      {/* Sphere 2 (Navy Base - Bottom/Right) */}
      <motion.div
        style={parallaxStyle(sphereX, sphereY)}
        className="absolute bottom-[25%] right-[25%] w-[250px] h-[250px] pointer-events-none z-[1]"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : {
            y: [30, -30, 30],
            x: [10, -10, 10],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full bg-gradient-to-tr from-[#0f1c2c]/40 to-[#006688]/15 rounded-full filter blur-3xl"
        />
      </motion.div>

      {/* Sphere 3 (Accent Light Blue - Middle Left) - Hidden on Mobile */}
      {!isMobile && (
        <motion.div
          style={parallaxStyle(sphereX, sphereY)}
          className="absolute top-[45%] left-[18%] w-[90px] h-[90px] pointer-events-none z-[1]"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [-12, 18, -12],
              x: [15, -15, 15],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-secondary-container/15 rounded-full filter blur-lg"
          />
        </motion.div>
      )}

      {/* Sphere 4 (Navy Blue - Bottom Left) - Hidden on Mobile */}
      {!isMobile && (
        <motion.div
          style={parallaxStyle(sphereX, sphereY)}
          className="absolute bottom-[10%] left-[8%] w-[160px] h-[160px] pointer-events-none z-[1]"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [20, -20, 20],
              x: [-20, 20, -20],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-gradient-to-tr from-[#0f1c2c]/30 to-[#006688]/10 rounded-full filter blur-2xl"
          />
        </motion.div>
      )}

      {/* Layer 3: Hexagonal Wireframe Grid */}
      <motion.div
        style={parallaxStyle(gridX, gridY)}
        className="absolute right-[5%] top-[25%] md:top-[20%] w-[320px] h-[320px] md:w-[480px] md:h-[480px] pointer-events-none z-[2]"
        animate={prefersReducedMotion ? { opacity: 0.08 } : {
          scale: [0.98, 1.02, 0.98],
          rotate: [-2, 2, -2],
          opacity: [0.06, 0.12, 0.06]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full select-none">
          {/* Outer hexagon */}
          <path d="M200 20 L356 110 V290 L200 380 L44 290 V110 Z" stroke="#5dcafd" strokeWidth="1" strokeOpacity="0.8" />
          {/* Middle hexagon */}
          <path d="M200 70 L313 135 V265 L200 330 L87 265 V135 Z" stroke="#5dcafd" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.5" />
          {/* Inner hexagon */}
          <path d="M200 120 L270 160 V240 L200 280 L130 240 V160 Z" stroke="#5dcafd" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Center core */}
          <polygon points="200,170 226,185 226,215 200,230 174,215 174,185" fill="rgba(93,202,253,0.06)" stroke="#5dcafd" strokeWidth="1" strokeOpacity="0.9" />

          {/* Axis lines */}
          <line x1="200" y1="20" x2="200" y2="380" stroke="#5dcafd" strokeWidth="0.75" strokeDasharray="8 8" strokeOpacity="0.3" />
          <line x1="44" y1="110" x2="356" y2="290" stroke="#5dcafd" strokeWidth="0.75" strokeDasharray="8 8" strokeOpacity="0.3" />
          <line x1="44" y1="290" x2="356" y2="110" stroke="#5dcafd" strokeWidth="0.75" strokeDasharray="8 8" strokeOpacity="0.3" />

          {/* Outer circles */}
          <circle cx="200" cy="200" r="180" stroke="#5dcafd" strokeWidth="0.75" strokeOpacity="0.2" />
          <circle cx="200" cy="200" r="115" stroke="#5dcafd" strokeWidth="0.75" strokeDasharray="2 6" strokeOpacity="0.25" />
        </svg>
      </motion.div>

      {/* Layer 1: Floating Glass Panels */}
      {/* Glass Panel 1 (Top Left) */}
      <motion.div
        style={parallaxStyle(glassX, glassY)}
        className="absolute top-[22%] left-[8%] w-[120px] h-[180px] pointer-events-none z-[3]"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : {
            y: [-15, 15, -15],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full bg-white/[0.02] backdrop-blur-[3px] border border-white/[0.08] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-white/0 before:via-white/[0.02] before:to-white/[0.06]"
        />
      </motion.div>

      {/* Glass Panel 2 (Center Right) - Hidden on Mobile */}
      {!isMobile && (
        <motion.div
          style={parallaxStyle(glassX, glassY)}
          className="absolute top-[35%] right-[12%] w-[160px] h-[240px] pointer-events-none z-[3]"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [20, -20, 20],
              rotate: [3, -3, 3]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-white/[0.015] backdrop-blur-[4px] border border-white/[0.06] rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.25)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-tr before:from-white/0 before:via-white/[0.01] before:to-white/[0.05]"
          />
        </motion.div>
      )}

      {/* Glass Panel 3 (Bottom Left) - Hidden on Mobile */}
      {!isMobile && (
        <motion.div
          style={parallaxStyle(glassX, glassY)}
          className="absolute bottom-[20%] left-[22%] w-[140px] h-[140px] pointer-events-none z-[3]"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [-10, 25, -10],
              rotate: [-1, 3, -1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-white/[0.02] backdrop-blur-[2px] border border-white/[0.08] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_6px_24px_rgba(0,0,0,0.18)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-white/0 before:via-white/[0.02] before:to-white/[0.06]"
          />
        </motion.div>
      )}

      {/* Layer 5: Particle System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
        {!prefersReducedMotion && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bottom-0 rounded-full"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: p.size > 2 ? "0 0 6px rgba(93,202,253,0.4)" : "none",
              backgroundColor: p.size > 3 ? "rgba(93,202,253,0.6)" : "rgba(0,102,136,0.4)",
            }}
            animate={{
              y: [0, -850],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* -------------------- DECORATIVE STATIC ELEMENTS -------------------- */}

      {/* Subtle blueprint grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(93,202,253,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,253,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full z-[4]"
        style={{ background: "radial-gradient(circle, rgba(0,102,136,0.15) 0%, transparent 70%)" }}
      />

      {/* -------------------- CONTENT AREA -------------------- */}
      <div className="relative z-10 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.span
            variants={fadeInUp(0)}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 font-label-mono text-label-mono uppercase tracking-[0.2em] text-secondary mb-6 block"
          >
            <span className="h-px w-8 bg-secondary inline-block" aria-hidden="true" />
            Careers at HexaKode
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp(0.15)}
            initial="hidden"
            animate="visible"
            className="font-headline-lg text-headline-lg md:text-display-lg text-white mb-6 tracking-tight leading-tight"
          >
            Build the Future
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #5dcafd 0%, #006688 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              of Code.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp(0.3)}
            initial="hidden"
            animate="visible"
            className="font-body-lg text-body-lg text-on-primary-container/70 mb-10 max-w-lg leading-relaxed"
          >
            Join an engineering team where precision meets innovation. We&apos;re
            looking for architects, builders, and visionaries who want to create
            world-class digital products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp(0.45)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4"
          >
            <Link
              href="#open-roles"
              className="group inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-body-md font-semibold hover:bg-on-secondary-fixed-variant transition-all duration-300 shadow-lg hover:shadow-secondary/25 hover:shadow-xl"
            >
              View Open Roles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="#culture"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-body-md font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Our Culture
            </Link>
          </motion.div>
        </div>

        {/* Floating stat chips */}
        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-12 right-margin-desktop hidden xl:flex gap-4 z-10"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={statCardVariants}
              whileHover={prefersReducedMotion ? {} : { y: -6 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 text-center cursor-default hover:bg-white/[0.12] hover:border-white/25 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300"
            >
              <p className="font-headline-sm text-headline-sm text-white font-bold leading-none mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-label-mono text-label-mono text-on-primary-container/60 uppercase tracking-wider text-[11px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.2, duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 z-10"
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

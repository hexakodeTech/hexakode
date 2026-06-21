"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  }),
};

export default function CareersHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-primary-container">
      {/* Hero background image */}
      <Image
        src="/careers-hero-bg.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover object-center opacity-40"
        sizes="100vw"
      />

      {/* Left-to-right gradient overlay so text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/85 to-primary-container/20"
      />

      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(93,202,253,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,253,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,102,136,0.18) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 font-label-mono text-label-mono uppercase tracking-[0.2em] text-secondary mb-6 block"
          >
            <span className="h-px w-8 bg-secondary inline-block" aria-hidden="true" />
            Careers at HexaKode
          </motion.span>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
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
            custom={2}
            variants={fadeUp}
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
            custom={3}
            variants={fadeUp}
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
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="absolute bottom-12 right-margin-desktop hidden xl:flex gap-4"
        >
          {[
            { label: "Team Members", value: "20+" },
            { label: "Countries", value: "5+" },
            { label: "Projects Delivered", value: "100+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 text-center"
            >
              <p className="font-headline-sm text-headline-sm text-white font-bold leading-none mb-1">
                {stat.value}
              </p>
              <p className="font-label-mono text-label-mono text-on-primary-container/60 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.2, duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

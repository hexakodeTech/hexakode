"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { PolicyMeta } from "@/types/legal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

interface PrivacyHeroProps {
  meta: PolicyMeta;
}

export default function PrivacyHero({ meta }: PrivacyHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary-container py-28 px-margin-mobile md:px-margin-desktop">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-secondary/5 blur-[80px]" />
      </div>

      {/* Decorative grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(93,202,253,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,253,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-container-max mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-1.5 font-label-mono text-label-mono text-secondary uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              Legal
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="font-headline-lg text-headline-lg md:text-display-lg text-white mb-6 tracking-tight leading-tight"
          >
            {meta.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="font-body-lg text-body-lg text-on-primary-container/70 max-w-xl leading-relaxed mb-10"
          >
            At {meta.company}, we value your privacy and are committed to protecting
            your personal information. This policy explains how we collect, use, store,
            and safeguard information when you visit our website.
          </motion.p>

          {/* Divider with last-updated */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 pt-6 border-t border-on-primary-container/10"
          >
            <span className="font-label-mono text-label-mono text-on-primary-container/40 uppercase tracking-wider text-xs">
              Last Updated
            </span>
            <span className="font-body-sm text-body-sm text-on-primary-container/60">
              {meta.lastUpdated}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

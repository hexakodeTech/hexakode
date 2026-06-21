"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  HeartPulse, BookOpen, Monitor, BarChart3,
  type LucideProps,
} from "lucide-react";
import { benefits } from "@/data/careers";

const iconMap: Record<string, React.FC<LucideProps>> = {
  HeartPulse, BookOpen, Monitor, BarChart3,
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

export default function BenefitsSection() {
  return (
    <section className="py-28 px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left — benefits grid */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest mb-4 block">
                Benefits
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Perks of being a<br />
                <span className="text-secondary">HexaKoder</span>
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10"
            >
              {benefits.map((benefit) => {
                const Icon = iconMap[benefit.icon] ?? HeartPulse;
                return (
                  <motion.div key={benefit.id} variants={item} className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-secondary" aria-hidden="true" />
                    </div>
                    <h5 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                      {benefit.title}
                    </h5>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main image container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
              {/* Placeholder gradient — replace with actual team image */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(145deg, #0f1c2c 0%, #006688 60%, #5dcafd 100%)",
                }}
              />
              {/* Overlay pattern */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              {/* Glass card overlay */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 p-5">
                <p className="font-label-mono text-label-mono text-white/60 uppercase tracking-widest mb-1 text-[10px]">
                  Team Culture
                </p>
                <p className="font-headline-sm text-headline-sm text-white font-semibold leading-tight text-lg">
                  Brilliant people.<br />
                  <span className="text-secondary-container">Ambitious goals.</span>
                </p>
              </div>
            </div>

            {/* Decorative blobs */}
            <div
              aria-hidden="true"
              className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #006688, transparent)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 blur-2xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #5dcafd, transparent)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

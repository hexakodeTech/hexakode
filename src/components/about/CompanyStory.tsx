"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Rocket, Eye, MapPin, Laptop, Terminal } from "lucide-react";
import Section from "../ui/Section";
import Container from "../ui/Container";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function CompanyStory() {
  return (
    <Section variant="white" spacing="large">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Engineering / Code Craft Visual (Replacing any physical office imagery) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0d131f] text-slate-200 p-6 md:p-8 font-mono text-sm relative">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs text-slate-400 font-sans ml-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-secondary" />
                    hexakode-origin.ts
                  </span>
                </div>
                <span className="text-xs text-slate-500">v1.0.0</span>
              </div>

              {/* Code Snippet representing authentic origin */}
              <div className="space-y-1.5 text-xs md:text-sm leading-relaxed overflow-x-auto pb-2">
                <p className="text-slate-500">
                  <span className="text-secondary-container">{"// HexaKode Origin & Operating Model"}</span>
                </p>
                <p>
                  <span className="text-indigo-400">export const</span>{" "}
                  <span className="text-amber-300">company</span> = &#123;
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">founded:</span>{" "}
                  <span className="text-emerald-300">&quot;May 2026&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">origin:</span>{" "}
                  <span className="text-emerald-300">&quot;Started by two friends&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">location:</span>{" "}
                  <span className="text-emerald-300">&quot;Kerala, India&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">model:</span>{" "}
                  <span className="text-emerald-300">&quot;Remote-first (No physical office)&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">focus:</span> [
                </p>
                <p className="pl-8 text-cyan-300">
                  &quot;Custom Web Platforms&quot;, &quot;Mobile Apps&quot;, &quot;Cloud Systems&quot;, &quot;Digital Marketing&quot;
                </p>
                <p className="pl-4">],</p>
                <p className="pl-4">
                  <span className="text-slate-400">mission:</span>{" "}
                  <span className="text-emerald-300">&quot;Transparent engineering &amp; client partnership&quot;</span>
                </p>
                <p>&#125;;</p>
              </div>

              {/* Pill badges inside the card */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-slate-800/60 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span>Kerala, India</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/60 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50">
                  <Laptop className="w-3.5 h-3.5 text-secondary" />
                  <span>100% Remote-First</span>
                </div>
              </div>
            </div>

            {/* Prominent Founding Year Floating Badge */}
            <div className="absolute -bottom-8 -right-4 md:-right-8 hidden sm:flex w-52 h-44 bg-primary text-white rounded-xl p-6 shadow-2xl flex-col justify-center border border-white/10 z-10">
              <span className="font-display-lg text-headline-lg font-bold block text-white tracking-tight">
                2026
              </span>
              <p className="font-label-mono text-xs uppercase text-secondary-container tracking-wider font-semibold">
                Founded May 01
              </p>
              <p className="text-xs text-white/70 mt-1">Kerala, India</p>
            </div>
          </motion.div>

          {/* Company Story Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              className="font-label-mono text-label-mono text-secondary mb-3 block uppercase tracking-widest text-xs font-semibold"
            >
              Our History &amp; Foundation
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-headline-md text-headline-md md:text-headline-lg text-primary mb-6 tracking-tight"
            >
              Our Story
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed"
            >
              Founded in May 2026 in Kerala, India, HexaKode was started by two
              friends—Navaneeth P P and Prajosh C—who set out to build a transparent,
              engineering-focused digital studio. Having observed businesses struggle
              with overcomplicated agency setups, opaque pricing, and fragile code,
              they established HexaKode to connect clients directly with the engineers
              crafting their digital products.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="font-body-md text-body-md text-on-surface-variant mb-10 leading-relaxed"
            >
              Operating entirely as a remote-first team without the overhead of a
              physical walk-in office, HexaKode delivers custom web applications,
              mobile platforms, and digital solutions for growing businesses in Kerala
              and beyond with complete architectural clarity.
            </motion.p>

            <div className="space-y-8">
              <motion.div variants={fadeUp} className="flex gap-5 group">
                <div className="w-12 h-12 bg-secondary-container/20 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-secondary/10 transition-all duration-300">
                  <Rocket className="text-secondary w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2 font-semibold">
                    Our Mission
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    To engineer superior web and mobile experiences through structured,
                    scalable code, giving ambitious businesses the digital reliability
                    they need to expand and succeed.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-5 group">
                <div className="w-12 h-12 bg-secondary-container/20 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-secondary/10 transition-all duration-300">
                  <Eye className="text-secondary w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2 font-semibold">
                    Our Vision
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    To bridge the gap between ambitious ideas and digital reality,
                    ensuring that every business has direct access to high-standard,
                    transparent software engineering.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

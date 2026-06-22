"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Cpu, Globe2, TrendingUp, Laptop2,
  type LucideProps,
} from "lucide-react";
import { cultureCards } from "@/data/careers";
import { CultureCard } from "@/types/careers";

// Dynamic icon map — add new icons here as needed
const iconMap: Record<string, React.FC<LucideProps>> = {
  Cpu,
  Globe2,
  TrendingUp,
  Laptop2,
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

function CultureCardItem({ card }: { card: CultureCard }) {
  const Icon = iconMap[card.icon] ?? Cpu;
  return (
    <motion.div
      variants={cardVariant}
      className="group relative bg-white/70 backdrop-blur-md border border-outline-variant/30 rounded-2xl p-8 hover:border-secondary/30 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-black/5"
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(circle at 30% 20%, rgba(0,102,136,0.04) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      <div className={`w-12 h-12 ${card.accentBg} rounded-xl flex items-center justify-center mb-6`}>
        <Icon className={`w-5 h-5 ${card.accentText}`} aria-hidden="true" />
      </div>

      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 tracking-tight">
        {card.title}
      </h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {card.description}
      </p>
    </motion.div>
  );
}

export default function WhyHexaKode() {
  return (
    <section
      id="culture"
      className="py-28 px-margin-mobile md:px-margin-desktop bg-surface"
    >
      <div className="max-w-container-max mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest mb-4 block">
            Why join us
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4 tracking-tight">
            Why HexaKode?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            A culture built around engineering excellence, continuous learning,
            and meaningful impact.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cultureCards.map((card) => (
            <CultureCardItem key={card.id} card={card} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

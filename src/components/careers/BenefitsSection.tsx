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
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function BenefitsSection() {
  return (
    <section className="pt-6 pb-16 md:pt-8 md:pb-20 lg:pt-12 lg:pb-24 px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-container-max mx-auto">
        <div>

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


        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "../common/Container";
import { TECHNOLOGIES } from "../../constants/home";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function TechnologiesSection() {
  return (
    <section className="bg-slate-50/50 py-16 border-y border-slate-100/60">
      <Container className="text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          <motion.h3 variants={fadeUp} className="text-[10px] md:text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">
            BUILT WITH THE WORLD'S MOST RELIABLE TECHNOLOGIES
          </motion.h3>
          
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 items-center justify-center"
          >
            {TECHNOLOGIES.map((tech) => (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-card hover:translate-y-[-2px] transition-all duration-300 group cursor-default"
              >
              {/* Custom SVG logo renderings */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {tech.name === "React" && (
                  <svg className="w-4 h-4 text-sky-400 animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="2" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
                    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
                  </svg>
                )}
                {tech.name === "Next.js" && (
                  <svg className="w-4.5 h-4.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 16.5L10 8.5V16H8.5V7.5H10L15.5 15V7.5H17V16.5H16Z" />
                  </svg>
                )}
                {tech.name === "TypeScript" && (
                  <div className="w-4 h-4 bg-[#3178c6] text-white text-[9px] font-extrabold flex items-center justify-center rounded-sm font-sans select-none">
                    TS
                  </div>
                )}
                {tech.name === "Node.js" && (
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2zm-1 15.6l-4-2.4V11l4 2.4v4.2zm0-5.5l-4-2.4 4-2.4 4 2.4-4 2.4zm5 3.1l-4 2.4V13l4-2.4v4.2z" />
                  </svg>
                )}
                {tech.name === "Firebase" && (
                  <svg className="w-4.5 h-4.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.89 15.67L8.25 2.28a.5.5 0 0 1 .95 0l1.6 4.93zM13.5 12.19l-2-6.19a.5.5 0 0 0-.95 0l-2.4 7.42zM19.89 16.63L12 21.15a.5.5 0 0 1-.5 0l-8-4.52a.5.5 0 0 1 0-.87l8-4.52a.5.5 0 0 1 .5 0l8 4.52a.5.5 0 0 1 0 .87z" />
                  </svg>
                )}
                {tech.name === "MongoDB" && (
                  <svg className="w-4.5 h-4.5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c0 0-5 3.5-5 8.5S10 19 12 22c2-3 5-8.5 5-13.5S12 2 12 2zm.2 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm.8-3.5c-.3.5-.7.8-1.2.8v-6.3c.5 0 .9.3 1.2.8.3.5.5 1 .5 1.6s-.2 1.1-.5 1.6z" />
                  </svg>
                )}
                {tech.name === "PostgreSQL" && (
                  <svg className="w-4.5 h-4.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
                  </svg>
                )}
                {tech.name === "Tailwind CSS" && (
                  <svg className="w-4.5 h-4.5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.335,6.182,14.974,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C7.666,17.818,9.027,19,12.001,19c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.335,13.382,8.974,12,6.001,12z" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      </Container>
    </section>
  );
}

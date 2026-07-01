"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import GeneralApplicationModal from "./GeneralApplicationModal";

export default function GeneralApplicationCTA() {
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);

  return (
    <section className="relative py-28 px-margin-mobile md:px-margin-desktop bg-primary-container overflow-hidden">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(0,102,136,0.25) 0%, transparent 70%)" }}
        />
      </div>

      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(93,202,253,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,253,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-container-max mx-auto text-center"
      >
        <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest mb-6 block">
          General Application
        </span>

        <h2 className="font-headline-lg text-headline-lg md:text-display-lg text-white mb-6 tracking-tight">
          Don&apos;t see your role?
        </h2>

        <p className="font-body-lg text-body-lg text-on-primary-container/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          We&apos;re always interested in meeting talented people. Send us your
          profile and we&apos;ll reach out when a suitable opportunity arises.
        </p>

        <button
          onClick={() => setIsGeneralModalOpen(true)}
          className="group inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-headline-sm text-headline-sm hover:bg-on-secondary-fixed-variant transition-all duration-300 shadow-lg hover:shadow-secondary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" aria-hidden="true" />
          Submit General Application
        </button>

        {/* Supporting note */}
        <p className="mt-6 font-body-sm text-body-sm text-on-primary-container/40">
          We review every submission. Profiles are kept on file for 12 months.
        </p>
      </motion.div>

      {/* General Application Modal overlay */}
      <GeneralApplicationModal isOpen={isGeneralModalOpen} onClose={() => setIsGeneralModalOpen(false)} />
    </section>
  );
}

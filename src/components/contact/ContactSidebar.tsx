"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import ContactDetailsCard from "./ContactDetailsCard";
import MapCard from "./MapCard";
import SocialLinksCard from "./SocialLinksCard";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ContactSidebar({ isDark = false }: { isDark?: boolean }) {
  return (
    <motion.aside
      className="lg:col-span-4 space-y-8 h-full w-full"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div variants={fadeUp}>
        <ContactDetailsCard isDark={isDark} />
      </motion.div>
      
      <motion.div variants={fadeUp}>
        <MapCard isDark={isDark} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <SocialLinksCard isDark={isDark} />
      </motion.div>
    </motion.aside>
  );
}

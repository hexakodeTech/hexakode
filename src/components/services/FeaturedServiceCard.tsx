"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Cloud, Cpu } from "lucide-react";
import { cn } from "../../lib/utils";
import Card from "../ui/Card";

interface FeaturedServiceCardProps {
  title: string;
  description: string;
  bulletPoints?: string[];
  className?: string;
}

// Crisp visual SVG of a node hub/network for the absolute background element
const HubBackgroundSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    className="w-[300px] h-[300px] text-white/10"
  >
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="4" r="2" />
    <circle cx="12" cy="20" r="2" />
    <circle cx="4" cy="12" r="2" />
    <circle cx="20" cy="12" r="2" />
    <line x1="12" y1="6" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="18" />
    <line x1="6" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="18" y2="12" />
    
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <line x1="7.4" y1="7.4" x2="9.9" y2="9.9" />
    <line x1="14.1" y1="14.1" x2="16.6" y2="16.6" />
    <line x1="16.6" y1="7.4" x2="14.1" y2="9.9" />
    <line x1="9.9" y1="14.1" x2="7.4" y2="16.6" />
  </svg>
);

export default function FeaturedServiceCard({
  title,
  description,
  bulletPoints = ["99.9% UPTIME SLAS", "AWS/AZURE EXPERTS"],
  className,
}: FeaturedServiceCardProps) {
  return (
    <motion.div
      whileHover="hover"
      className={cn("col-span-12 md:col-span-8 h-full", className)}
    >
      <Card
        variant="gradient"
        className="p-8 h-full min-h-[300px] relative overflow-hidden flex flex-col justify-between"
      >
        <div className="relative z-10">
          {/* Header Icons */}
          <div className="flex gap-4 mb-6">
            <motion.div
              variants={{
                hover: { y: -8 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Cloud className="w-10 h-10 text-secondary-container" />
            </motion.div>
            <motion.div
              variants={{
                hover: { y: -8 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Cpu className="w-10 h-10 text-secondary-container" />
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-headline-sm font-headline-sm mb-4 text-white">
            {title}
          </h3>

          {/* Description */}
          <p className="text-on-primary-container mb-6 text-body-md leading-relaxed max-w-lg">
            {description}
          </p>
        </div>

        {/* Checklist Grid */}
        {bulletPoints.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mt-auto pt-4 border-t border-white/10">
            {bulletPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 font-label-mono text-label-mono text-on-primary-container"
              >
                <CheckCircle className="w-4 h-4 text-secondary-container" />
                <span className="uppercase tracking-wider">{point}</span>
              </div>
            ))}
          </div>
        )}

        {/* Floating absolute background hub network diagram */}
        <motion.div
          className="absolute right-0 bottom-0 opacity-10 origin-bottom-right pointer-events-none select-none"
          variants={{
            hover: {
              scale: 1.25,
              rotate: 6,
              opacity: 0.15,
            },
          }}
          initial={{ scale: 1.1, rotate: 12 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <HubBackgroundSvg />
        </motion.div>
      </Card>
    </motion.div>
  );
}

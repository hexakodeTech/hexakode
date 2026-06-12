"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface TimelineStep {
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export default function ProcessTimeline({
  steps,
  className,
}: ProcessTimelineProps) {
  return (
    <div
      className={cn(
        "relative border-l-2 border-secondary/30 ml-3 pl-8 space-y-8",
        className
      )}
    >
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: index * 0.15,
                duration: 0.5,
                ease: "easeOut",
              },
            },
          }}
        >
          {/* Timeline Dot Marker */}
          <motion.span
            className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-secondary"
            variants={{
              hidden: { scale: 0 },
              visible: {
                scale: 1,
                transition: {
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              },
            }}
          />

          {/* Title */}
          <h4 className="font-bold text-white text-[16px] mb-1">
            {step.title}
          </h4>

          {/* Description */}
          <p className="text-on-primary-container text-body-sm leading-relaxed">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase } from "lucide-react";
import { jobs } from "@/data/jobs";
import { JobCategory } from "@/types/careers";
import JobCard from "./JobCard";

const ALL = "All Roles";
const CATEGORIES: (typeof ALL | JobCategory)[] = [
  ALL,
  "Engineering",
  "Design",
  "Product",
  "Marketing",
];

export default function OpenRoles() {
  const [activeTab, setActiveTab] = useState<typeof ALL | JobCategory>(ALL);

  const filtered = useMemo(
    () =>
      activeTab === ALL
        ? jobs
        : jobs.filter((j) => j.category === activeTab),
    [activeTab]
  );

  return (
    <section
      id="open-roles"
      className="py-28 px-margin-mobile md:px-margin-desktop bg-surface-container-low"
    >
      <div className="max-w-container-max mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest mb-4 block">
              Open Positions
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">
              Open Roles
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Find your next challenge at HexaKode.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2 bg-white border border-outline-variant/40 p-1 rounded-full"
            role="tablist"
            aria-label="Filter job categories"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeTab === cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full font-body-sm text-body-sm font-medium transition-all duration-200 ${
                  activeTab === cat
                    ? "bg-on-surface text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Job list */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filtered.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-outline" aria-hidden="true" />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mb-2">
                No open roles right now
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                Check back soon or submit a general application — we&apos;re always
                growing.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Count indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 font-label-mono text-label-mono text-outline text-center"
        >
          Showing {filtered.length} of {jobs.length} positions
        </motion.p>
      </div>
    </section>
  );
}

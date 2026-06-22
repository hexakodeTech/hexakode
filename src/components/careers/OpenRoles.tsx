"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase } from "lucide-react";
import { jobs } from "@/data/jobs";
import { JobCategory, Job } from "@/types/careers";
import JobCard from "./JobCard";
import JobDetailsModal from "./JobDetailsModal";
import GeneralApplicationModal from "./GeneralApplicationModal";

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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);

  const filtered = useMemo(
    () =>
      activeTab === ALL
        ? jobs
        : jobs.filter((j) => j.category === activeTab),
    [activeTab]
  );

  const hasNoOpenings = jobs.length === 0;

  return (
    <section
      id="open-roles"
      className="pt-16 pb-6 md:pt-20 md:pb-8 lg:pt-24 lg:pb-12 px-margin-mobile md:px-margin-desktop bg-surface-container-low"
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

          {/* Filter tabs - Hidden if no openings exist */}
          {!hasNoOpenings && (
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
          )}
        </div>

        {/* Global Empty State vs Job list */}
        {hasNoOpenings ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto bg-white rounded-3xl border border-outline-variant/40 p-8 md:p-12 text-center shadow-xl shadow-black/[0.01] relative overflow-hidden"
          >
            {/* Spotlight Glow inside the card */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

            {/* Large Minimal Blue Accent Icon */}
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-secondary/10 border border-secondary/20">
              <Briefcase className="w-9 h-9 text-secondary" aria-hidden="true" />
            </div>

            {/* Title */}
            <h3 className="font-headline-md text-headline-md md:text-headline-lg text-on-surface mb-4 tracking-tight">
              No Open Positions Right Now
            </h3>

            {/* Description */}
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto mb-8 leading-relaxed">
              We are not actively hiring at the moment.
              <br className="hidden sm:inline" />
              However, we&apos;re always interested in meeting talented engineers, designers, and innovators who are passionate about building exceptional digital products.
              <br className="hidden sm:inline" />
              Submit your profile and we&apos;ll keep it on file for future opportunities.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setIsGeneralModalOpen(true)}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-3.5 rounded-full font-body-md font-semibold hover:bg-on-secondary-fixed-variant transition-all duration-300 shadow-md hover:shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Submit General Application
              </button>
              <a
                href="https://www.linkedin.com/company/hexakodeteh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-on-surface px-8 py-3.5 rounded-full font-body-md font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Follow HexaKode on LinkedIn
              </a>
            </div>

            {/* Highlighted Note / Additional Message */}
            <div className="border-t border-outline-variant/30 pt-6 max-w-lg mx-auto">
              <p className="font-body-sm text-body-sm text-on-surface-variant/80 italic">
                We&apos;re growing steadily and new opportunities may open soon.
                <br />
                Check back regularly or submit your profile today.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Job list */
          <>
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
                    <JobCard key={job.id} job={job} index={i} onSelect={setSelectedJob} />
                  ))}
                </motion.div>
              ) : (
                /* Tab Empty State */
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

            {/* Count indicator - Hidden if no openings exist */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 font-label-mono text-label-mono text-outline text-center"
            >
              Showing {filtered.length} of {jobs.length} positions
            </motion.p>
          </>
        )}
      </div>

      {/* Details Modal overlay */}
      <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />

      {/* General Application Modal overlay */}
      <GeneralApplicationModal isOpen={isGeneralModalOpen} onClose={() => setIsGeneralModalOpen(false)} />
    </section>
  );
}

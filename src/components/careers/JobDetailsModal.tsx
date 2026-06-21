import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Job } from "@/types/careers";
import { toast } from "sonner";
import JobHeader from "./JobHeader";
import JobOverview from "./JobOverview";
import JobResponsibilities from "./JobResponsibilities";
import JobRequirements from "./JobRequirements";
import JobTechnologies from "./JobTechnologies";
import JobApplyCTA from "./JobApplyCTA";

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Esc key press handler & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (job) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [job, onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (!job || !modalRef.current) return;

    // Find all focusable elements
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex="0"]';
    const focusableElements = modalRef.current.querySelectorAll(focusableSelector);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Delay focus slightly to let entering animations play without layout disruption
    const timer = setTimeout(() => {
      firstElement?.focus();
    }, 100);

    window.addEventListener("keydown", handleFocusTrap);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleFocusTrap);
    };
  }, [job]);

  const handleApply = () => {
    toast("Application portal coming soon.", {
      description: "We are currently setting up our applicant tracking system. In the meantime, please send your resume and cover letter to contact@hexakode.in.",
      icon: "💼",
      duration: 5000,
    });
  };

  return (
    <AnimatePresence>
      {job && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop Blur & Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[900px] max-h-[90vh] bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 select-text">
              <JobHeader job={job} />
              
              <div className="space-y-6">
                <JobOverview description={job.description} />
                <JobResponsibilities responsibilities={job.responsibilities} />
                <JobRequirements requirements={job.requirements} />
                <JobTechnologies technologies={job.technologies} niceToHave={job.niceToHave} />
              </div>

              <JobApplyCTA onApply={handleApply} onClose={onClose} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

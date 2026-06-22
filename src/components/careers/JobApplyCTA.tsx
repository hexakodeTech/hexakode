import React from "react";
import { ArrowRight } from "lucide-react";

interface JobApplyCTAProps {
  onApply: () => void;
  onClose: () => void;
}

export default function JobApplyCTA({ onApply, onClose }: JobApplyCTAProps) {
  return (
    <div className="border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-end gap-3">
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/25 text-sm font-semibold transition-all duration-200"
      >
        Close
      </button>
      <button
        onClick={onApply}
        className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-on-secondary-fixed-variant transition-all duration-300 shadow-md hover:shadow-secondary/25 hover:shadow-lg"
      >
        Apply Now
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  );
}

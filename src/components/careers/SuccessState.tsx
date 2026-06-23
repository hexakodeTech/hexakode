import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessStateProps {
  onClose: () => void;
}

export default function SuccessState({ onClose }: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-12 px-4 sm:px-6"
    >
      <div className="w-16 h-16 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,102,136,0.15)]">
        <CheckCircle2 className="w-8 h-8 text-secondary-container" />
      </div>

      <h3 className="font-headline-md text-headline-md text-white font-bold tracking-tight mb-4 font-headline">
        Application Submitted Successfully
      </h3>

      <p className="font-body-md text-body-md text-slate-300 max-w-md mb-8 leading-relaxed font-body">
        Thank you for your interest in HexaKode.
        <br /><br />
        Your profile has been added to our talent network. We&apos;ll review your resume and contact you if a suitable opportunity becomes available.
      </p>

      <button
        onClick={onClose}
        className="w-full sm:w-auto px-10 py-3.5 bg-secondary text-white rounded-full font-headline-sm text-sm font-semibold hover:bg-on-secondary-fixed-variant transition-all duration-300 shadow-md hover:shadow-secondary/25 hover:shadow-lg"
      >
        Close
      </button>
    </motion.div>
  );
}

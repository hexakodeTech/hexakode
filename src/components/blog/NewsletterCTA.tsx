import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NewsletterCTA() {
  return (
    <div className="bg-navy-dark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden my-16 shadow-premium select-none">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-3">
          Partner with HexaKode
        </span>
        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
          Ready to Build Your Next Digital Product?
        </h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
          Transform your custom software ideas into production-ready solutions. Contact our engineering team today to design, build, and deploy.
        </p>
        <Link
          href="/contact?service=software-development"
          className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 bg-primary text-on-primary hover:shadow-lg transition-all duration-300 btn-shimmer text-base font-semibold cursor-pointer"
        >
          <span>Start Your Project</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

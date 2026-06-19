"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Ambient Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-error-container/10 filter blur-[95px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-secondary-container/5 filter blur-[90px]"
        />
      </div>

      <main className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center">
        {/* Access Denied Card */}
        <section className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-8 shadow-premium text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-error-container/20 p-4 text-error border border-error/15">
              <ShieldAlert className="w-10 h-10" />
            </div>
          </div>

          <h1 className="font-headline-md text-headline-sm text-primary tracking-tight font-semibold">
            Access Denied
          </h1>

          <div className="mt-4 space-y-3 font-body-md text-on-surface-variant text-sm leading-relaxed">
            <p>You do not have permission to access this resource.</p>
            <p className="text-xs text-on-surface-variant/70">
              Please contact your system administrator if you believe this is an error or to request elevated permissions.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col gap-3">
            <Link
              href="/admin/dashboard"
              className="w-full bg-primary text-on-primary font-body-sm font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all active:scale-[0.98] cursor-pointer text-center block text-xs"
            >
              Return to Dashboard
            </Link>

            <Link
              href="/admin"
              className="w-full border border-outline-variant/50 text-on-surface hover:bg-surface-container-low font-body-sm font-semibold py-3 rounded-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </section>

        {/* Footer Meta */}
        <footer className="mt-10 text-center">
          <p className="font-label-mono text-[9px] text-on-surface-variant/40 tracking-wider">
            © 2026 HexaKode Engineering. End-to-End Encrypted.
          </p>
        </footer>
      </main>
    </div>
  );
}

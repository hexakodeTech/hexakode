"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Shield, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) return;

    setStatus("loading");

    // Simulate authentication processing
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 800);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Premium Animated Ambient Lighting (Apple VisionOS / Linear inspired Orbs) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] text-on-background">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>

        {/* Ambient Blur Orbs */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-secondary-container/10 filter blur-[90px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 90, -60, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] rounded-full bg-secondary/8 filter blur-[110px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 0.9, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-secondary-container/5 filter blur-[70px]"
        />
      </div>

      {/* Main Login Card Wrapper */}
      <main className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center">
        {/* Branding */}
        <div className="mb-10 text-center">
          <img
            alt="HexaKode Logo"
            className="h-16 w-auto mb-5 mx-auto transition-transform duration-500 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5_VqrmGo0Yyz2eCzbJ2FcbcrPZN_jWkAN6euuVQzxrMkBQ2CfDpOjYWVe3aq_AIEswpv2MS4XO9VgfvgOFIYMSC9rIm3SjEQNwjrtmhhJmp1ft5nzoPat2z9QwmJwgn0zJZJsMIPoV_gQAD4p0NGbbo0TUaWEuuKEfg6nSP7dh7vq5hNBrqxnYyEYRa9qzr-Tg45hOyEIhgvax0BWxfDDB6uswBvAKj-sJbsOilWcd1wIOkM4PBdSVCjBDaXsnpVcMmsk_TKfO8Xk"
          />
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight font-semibold">
            Admin Console
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2 text-sm">
            Engineered Excellence in Management
          </p>
        </div>

        {/* Login Card */}
        <section className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-8 shadow-premium transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[10px]"
                htmlFor="email"
              >
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                <input
                  className="w-full bg-surface-container-low/60 border border-outline-variant/40 rounded-lg pl-11 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-outline/40 text-sm"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hexakode.com"
                  required
                />
              </div>
            </div>

            {/* Token Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="block font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[10px]"
                  htmlFor="token"
                >
                  Access Token
                </label>
                <a
                  className="font-label-mono text-[10px] text-secondary hover:underline transition-all uppercase tracking-wider"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Reset Password
                </a>
              </div>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                <input
                  className="w-full bg-surface-container-low/60 border border-outline-variant/40 rounded-lg pl-11 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-outline/40 text-sm font-mono"
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Remember active session */}
            <div className="flex items-center pt-1">
              <input
                className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label
                className="ml-3 font-body-sm text-on-surface-variant cursor-pointer select-none text-xs"
                htmlFor="remember"
              >
                Keep session active for 24 hours
              </label>
            </div>

            {/* Submit Action */}
            <button
              className="relative w-full bg-primary text-on-primary font-body-md font-semibold py-3.5 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-90"
              type="submit"
              disabled={status !== "idle"}
            >
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>Authorize Access</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}

                {status === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-secondary-container" />
                    <span>Verifying Cryptographic Credentials...</span>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center justify-center gap-2 text-secondary-container"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary-container" />
                    <span>Access Granted</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Status Indicators */}
          <div className="mt-6 pt-6 border-t border-outline-variant/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider">
                System: Operational
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-on-surface-variant/60" />
              <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider">
                End-to-End Encrypted
              </span>
            </div>
          </div>
        </section>

        {/* Footer Meta */}
        <footer className="mt-10 text-center">
          <p className="font-label-mono text-[10px] text-on-surface-variant/40 tracking-wider">
            © 2026 HexaKode Engineering. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-5">
            <a
              className="font-label-mono text-[9px] text-on-surface-variant/60 hover:text-primary transition-colors tracking-wider uppercase"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            <a
              className="font-label-mono text-[9px] text-on-surface-variant/60 hover:text-primary transition-colors tracking-wider uppercase"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Security Audit
            </a>
            <a
              className="font-label-mono text-[9px] text-on-surface-variant/60 hover:text-primary transition-colors tracking-wider uppercase"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              System Status
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

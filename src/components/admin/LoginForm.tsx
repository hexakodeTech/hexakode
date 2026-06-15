"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Shield, CheckCircle2, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  // Forgot Password flow states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

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
                  onClick={(e) => {
                    e.preventDefault();
                    setIsConfirmOpen(true);
                  }}
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

      {/* Reset Password Flows */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-6 shadow-premium relative overflow-hidden"
            >
              {/* Subtle top border blue gradient */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary to-secondary-container" />

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary-container/10 p-2.5 text-secondary flex-shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-sm font-semibold text-primary">
                    Request Password Reset
                  </h3>
                  <p className="text-xs text-on-surface-variant/85 leading-relaxed font-body-sm">
                    For security reasons, administrator passwords can only be reset by the Main Administrator.
                  </p>
                  <p className="text-xs text-on-surface-variant/85 leading-relaxed font-body-sm font-medium">
                    Would you like to submit a password reset request?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-6">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmOpen(false);
                    setIsSuccessOpen(true);
                    toast.success("Request Sent", {
                      description: "Password reset request submitted successfully.",
                      position: "top-right",
                      duration: 4000,
                    });
                  }}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-6 shadow-premium relative overflow-hidden"
            >
              {/* Subtle top border gradient */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary-container to-secondary" />

              <div className="flex flex-col items-center text-center space-y-4 py-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="p-3 bg-secondary-container/20 text-secondary rounded-full"
                >
                  <CheckCircle2 className="w-8 h-8 text-secondary" />
                </motion.div>

                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Request Submitted Successfully
                </h3>

                <div className="space-y-2 text-xs text-on-surface-variant/80 leading-relaxed font-body-sm px-2">
                  <p>
                    Your password reset request has been sent to the Main Administrator.
                  </p>
                  <p>
                    Please wait for their response. You will be notified once your password has been reset and access has been restored.
                  </p>
                  <p className="text-[11px] text-on-surface-variant/50 pt-1 italic">
                    If this request was submitted in error, please contact the Main Administrator directly.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsSuccessOpen(false)}
                  className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-xs font-semibold hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer text-center"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" theme="light" expand={false} richColors />
    </div>
  );
}

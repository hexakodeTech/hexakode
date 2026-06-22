import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import GeneralApplicationForm from "./GeneralApplicationForm";
import SuccessState from "./SuccessState";

interface GeneralApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GeneralApplicationModal({ isOpen, onClose }: GeneralApplicationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mouse coordinate state using MotionValues
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to interpolate mouse motion
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map springs to parallax coordinates for backdrop layers
  const sphereX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const sphereY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  const glassX = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const glassY = useTransform(springY, [-0.5, 0.5], [-6, 6]);

  const hexX = useTransform(springX, [-0.5, 0.5], [-3, 3]);
  const hexY = useTransform(springY, [-0.5, 0.5], [-3, 3]);

  // Mobile check
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Escape key & scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

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

    const timer = setTimeout(() => {
      firstElement?.focus();
    }, 150);

    window.addEventListener("keydown", handleFocusTrap);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleFocusTrap);
    };
  }, [isOpen, isSubmitted]);

  // Reset state on modal open/close
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || prefersReducedMotion) return;
    const relativeX = e.clientX / window.innerWidth - 0.5;
    const relativeY = e.clientY / window.innerHeight - 0.5;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const parallaxStyle = (x: any, y: any) => {
    if (isMobile || prefersReducedMotion) return {};
    return { x, y };
  };

  const handleFormSuccess = () => {
    setIsSubmitted(true);
    toast.success("Application submitted successfully.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop (Fades in, 0.2s) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* -------------------- FUTURISTIC BACKGROUND LAYERS -------------------- */}

          {/* Blueprint Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025] z-0 select-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(93,202,253,0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(93,202,253,0.12) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Diagonal Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] z-0 select-none" aria-hidden="true">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#5dcafd" strokeWidth="1.5" strokeDasharray="10 15" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#5dcafd" strokeWidth="1.5" strokeDasharray="10 15" />
          </svg>

          {/* Spotlight Glow (Behind the modal card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none blur-[120px] z-0"
            style={{
              background: "radial-gradient(circle, #5dcafd 0%, #006688 60%, transparent 100%)",
            }}
          />

          {/* Background Layer: Glowing Spheres (moves 10-12px) */}
          <motion.div
            style={parallaxStyle(sphereX, sphereY)}
            className="absolute inset-0 pointer-events-none z-0 select-none"
          >
            {/* Sphere 1 (Top-Left) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.06 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="absolute top-[12%] left-[12%] w-[200px] h-[200px] rounded-full filter blur-[50px] bg-gradient-to-tr from-[#006688] to-[#5dcafd]"
            />
            {/* Sphere 2 (Bottom-Right) - Desktop Only */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="absolute bottom-[12%] right-[12%] w-[180px] h-[180px] rounded-full filter blur-[60px] bg-gradient-to-tr from-[#0f1c2c] to-[#006688]"
              />
            )}
          </motion.div>

          {/* Mid Layer: Floating Glass Panels (moves 5-6px) */}
          <motion.div
            style={parallaxStyle(glassX, glassY)}
            className="absolute inset-0 pointer-events-none z-0 select-none"
          >
            {/* Glass Panel 1 (Top-Right) */}
            <motion.div
              initial={{ opacity: 0, y: -35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -35 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="absolute top-[18%] right-[18%] w-[110px] h-[160px]"
            >
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  y: [-12, 12, -12],
                  rotate: [-2, 2, -2]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full h-full bg-white/[0.02] backdrop-blur-[10px] border border-[#5dcafd]/15 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_15px_rgba(93,202,253,0.04)]"
              />
            </motion.div>
          </motion.div>

          {/* Connection Layer: Blueprint Hexagons (moves 3px) */}
          <motion.div
            style={parallaxStyle(hexX, hexY)}
            className="absolute inset-0 pointer-events-none z-0 select-none"
          >
            {/* Hexagon 1 (Top-Left Offset) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.06, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="absolute top-[22%] left-[25%] w-[100px] h-[100px]"
            >
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  scale: [0.96, 1.04, 0.96],
                  rotate: [0, 8, 0]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full h-full"
              >
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#5dcafd] stroke-current stroke-[0.75]" aria-hidden="true">
                  <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" />
                  <circle cx="50" cy="50" r="10" strokeDasharray="2 2" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* -------------------- CORE MODAL CONTAINER -------------------- */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[780px] max-h-[90vh] bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
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
              {!isSubmitted ? (
                <>
                  <div className="border-b border-white/10 pb-6 mb-6">
                    <h3 id="modal-title" className="font-headline-md text-headline-md md:text-headline-lg text-white font-bold tracking-tight mb-2 font-headline text-left">
                      General Application
                    </h3>
                    <p className="font-body-sm text-sm text-slate-400 leading-relaxed font-body text-left">
                      Join our talent network and be among the first to hear about future opportunities at HexaKode.
                    </p>
                  </div>
                  <GeneralApplicationForm onSubmitSuccess={handleFormSuccess} onCancel={onClose} />
                </>
              ) : (
                <SuccessState onClose={onClose} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

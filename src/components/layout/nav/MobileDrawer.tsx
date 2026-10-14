"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Layers,
  LayoutGrid,
  BookOpen,
  Building2,
  Globe,
  Smartphone,
  Palette,
  Brain,
  Code,
  Info,
  Mail,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Brand from "../../common/Brand";
import PrimaryButton from "../../ui/PrimaryButton";
import MobileAccordion from "./MobileAccordion";
import { cn } from "@/lib/utils";

const SERVICES_ITEMS = [
  { label: "Website Development", href: "/services/web-development", icon: Globe },
  { label: "Mobile Apps", href: "/services/mobile-app-development", icon: Smartphone },
  { label: "UI/UX Design", href: "/services/ui-ux-design", icon: Palette },
  { label: "Digital Marketing", href: "/services/digital-marketing", icon: TrendingUp },
  { label: "AI Solutions", href: "/services", icon: Brain, isFutureReady: true },
  { label: "Custom Software", href: "/services", icon: Code, isFutureReady: true },
];

const COMPANY_ITEMS = [
  { label: "About Us", href: "/about", icon: Info },
  { label: "Contact Us", href: "/contact", icon: Mail },
  { label: "Careers", href: "/careers", icon: Briefcase, isFutureReady: true },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export default function MobileDrawer({ isOpen, onClose, pathname }: MobileDrawerProps) {
  const [openAccordion, setOpenAccordion] = useState<"services" | "company" | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const toggleAccordion = (menu: "services" | "company") => {
    setOpenAccordion((prev) => (prev === menu ? null : menu));
  };

  const isServicesActive = pathname.startsWith("/services");
  const isPortfolioActive = pathname === "/portfolio";
  const isBlogActive = pathname.startsWith("/blog");
  const isCompanyActive = pathname === "/about" || pathname === "/careers";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer Container */}
          <motion.div
            ref={drawerRef}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 360 }}
            dragElastic={{ left: 0.05, right: 0.95 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 90 || info.velocity.x > 250) {
                onClose();
              }
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-[1200] w-[85vw] max-w-[360px] bg-surface rounded-l-2xl shadow-2xl border-l border-outline-variant/30 lg:hidden flex flex-col justify-between overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex h-[56px] sm:h-[60px] items-center justify-between px-5 border-b border-outline-variant/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 shrink-0">
                  <Image
                    src="/logo-icon.png"
                    alt="HexaKode Logo"
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <Brand variant="navbar" />
              </div>
              <button
                onClick={onClose}
                type="button"
                className="p-2 -mr-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-5" aria-label="Mobile Navigation Drawer">
              <div>
                <div className="px-3 text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 select-none">
                  Navigation
                </div>

                <div className="space-y-1">
                  {/* Services Accordion */}
                  <MobileAccordion
                    title="Services"
                    icon={Layers}
                    isOpen={openAccordion === "services"}
                    onToggle={() => toggleAccordion("services")}
                    items={SERVICES_ITEMS}
                    pathname={pathname}
                    onCloseDrawer={onClose}
                    isParentActive={isServicesActive}
                  />

                  {/* Portfolio Link */}
                  <Link
                    href="/portfolio"
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 min-h-[52px] px-3.5 rounded-xl text-[16px] font-medium tracking-tight transition-all duration-200 border-l-2 select-none",
                      isPortfolioActive
                        ? "text-secondary bg-secondary/5 border-secondary font-semibold"
                        : "text-on-surface-variant hover:text-primary hover:bg-slate-50 border-transparent"
                    )}
                  >
                    <LayoutGrid className="w-4.5 h-4.5 text-secondary/80 shrink-0" />
                    <span>Portfolio</span>
                  </Link>

                  {/* Blog Link */}
                  <Link
                    href="/blog"
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 min-h-[52px] px-3.5 rounded-xl text-[16px] font-medium tracking-tight transition-all duration-200 border-l-2 select-none",
                      isBlogActive
                        ? "text-secondary bg-secondary/5 border-secondary font-semibold"
                        : "text-on-surface-variant hover:text-primary hover:bg-slate-50 border-transparent"
                    )}
                  >
                    <BookOpen className="w-4.5 h-4.5 text-secondary/80 shrink-0" />
                    <span>Blog</span>
                  </Link>

                  {/* Company Accordion */}
                  <MobileAccordion
                    title="Company"
                    icon={Building2}
                    isOpen={openAccordion === "company"}
                    onToggle={() => toggleAccordion("company")}
                    items={COMPANY_ITEMS}
                    pathname={pathname}
                    onCloseDrawer={onClose}
                    isParentActive={isCompanyActive}
                  />
                </div>
              </div>
            </nav>

            {/* Sticky Bottom Panel */}
            <div className="border-t border-outline-variant/10 px-5 py-4 bg-surface/98 backdrop-blur-md sticky bottom-0 z-50 shrink-0">
              <PrimaryButton
                href="/contact#contact-form"
                variant="primary"
                onClick={onClose}
                className="w-full text-center min-h-[54px] text-[14px] font-bold uppercase tracking-wider rounded-xl shadow-lg bg-secondary text-white hover:bg-secondary/95 border-none"
              >
                Start Your Project
              </PrimaryButton>

              {/* Social Media Links */}
              <div className="flex items-center justify-center gap-4 mt-3.5">
                <a
                  href="mailto:contact@hexakode.in"
                  className="p-2.5 rounded-full hover:bg-slate-100 text-on-surface-variant/80 hover:text-secondary transition-all flex items-center justify-center"
                  aria-label="Email Us"
                >
                  <Mail className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://in.linkedin.com/company/hexakodeteh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full hover:bg-slate-100 text-on-surface-variant/80 hover:text-secondary transition-all flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/hexakode_tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full hover:bg-slate-100 text-on-surface-variant/80 hover:text-secondary transition-all flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <svg className="w-4.5 h-4.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61589246312714"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full hover:bg-slate-100 text-on-surface-variant/80 hover:text-secondary transition-all flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/HexaKode98190"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full hover:bg-slate-100 text-on-surface-variant/80 hover:text-secondary transition-all flex items-center justify-center"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

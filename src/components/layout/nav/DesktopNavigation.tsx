"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Smartphone,
  Palette,
  Brain,
  Code,
  TrendingUp,
  ArrowRight,
  Info,
  Mail,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import Brand from "../../common/Brand";
import PrimaryButton from "../../ui/PrimaryButton";
import { cn } from "@/lib/utils";

const SERVICES_ITEMS = [
  {
    label: "Website Development",
    href: "/services/web-development",
    description: "Custom websites, business web apps & SaaS interfaces.",
    icon: Globe,
  },
  {
    label: "Mobile App Development",
    href: "/services/mobile-app-development",
    description: "Hybrid and native iOS/Android mobile apps.",
    icon: Smartphone,
  },
  {
    label: "UI/UX Design",
    href: "/services/ui-ux-design",
    description: "Conversion-optimized product design & design systems.",
    icon: Palette,
  },
  {
    label: "Digital Marketing",
    href: "/services/digital-marketing",
    description: "SEO, Google Ads, local search & performance marketing.",
    icon: TrendingUp,
  },
  {
    label: "AI Solutions",
    href: "/services",
    description: "Custom AI integrations, LLMs, and agentic workflows.",
    icon: Brain,
    isFutureReady: true,
  },
  {
    label: "Custom Software",
    href: "/services",
    description: "Enterprise software systems & scalable cloud backends.",
    icon: Code,
    isFutureReady: true,
  },
  {
    label: "View All Services",
    href: "/services",
    description: "Explore our complete engineering & design capabilities.",
    icon: ArrowRight,
    isViewAll: true,
  },
];

const COMPANY_ITEMS = [
  {
    label: "About Us",
    href: "/about",
    description: "Learn about our vision, mission, and remote-first team.",
    icon: Info,
  },
  {
    label: "Contact Us",
    href: "/contact",
    description: "Get in touch directly with our consultants and builders.",
    icon: Mail,
  },
  {
    label: "Careers",
    href: "/careers",
    description: "Join our team of elite developers and visual designers.",
    icon: Briefcase,
    isFutureReady: true,
  },
];

interface DesktopNavigationProps {
  pathname: string;
}

export default function DesktopNavigation({ pathname }: DesktopNavigationProps) {
  const [activeDropdown, setActiveDropdown] = useState<"services" | "company" | null>(null);

  const servicesRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: "services" | "company") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        servicesRef.current && !servicesRef.current.contains(e.target as Node) &&
        companyRef.current && !companyRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isServicesActive = pathname.startsWith("/services");
  const isPortfolioActive = pathname === "/portfolio";
  const isBlogActive = pathname.startsWith("/blog");
  const isCompanyActive = pathname === "/about" || pathname === "/careers";

  return (
    <div className="hidden lg:flex items-center justify-between w-full h-20">
      {/* Desktop Logo */}
      <Link href="/" className="flex items-center gap-3 group select-none relative z-10 shrink-0">
        <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105 shrink-0">
          <Image
            src="/logo-icon.webp"
            alt="HexaKode Logo"
            fill
            sizes="36px"
            priority
            className="object-contain"
          />
        </div>
        <Brand variant="navbar" />
      </Link>

      {/* Desktop Links */}
      <nav className="flex items-center gap-9" aria-label="Desktop Navigation">
        {/* Services Dropdown */}
        <div
          ref={servicesRef}
          className="relative py-2"
          onMouseEnter={() => handleMouseEnter("services")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/services"
            className={cn(
              "relative font-body-md text-[13.5px] font-medium tracking-wide transition-colors duration-300 py-1 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-secondary/20 rounded outline-none select-none",
              isServicesActive ? "text-secondary font-semibold" : "text-on-surface-variant hover:text-secondary"
            )}
          >
            <span>Services</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-300",
                activeDropdown === "services" ? "rotate-180 text-secondary" : "text-on-surface-variant/60"
              )}
            />
            {isServicesActive && (
              <motion.span
                layoutId="nav-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          <AnimatePresence>
            {activeDropdown === "services" && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                role="menu"
                aria-label="Services Submenu"
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[560px] bg-white rounded-2xl border border-outline-variant/20 shadow-premium p-4 z-50 overflow-hidden flex flex-col gap-1"
              >
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES_ITEMS.map((item) => {
                    const Icon = item.icon;
                    if (item.isViewAll) return null;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        className="flex gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 text-left group focus-visible:ring-2 focus-visible:ring-secondary/20 outline-none"
                      >
                        <div className="w-9 h-9 rounded-lg bg-secondary-container/10 text-secondary flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                          <Icon className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-semibold text-[12.5px] text-navy-dark group-hover:text-secondary transition-colors">
                              {item.label}
                            </h4>
                            {item.isFutureReady && (
                              <span className="text-[8px] tracking-wide uppercase bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full scale-90 origin-left">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {SERVICES_ITEMS.filter((item) => item.isViewAll).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      className="flex gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors duration-200 text-left group rounded-xl mt-2 border-t border-slate-100 outline-none items-center"
                    >
                      <div className="w-7 h-7 rounded-md bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-[12px] text-navy-dark group-hover:text-secondary transition-colors">
                            {item.label}
                          </h4>
                          <p className="text-slate-400 text-[10px] mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Portfolio */}
        <Link
          href="/portfolio"
          className={cn(
            "relative font-body-md text-[13.5px] font-medium tracking-wide transition-colors duration-300 py-1 focus-visible:ring-2 focus-visible:ring-secondary/20 rounded outline-none select-none",
            isPortfolioActive ? "text-secondary font-semibold" : "text-on-surface-variant hover:text-secondary"
          )}
        >
          <span>Portfolio</span>
          {isPortfolioActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>

        {/* Blog */}
        <Link
          href="/blog"
          className={cn(
            "relative font-body-md text-[13.5px] font-medium tracking-wide transition-colors duration-300 py-1 focus-visible:ring-2 focus-visible:ring-secondary/20 rounded outline-none select-none",
            isBlogActive ? "text-secondary font-semibold" : "text-on-surface-variant hover:text-secondary"
          )}
        >
          <span>Blog</span>
          {isBlogActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>

        {/* Company Dropdown */}
        <div
          ref={companyRef}
          className="relative py-2"
          onMouseEnter={() => handleMouseEnter("company")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/about"
            className={cn(
              "relative font-body-md text-[13.5px] font-medium tracking-wide transition-colors duration-300 py-1 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-secondary/20 rounded outline-none select-none",
              isCompanyActive ? "text-secondary font-semibold" : "text-on-surface-variant hover:text-secondary"
            )}
          >
            <span>Company</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-300",
                activeDropdown === "company" ? "rotate-180 text-secondary" : "text-on-surface-variant/60"
              )}
            />
            {isCompanyActive && (
              <motion.span
                layoutId="nav-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          <AnimatePresence>
            {activeDropdown === "company" && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                role="menu"
                aria-label="Company Submenu"
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[280px] bg-white rounded-2xl border border-outline-variant/20 shadow-premium p-2 z-50 flex flex-col gap-0.5"
              >
                {COMPANY_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      className="flex gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200 text-left group focus-visible:ring-2 focus-visible:ring-secondary/20 outline-none"
                    >
                      <div className="w-8 h-8 rounded-lg bg-secondary-container/10 text-secondary flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                        <Icon className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-[12px] text-navy-dark group-hover:text-secondary transition-colors">
                            {item.label}
                          </h4>
                          {item.isFutureReady && (
                            <span className="text-[7px] tracking-wide uppercase bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full scale-90 origin-left">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[10.5px] mt-0.5 leading-normal line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact */}
        <Link
          href="/contact"
          className={cn(
            "relative font-body-md text-[13.5px] font-medium tracking-wide transition-colors duration-300 py-1 focus-visible:ring-2 focus-visible:ring-secondary/20 rounded outline-none select-none",
            pathname === "/contact" ? "text-secondary font-semibold" : "text-on-surface-variant hover:text-secondary"
          )}
        >
          <span>Contact</span>
          {pathname === "/contact" && (
            <motion.span
              layoutId="nav-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
      </nav>

      {/* Desktop CTA */}
      <div className="flex items-center gap-4">
        <PrimaryButton
          href="/contact#contact-form"
          variant="primary"
          shimmer={true}
          magnetic={true}
          className="px-5 py-2.5 text-xs font-bold transition-all shadow-sm"
        >
          Get Started
        </PrimaryButton>
      </div>
    </div>
  );
}

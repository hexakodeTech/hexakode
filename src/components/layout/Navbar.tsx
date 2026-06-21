"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b backdrop-blur-md shadow-sm",
        scrolled
          ? "bg-surface/90 border-outline-variant/30 py-2"
          : "bg-surface/80 border-outline-variant/20 py-4"
      )}
    >
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105 shrink-0">
            <Image
              src="/logo-icon.png"
              alt="HexaKode Logo"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <span className="brand-logo text-headline-md font-normal tracking-tight text-primary transition-colors hover:text-secondary">
            HexaKode
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "font-body-md transition-colors duration-300 hover:text-primary",
                  isActive
                    ? "text-primary font-semibold border-b-2 border-secondary"
                    : "text-on-surface-variant"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <PrimaryButton
            href="/contact#contact-form"
            variant="primary"
            shimmer={true}
            magnetic={true}
            className="px-6 py-3"
          >
            Start Your Project
          </PrimaryButton>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-surface border-b border-outline-variant/30 shadow-lg px-margin-mobile py-6 transition-all duration-300 md:hidden flex flex-col gap-6 origin-top",
          isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-4">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "font-body-md py-1 self-start transition-colors duration-300 hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-on-surface-variant"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <PrimaryButton
          href="/contact#contact-form"
          variant="primary"
          onClick={() => setIsOpen(false)}
          className="w-full text-center"
        >
          Start Your Project
        </PrimaryButton>
      </div>
    </header>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { NAV_LINKS, COMPANY_NAME } from "../../constants/home";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo-icon.png"
              alt="HexaKode Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg tracking-wide text-navy-dark font-logo font-bold">
            {COMPANY_NAME}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <PrimaryButton href="#contact" variant="dark">
            Start Your Project
          </PrimaryButton>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-navy-dark hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg px-6 py-6 transition-all duration-300 md:hidden flex flex-col gap-6 origin-top",
          isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-sky-600 transition-colors duration-200 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <PrimaryButton href="#contact" variant="dark" onClick={() => setIsOpen(false)} className="w-full">
          Start Your Project
        </PrimaryButton>
      </div>
    </header>
  );
}

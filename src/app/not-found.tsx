import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import NotFoundTerminal from "@/components/common/NotFoundTerminal";

export const metadata: Metadata = {
  title: "404 | Page Not Found | HexaKode",
  description:
    "The page you're looking for could not be found. Explore our software development services and return to the HexaKode homepage.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center pt-28 pb-16 md:py-32 relative overflow-hidden bg-white text-navy-dark min-h-[calc(100vh-160px)]">
        {/* Background soft glowing elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
          {/* Left Side Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-secondary-container text-primary border border-secondary-container/80 shadow-[0_2px_10px_rgba(14,165,233,0.04)]">
              ERROR 404 • PATH NOT FOUND
            </span>

            <div className="relative mb-2">
              <span className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-navy-dark via-secondary to-cyan-500 tracking-tighter leading-none select-none">
                404
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-cyan-500/20 blur-2xl -z-10 rounded-full opacity-50" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-navy-dark leading-[1.12] mb-4">
              Oops! This Page Doesn&apos;t Exist
            </h1>

            <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-8 font-normal max-w-lg">
              The page you&apos;re looking for may have been moved, renamed, or no longer exists. Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <PrimaryButton href="/" variant="dark" showArrow className="btn-gradient-hover w-full sm:w-auto">
                Go Home
              </PrimaryButton>
              <SecondaryButton href="/services" variant="light" className="w-full sm:w-auto">
                View Our Services
              </SecondaryButton>
            </div>

            {/* Additional Directory Links for Low Bounce Rate */}
            <div className="mt-10 pt-6 border-t border-slate-100 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">
                Lost? Explore HexaKode:
              </span>
              <div className="flex items-center gap-4">
                <Link href="/portfolio" className="hover:text-primary transition-colors font-medium underline underline-offset-4">
                  Portfolio
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/about" className="hover:text-primary transition-colors font-medium underline underline-offset-4">
                  About Us
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/contact#contact-form" className="hover:text-primary transition-colors font-medium underline underline-offset-4">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Visual Terminal */}
          <div className="lg:col-span-6 flex justify-center items-center w-full">
            <NotFoundTerminal />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

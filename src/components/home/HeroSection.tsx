import React from "react";
import Image from "next/image";
import Container from "../common/Container";
import PrimaryButton from "../common/PrimaryButton";
import SecondaryButton from "../common/SecondaryButton";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 md:py-32 overflow-hidden bg-white">
      {/* Background soft glowing elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-[80px] pointer-events-none" />

      <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side text content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left max-w-2xl animate-fade-in-up">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-secondary-container text-primary border border-secondary-container/80 shadow-[0_2px_10px_rgba(14,165,233,0.04)]">
            ENGINEERED EXCELLENCE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-navy-dark leading-[1.08] mb-6">
            Build Digital Products{" "}
            <span className="text-primary relative inline-block">
              That
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-secondary to-cyan-400 rounded-full" />
            </span>{" "}
            Drive Business Growth
          </h1>
          <p className="text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed mb-10 font-normal">
            Custom software, web applications, mobile apps, and digital experiences built to help businesses scale with technical precision and market-leading innovation.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <PrimaryButton href="#contact" variant="dark" showArrow className="btn-gradient-hover">
              Start Your Project
            </PrimaryButton>
            <SecondaryButton href="#portfolio" variant="light">
              View Portfolio
            </SecondaryButton>
          </div>
        </div>

        {/* Right Side Mock/Visual Graphic */}
        <div className="lg:col-span-5 flex justify-center items-center relative select-none">
          <div className="relative w-full max-w-[420px] aspect-square rounded-2xl bg-gradient-to-b from-slate-50/50 to-slate-100/50 p-4 border border-slate-100 shadow-premium">
            {/* Ambient shadow glow behind the graphic */}
            <div className="absolute inset-0 -m-6 bg-secondary/10 rounded-full filter blur-3xl opacity-60 pointer-events-none" />
            
            {/* The Floating Graphic Box */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-premium-hover animate-[bounce_6s_infinite_ease-in-out]">
              <Image
                src="/hero-graphics.png"
                alt="HexaKode Technological Precision abstract graphic"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

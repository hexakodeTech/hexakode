import React from "react";
import Container from "../common/Container";
import PrimaryButton from "../common/PrimaryButton";
import SecondaryButton from "../common/SecondaryButton";

export default function CTASection() {
  return (
    <section id="contact" className="bg-white py-16 md:py-24">
      <Container>
        <div className="relative rounded-3xl bg-[#0b1329] border border-white/5 overflow-hidden py-16 px-6 md:py-24 md:px-12 text-center shadow-premium">
          {/* Decorative glowing background gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(14,165,233,0.18)_0%,rgba(14,165,233,0)_70%)] pointer-events-none filter blur-2xl z-0" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-white/5 text-secondary border border-white/10">
              GET IN TOUCH
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Let's Build Something Amazing Together
            </h2>
            
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              Ready to elevate your digital presence? Join the ranks of high-growth companies building with HexaKode.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
              <PrimaryButton href="#contact" variant="blue" className="btn-gradient-hover">
                Start Your Project
              </PrimaryButton>
              <SecondaryButton href="#contact" variant="dark">
                Schedule a Demo
              </SecondaryButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

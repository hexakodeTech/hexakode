import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TechnologiesSection from "@/components/home/TechnologiesSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-[32px] md:pt-[20px]">
        <HeroSection />
        <TechnologiesSection />
        <ServicesSection />
        <ProjectsSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

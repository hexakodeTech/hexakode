import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import ServicesHero from "@/components/services/ServicesHero";
import CompetenciesSection from "@/components/services/CompetenciesSection";
import CloudInfrastructureSection from "@/components/services/CloudInfrastructureSection";
import CTASection from "@/components/services/CTASection";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Services | HexaKode Engineering",
  description:
    "HexaKode delivers high-performance engineering solutions designed for scale. From cloud-native architectures to intuitive user experiences, explore our web, mobile, design, and API competencies.",
  keywords: [
    "Web Engineering",
    "Mobile Apps",
    "UI/UX Design",
    "Cloud Infrastructure",
    "API Development",
    "HexaKode Services",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden">
        <ServicesHero />
        <CompetenciesSection />
        <CloudInfrastructureSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

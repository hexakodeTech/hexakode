import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import ServicesHero from "@/components/services/ServicesHero";
import CompetenciesSection from "@/components/services/CompetenciesSection";
import CloudInfrastructureSection from "@/components/services/CloudInfrastructureSection";
import CTASection from "@/components/services/CTASection";
import Footer from "@/components/layout/Footer";

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Services | HexaKode Engineering",
  description:
    "Explore HexaKode's engineering services: custom web applications, mobile apps, UI/UX design, and digital marketing built to scale your business.",
  path: "/services",
  image: "/og-image.png",
  imageAlt: "HexaKode Software & Engineering Services",
  keywords: [
    "Web Engineering",
    "Website Development",
    "Mobile Apps",
    "UI/UX Design",
    "Digital Marketing",
    "Cloud Infrastructure",
    "API Development",
    "HexaKode Services",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-[32px] md:pt-[20px]">
        <ServicesHero />
        <CompetenciesSection />
        <CloudInfrastructureSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

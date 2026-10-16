import React from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import ServicesHero from "@/components/services/ServicesHero";
import Footer from "@/components/layout/Footer";

const CompetenciesSection = dynamic(() => import("@/components/services/CompetenciesSection"));
const CloudInfrastructureSection = dynamic(() => import("@/components/services/CloudInfrastructureSection"));
const CTASection = dynamic(() => import("@/components/services/CTASection"));

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Services | HexaKode Engineering",
  description:
    "Explore HexaKode's engineering services: custom web applications, mobile apps, UI/UX design, and digital marketing built to scale your business.",
  path: "/services",
  image: "/og-image.png",
  imageAlt: "HexaKode Software & Engineering Services",
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

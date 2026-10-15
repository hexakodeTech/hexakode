import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AboutHero from "../../components/about/AboutHero";
import CompanyStory from "../../components/about/CompanyStory";
import FoundersSection from "../../components/about/FoundersSection";
import TeamSection from "../../components/about/TeamSection";
import WorkingModel from "../../components/about/WorkingModel";
import CoreValues from "../../components/about/CoreValues";
import TrustMetrics from "../../components/about/TrustMetrics";
import FinalCTA from "../../components/about/FinalCTA";

import {
  constructMetadata,
  constructAboutPageJsonLd,
  safeJsonLdStringify,
} from "@/lib/seo";
import { FOUNDERS, TEAM_MEMBERS } from "@/constants/about";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "About Us | HexaKode Engineering",
  description:
    "We bridge the gap between complex engineering challenges and elegant digital solutions, delivering scalable excellence for global enterprises.",
  path: "/about",
  image: "/og-image.png",
  imageAlt: "About HexaKode Engineering",
});

export default function AboutPage() {
  const aboutPageJsonLd = constructAboutPageJsonLd({
    founders: FOUNDERS.map((f) => ({
      name: f.name,
      role: f.role,
      imageUrl: f.imageUrl,
      socialUrl: f.socialUrl,
    })),
    teamMembers: TEAM_MEMBERS.map((m) => ({
      name: m.name,
      role: m.role,
      imageUrl: m.imageUrl,
      socialUrl: m.socialUrl,
    })),
  });

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(aboutPageJsonLd),
        }}
      />
      <Navbar />
      <main className="flex-1 pt-[112px] md:pt-[100px]">
        <AboutHero />
        <CompanyStory />
        <FoundersSection />
        <TeamSection />
        <WorkingModel />
        <CoreValues />
        <TrustMetrics />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

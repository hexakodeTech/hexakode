import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AboutHero from "../../components/about/AboutHero";
import CompanyStory from "../../components/about/CompanyStory";
import CoreValues from "../../components/about/CoreValues";
import TeamSection from "../../components/about/TeamSection";
import TrustMetrics from "../../components/about/TrustMetrics";
import FinalCTA from "../../components/about/FinalCTA";

export const metadata = {
  title: "About Us | HexaKode Engineering",
  description: "We bridge the gap between complex engineering challenges and elegant digital solutions, delivering scalable excellence for global enterprises.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20">
        <AboutHero />
        <CompanyStory />
        <CoreValues />
        <TeamSection />
        <TrustMetrics />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

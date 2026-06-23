import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ContactHero from "../../components/contact/ContactHero";
import ContactGridSection from "../../components/contact/ContactGridSection";
import FAQSection from "../../components/contact/FAQSection";

export const metadata = {
  title: "Contact Us | HexaKode Engineering",
  description: "Ready to engineer excellence? Contact HexaKode to scope your project, hire a dedicated development team, or schedule a technical discovery call.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 pt-[112px] md:pt-[100px]">
        {/* Hero Area */}
        <ContactHero />

        {/* Form and Details Grid (Scroll-driven background shift) */}
        <ContactGridSection />


        {/* FAQ Section */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}

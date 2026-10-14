import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ContactHero from "../../components/contact/ContactHero";
import ContactGridSection from "../../components/contact/ContactGridSection";
import FAQSection from "../../components/contact/FAQSection";
import GoogleReviewCTA from "../../components/common/GoogleReviewCTA";
import { FAQ_ITEMS } from "../../constants/contact";

import { constructMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us | HexaKode Engineering",
  description:
    "Ready to engineer excellence? Contact HexaKode to scope your project, hire a dedicated development team, or schedule a free consultation.",
  path: "/contact",
  image: "/og-image.png",
  imageAlt: "Contact HexaKode Engineering",
});

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us | HexaKode Engineering",
  url: "https://hexakode.in/contact",
  description:
    "Ready to engineer excellence? Contact HexaKode to scope your project, hire a dedicated development team, or schedule a free consultation.",
  mainEntity: {
    "@type": "Organization",
    "@id": "https://hexakode.in/#organization",
    name: "HexaKode",
    url: "https://hexakode.in",
    telephone: "+91 95398 28694",
    email: "contact@hexakode.in",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />

      <main className="flex-1 pt-[112px] md:pt-[100px]">
        {/* Hero Area */}
        <ContactHero />

        {/* Form and Details Grid (Scroll-driven background shift) */}
        <ContactGridSection />


        {/* FAQ Section */}
        <FAQSection />

        {/* Google Reviews Card */}
        <div className="py-12 md:py-16 border-t border-outline-variant/10 bg-slate-50/20">
          <GoogleReviewCTA variant="card" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

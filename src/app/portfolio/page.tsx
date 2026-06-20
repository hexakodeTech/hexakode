import React from "react";
import { Metadata } from "next";
import PortfolioListingClient from "@/components/portfolio/PortfolioListingClient";

export const metadata: Metadata = {
  title: "Portfolio | HexaKode Engineering",
  description:
    "Explore HexaKode's portfolio of enterprise software, high-performance web systems, intuitive mobile products, and custom UI/UX engineering case studies.",
  keywords: [
    "Software Architecture",
    "Web Engineering",
    "Mobile Development",
    "UI/UX Design",
    "Enterprise Solutions",
    "HexaKode Portfolio",
  ],
};

export default function PortfolioPage() {
  return <PortfolioListingClient />;
}


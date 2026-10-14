import React from "react";
import { Metadata } from "next";
import PortfolioListingClient from "@/components/portfolio/PortfolioListingClient";
import Footer from "@/components/layout/Footer";
import { getPublicPortfolioProjects } from "@/modules/portfolio/services/portfolio.service";

export const revalidate = 60;

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Portfolio | HexaKode Engineering",
  description:
    "Explore HexaKode's portfolio of enterprise software, high-performance web systems, intuitive mobile products, and custom UI/UX engineering case studies.",
  path: "/portfolio",
  image: "/og-image.png",
  imageAlt: "HexaKode Software Portfolio and Case Studies",
  keywords: [
    "Software Architecture",
    "Web Engineering",
    "Mobile Development",
    "UI/UX Design",
    "Enterprise Solutions",
    "HexaKode Portfolio",
  ],
});

export default async function PortfolioPage() {
  const projects = await getPublicPortfolioProjects();
  return <PortfolioListingClient initialProjects={projects} footer={<Footer />} />;
}


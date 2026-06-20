"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFilterBar from "@/components/portfolio/PortfolioFilterBar";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import PortfolioCTA from "@/components/portfolio/PortfolioCTA";
import Footer from "@/components/layout/Footer";
import { PORTFOLIO_PROJECTS } from "@/constants/portfolio";

export default function PortfolioListingClient() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filter project lists dynamically based on selected active chip category
  const filteredProjects = PORTFOLIO_PROJECTS.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ui-ux") return project.category.toLowerCase() === "ui/ux";
    return project.category.toLowerCase() === activeFilter;
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-20">
        <PortfolioHero />
        <PortfolioFilterBar
          currentFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <PortfolioGrid projects={filteredProjects} />
        <PortfolioCTA />
      </main>
      <Footer />
    </>
  );
}

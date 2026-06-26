"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFilters from "@/modules/portfolio/components/public/PortfolioFilters";
import PortfolioGrid from "@/modules/portfolio/components/public/PortfolioGrid";
import PortfolioSkeleton from "@/modules/portfolio/components/public/PortfolioSkeleton";
import EmptyPortfolio from "@/modules/portfolio/components/public/EmptyPortfolio";
import ErrorState from "@/modules/portfolio/components/public/ErrorState";
import PortfolioCTA from "@/components/portfolio/PortfolioCTA";
import Footer from "@/components/layout/Footer";
import { usePortfolioProjects } from "@/modules/portfolio/hooks/usePortfolioProjects";

export default function PortfolioListingClient() {
  const {
    projects,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    retry,
  } = usePortfolioProjects();

  // Filter projects dynamically based on active filter category
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ui-ux") return project.category.toLowerCase() === "ui/ux";
    return project.category.toLowerCase() === activeFilter;
  });

  const renderContent = () => {
    if (isLoading) {
      return <PortfolioSkeleton />;
    }

    if (error) {
      return <ErrorState onRetry={retry} />;
    }

    if (filteredProjects.length === 0) {
      return <EmptyPortfolio />;
    }

    return <PortfolioGrid projects={filteredProjects} />;
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-[112px] md:pt-[100px]">
        <PortfolioHero />
        <PortfolioFilters
          currentFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        {renderContent()}
        <PortfolioCTA />
      </main>
      <Footer />
    </>
  );
}


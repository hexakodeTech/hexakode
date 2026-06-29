"use client";

import React, { useMemo } from "react";
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

  // Normalize inputs and filter projects dynamically using useMemo based on the latest projects state
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const filter = activeFilter.toLowerCase().trim();
      const category = (project.category || "").toLowerCase().trim();

      if (filter === "all") return true;
      if (filter === "ui-ux" || filter === "ui/ux") {
        return category === "ui/ux" || category === "ui-ux";
      }
      return category === filter;
    });
  }, [projects, activeFilter]);

  const renderContent = () => {
    if (isLoading) {
      return <PortfolioSkeleton />;
    }

    if (error) {
      return <ErrorState onRetry={retry} />;
    }

    if (filteredProjects.length === 0) {
      return <EmptyPortfolio message="No projects available in this category yet." />;
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

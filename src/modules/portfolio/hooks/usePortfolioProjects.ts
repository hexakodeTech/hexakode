"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicProject } from "../types/portfolio";

export function usePortfolioProjects(initialFilter = "all", initialProjects?: PublicProject[]) {
  const [projects, setProjects] = useState<PublicProject[]>(initialProjects ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(initialProjects === undefined);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/public");
      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }
      const data = await res.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
      } else {
        setError(data.error || "Failed to load portfolio projects.");
      }
    } catch (err: unknown) {
      console.error(err);
      setError("Unable to load portfolio projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialProjects === undefined) {
      Promise.resolve().then(() => {
        fetchProjects();
      });
    }
  }, [fetchProjects, initialProjects]);

  return {
    projects,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    retry: fetchProjects,
  };
}

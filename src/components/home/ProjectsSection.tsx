import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ProjectCard from "../common/ProjectCard";
import { PROJECTS } from "../../constants/home";

export default function ProjectsSection() {
  return (
    <Section id="portfolio" variant="muted" spacing="large">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16">
          <SectionHeading
            badge="PORTFOLIO"
            title="Featured Projects"
            subtitle="A selection of our most impactful work across various industries."
            align="left"
            theme="light"
            className="mb-0 max-w-2xl"
          />
          <Link
            href="#portfolio"
            className="inline-flex items-center text-sm font-semibold text-slate-800 hover:text-sky-600 transition-colors duration-200 group shrink-0"
          >
            View All Work
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

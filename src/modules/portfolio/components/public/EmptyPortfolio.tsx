import React from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface EmptyPortfolioProps {
  message?: string;
}

export default function EmptyPortfolio({ message }: EmptyPortfolioProps) {
  return (
    <Section variant="white" spacing="large">
      <Container className="flex flex-col items-center justify-center text-center py-20">
        <h3 className="font-headline-md text-headline-sm text-on-background mb-4">
          {message || "No Portfolio Projects Yet"}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          {message
            ? "Please select another category or check back later."
            : "We're currently preparing our latest work. Check back soon to see our newest projects."}
        </p>
      </Container>
    </Section>
  );
}

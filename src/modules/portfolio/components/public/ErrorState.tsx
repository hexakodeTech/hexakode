import React from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <Section variant="white" spacing="large">
      <Container className="flex flex-col items-center justify-center text-center py-20">
        <p className="font-headline-sm text-headline-sm text-error mb-4">
          Unable to load portfolio projects.
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Please try again later.
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer"
        >
          Retry
        </button>
      </Container>
    </Section>
  );
}

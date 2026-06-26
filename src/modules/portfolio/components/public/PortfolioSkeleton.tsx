import React from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function PortfolioSkeleton() {
  const SKELETON_ITEMS = [
    { id: 1, cols: "col-span-12 md:col-span-8 h-[500px]" },
    { id: 2, cols: "col-span-12 md:col-span-4 h-[500px]" },
    { id: 3, cols: "col-span-12 md:col-span-4 h-[400px]" },
    { id: 4, cols: "col-span-12 md:col-span-8 h-[400px]" },
    { id: 5, cols: "col-span-12 md:col-span-6 h-[450px]" },
    { id: 6, cols: "col-span-12 md:col-span-6 h-[450px]" },
  ];

  return (
    <Section id="portfolio-skeleton" variant="white" spacing="large" className="overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter w-full">
          {SKELETON_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`${item.cols} bg-surface-container rounded-xl border border-outline-variant/10 animate-pulse`}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

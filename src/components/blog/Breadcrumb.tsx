import React from "react";
import Breadcrumbs, { BreadcrumbItem } from "@/components/common/Breadcrumbs";

export type { BreadcrumbItem };

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  renderJsonLd?: boolean;
}

export default function Breadcrumb({
  items,
  className = "pb-4",
  renderJsonLd = false,
}: BreadcrumbProps) {
  // Ensure Home is prepended if not already present
  const fullItems: BreadcrumbItem[] =
    items[0]?.href === "/"
      ? items
      : [{ label: "Home", href: "/" }, ...items];

  return <Breadcrumbs items={fullItems} className={className} renderJsonLd={renderJsonLd} />;
}

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/config/sanity.config";

export default function StudioPage() {
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      <NextStudio config={config} />
    </div>
  );
}

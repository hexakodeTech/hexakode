"use client";

import React from "react";
import { CoreValue } from "../../types/about";

export default function ValueCard({ value }: { value: CoreValue }) {
  const Icon = value.icon;

  return (
    <div className="bg-surface p-10 rounded-xl border border-outline-variant/30 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 hover:border-secondary/40">
      <div className="w-14 h-14 bg-primary text-on-primary rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-headline-sm text-headline-sm mb-4">{value.title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {value.description}
      </p>
    </div>
  );
}

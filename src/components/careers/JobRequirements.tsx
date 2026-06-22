import React from "react";
import { ChevronRight } from "lucide-react";

interface JobRequirementsProps {
  requirements: string[];
}

export default function JobRequirements({ requirements }: JobRequirementsProps) {
  if (!requirements || requirements.length === 0) return null;
  return (
    <div className="mb-8">
      <h4 className="font-headline-sm text-[16px] text-white font-bold uppercase tracking-wider mb-4 font-headline">
        Requirements
      </h4>
      <ul className="space-y-3">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 font-body">
            <ChevronRight className="w-4 h-4 text-secondary-container shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface JobResponsibilitiesProps {
  responsibilities: string[];
}

export default function JobResponsibilities({ responsibilities }: JobResponsibilitiesProps) {
  if (!responsibilities || responsibilities.length === 0) return null;
  return (
    <div className="mb-8">
      <h4 className="font-headline-sm text-[16px] text-white font-bold uppercase tracking-wider mb-4 font-headline">
        Key Responsibilities
      </h4>
      <ul className="space-y-3">
        {responsibilities.map((resp, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-body">
            <CheckCircle2 className="w-4 h-4 text-secondary-container shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">{resp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

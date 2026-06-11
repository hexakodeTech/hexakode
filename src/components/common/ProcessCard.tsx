import React from "react";
import { ProcessStep } from "../../types/home";

interface ProcessCardProps {
  step: ProcessStep;
  index: number;
}

export default function ProcessCard({ step, index }: ProcessCardProps) {
  const { title, description } = step;

  return (
    <div className="relative bg-white rounded-2xl p-8 border border-slate-100/80 flex flex-col items-center text-center hover-lift hover-glow">
      {/* Circle step number indicator */}
      <div className="w-10 h-10 rounded-full bg-navy-dark text-white flex items-center justify-center font-bold text-sm mb-6 select-none shadow-sm">
        {index + 1}
      </div>
      <h3 className="text-lg font-bold text-navy-dark mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

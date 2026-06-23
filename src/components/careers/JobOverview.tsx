import React from "react";

interface JobOverviewProps {
  description: string;
}

export default function JobOverview({ description }: JobOverviewProps) {
  return (
    <div className="mb-8">
      <h4 className="font-headline-sm text-[16px] text-white font-bold uppercase tracking-wider mb-3 font-headline">
        Role Overview
      </h4>
      <p className="font-body-md text-body-md text-slate-300 leading-relaxed font-body">
        {description}
      </p>
    </div>
  );
}

import React from "react";
import { Tag, MapPin, Clock, Briefcase } from "lucide-react";
import { Job } from "@/types/careers";

interface JobHeaderProps {
  job: Job;
}

export default function JobHeader({ job }: JobHeaderProps) {
  return (
    <div className="border-b border-white/10 pb-6 mb-6">
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        {/* Category Badge */}
        <span className="inline-flex items-center gap-1.5 bg-secondary/20 text-secondary-container font-label-mono text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full font-semibold border border-secondary/30">
          <Tag className="w-3 h-3" aria-hidden="true" />
          {job.category}
        </span>
      </div>

      <h3 id="modal-title" className="font-headline-md text-headline-md md:text-headline-lg text-white font-bold tracking-tight mb-4 font-headline">
        {job.title}
      </h3>

      {/* Meta Specs */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400 font-body">
        <span className="inline-flex items-center gap-2">
          <MapPin className="w-4 h-4 text-secondary-container shrink-0" aria-hidden="true" />
          {job.location}
        </span>
        <span className="h-4 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
        <span className="inline-flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary-container shrink-0" aria-hidden="true" />
          {job.type}
        </span>
        <span className="h-4 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
        <span className="inline-flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-secondary-container shrink-0" aria-hidden="true" />
          {job.experience}
        </span>
      </div>
    </div>
  );
}

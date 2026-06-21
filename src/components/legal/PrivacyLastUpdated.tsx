import React from "react";
import { CalendarDays } from "lucide-react";

interface PrivacyLastUpdatedProps {
  date: string;
}

export default function PrivacyLastUpdated({ date }: PrivacyLastUpdatedProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 w-fit">
      <CalendarDays className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
      <span className="font-body-sm text-body-sm text-on-surface-variant">
        Last updated:{" "}
        <span className="font-semibold text-on-surface">{date}</span>
      </span>
    </div>
  );
}

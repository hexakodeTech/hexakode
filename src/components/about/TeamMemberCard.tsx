"use client";

import React from "react";
import Link from "next/link";
import { TeamMember } from "../../types/about";

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group h-full flex flex-col bg-surface rounded-2xl border border-outline-variant/30 p-8 hover:border-secondary/40 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between gap-4 mb-5">
        <span className="font-label-mono text-xs uppercase tracking-widest text-secondary font-semibold px-3 py-1 rounded-full bg-secondary-container/20 border border-secondary/20">
          {member.isFounder ? "Co-Founder" : "Team"}
        </span>

        {member.socialUrl && (
          <Link
            href={member.socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${member.name}'s LinkedIn profile`}
            className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 transition-all duration-200"
          >
            <LinkedInIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      <h3 className="font-headline-sm text-headline-sm text-primary font-semibold tracking-tight mb-2">
        {member.name}
      </h3>

      <p className="font-label-mono text-xs uppercase tracking-wider text-on-surface-variant/90 mb-5 font-medium">
        {member.role}
      </p>

      {member.bio ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-auto pt-4 border-t border-outline-variant/20">
          {member.bio}
        </p>
      ) : (
        <div className="mt-auto pt-4 border-t border-outline-variant/20">
          <span className="text-xs text-on-surface-variant/70 italic">
            HexaKode team member
          </span>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { TeamMember } from "../../types/about";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group">
      <div className="aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-surface-container relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.imageUrl}
          alt={member.imageAlt}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <div className="flex gap-3">
            <Link
              href={member.socialUrl}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <LinkIcon className="text-white w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <h4 className="font-headline-sm text-headline-sm text-primary mb-1">{member.name}</h4>
      <p className="font-label-mono text-label-mono text-secondary uppercase tracking-widest">{member.role}</p>
    </div>
  );
}

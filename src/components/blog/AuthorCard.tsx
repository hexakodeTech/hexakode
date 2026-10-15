"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AuthorCardProps {
  author: {
    name: string;
    avatar?: string | null;
  };
}

const DEFAULT_AVATAR = "/images/blog-placeholder.svg";

export default function AuthorCard({ author }: AuthorCardProps) {
  const initialUrl =
    typeof author.avatar === "string" && author.avatar.trim() !== ""
      ? author.avatar
      : DEFAULT_AVATAR;

  const [imgSrc, setImgSrc] = useState(initialUrl);

  return (
    <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 w-full">
      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-xs bg-slate-100 flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={author.name || "Author"}
          fill
          sizes="48px"
          className="object-cover"
          unoptimized={imgSrc.startsWith("http")}
          onError={() => setImgSrc(DEFAULT_AVATAR)}
        />
      </div>
      <div className="text-left">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Written by
        </span>
        <p className="text-sm font-bold text-navy-dark leading-tight mt-0.5">
          {author.name || "HexaKode Team"}
        </p>
      </div>
    </div>
  );
}

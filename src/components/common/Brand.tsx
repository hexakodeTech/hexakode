import React from "react";
import { Zen_Dots, Kalam } from "next/font/google";
import { cn } from "@/lib/utils";

const zenDots = Zen_Dots({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const kalam = Kalam({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface BrandProps {
  variant: "navbar" | "footer-desktop" | "footer-mobile";
}

export default function Brand({ variant }: BrandProps) {
  if (variant === "navbar") {
    return (
      <span className={cn(zenDots.className, "text-[1.35rem] md:text-[1.85rem] lg:text-[1.8rem] font-normal leading-none tracking-tight text-primary transition-colors hover:text-secondary")}>
        HexaKode
      </span>
    );
  }

  if (variant === "footer-desktop") {
    return (
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(zenDots.className, "text-white font-normal leading-tight")}
          style={{ fontSize: "1.3rem" }}
        >
          HexaKode
        </span>
        <p
          className={cn(kalam.className, "text-white whitespace-nowrap leading-snug m-0")}
          style={{ fontSize: "0.95rem", opacity: 0.85 }}
        >
          Code That Powers Growth
        </p>
      </div>
    );
  }

  // footer-mobile
  return (
    <>
      <span className={cn(zenDots.className, "text-white font-normal leading-tight text-[1.1rem]")}>
        HexaKode
      </span>
      <p className={cn(kalam.className, "text-white whitespace-nowrap leading-snug m-0 mt-1 text-[0.95rem] font-medium tracking-wide")}>
        Code That Powers Growth
      </p>
    </>
  );
}

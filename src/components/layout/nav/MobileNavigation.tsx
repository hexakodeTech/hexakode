"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { createPortal } from "react-dom";
import Brand from "../../common/Brand";

const MobileDrawer = dynamic(() => import("./MobileDrawer"), { ssr: false });

interface MobileNavigationProps {
  pathname: string;
}

const emptySubscribe = () => () => {};

export default function MobileNavigation({ pathname }: MobileNavigationProps) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  // Track mount state so we never call createPortal before the DOM is available
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Close drawer on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  return (
    <div className="flex lg:hidden items-center justify-between w-full h-[56px] sm:h-[60px]">
      {/* Mobile Header Logo */}
      <Link href="/" className="flex items-center gap-3 group select-none shrink-0">
        <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105 shrink-0">
          <Image
            src="/logo-icon.webp"
            alt="HexaKode Logo"
            fill
            sizes="36px"
            priority
            fetchPriority="high"
            className="object-contain"
          />
        </div>
        <Brand variant="navbar" />
      </Link>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setDrawerOpen(true)}
        type="button"
        className="p-2.5 rounded-lg text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-secondary/20 outline-none"
        aria-label="Open mobile menu"
        aria-expanded={isDrawerOpen}
      >
        <Menu className="w-6 h-6 text-on-surface" />
      </button>

      {/*
        ✅ Portal: MobileDrawer is rendered directly into document.body via createPortal.
        This completely escapes the <header> element's stacking context, which is created
        by backdrop-filter (backdrop-blur-md). Without a portal, any z-index values on
        the drawer children are scoped to the header's stacking context and cannot
        appear above the rest of the page — regardless of how high the z-index value is.
      */}
      {mounted &&
        createPortal(
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setDrawerOpen(false)}
            pathname={pathname}
          />,
          document.body
        )}
    </div>
  );
}

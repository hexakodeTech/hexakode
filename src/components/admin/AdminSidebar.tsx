"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  Settings,
  LogOut,
  X,
  Database,
  Loader2,
  Calendar,
  Ticket,
  Building2,
  FolderKanban,
  Wrench,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Enquiries", path: "/admin/enquiries", icon: Inbox },
    { name: "Demo Requests", path: "/admin/demos", icon: Calendar },
    { name: "Referral Codes", path: "/admin/coupons", icon: Ticket },
    { name: "Clients", path: "/admin/clients", icon: Building2 },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // CMS sub-navigation state
  const isCmsActive = pathname.startsWith("/admin/cms");
  const [cmsExpanded, setCmsExpanded] = useState(isCmsActive);

  const cmsSubItems = [
    { name: "Portfolio", path: "/admin/cms/portfolio", icon: LayoutGrid },
  ];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin");
      } else {
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-surface-container-lowest border-r border-outline-variant/30 py-6 px-4 transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-2 mb-8">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5_VqrmGo0Yyz2eCzbJ2FcbcrPZN_jWkAN6euuVQzxrMkBQ2CfDpOjYWVe3aq_AIEswpv2MS4XO9VgfvgOFIYMSC9rIm3SjEQNwjrtmhhJmp1ft5nzoPat2z9QwmJwgn0zJZJsMIPoV_gQAD4p0NGbbo0TUaWEuuKEfg6nSP7dh7vq5hNBrqxnYyEYRa9qzr-Tg45hOyEIhgvax0BWxfDDB6uswBvAKj-sJbsOilWcd1wIOkM4PBdSVCjBDaXsnpVcMmsk_TKfO8Xk"
              alt="HexaKode Logo"
              className="h-8 w-auto"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-sm font-semibold tracking-tight text-primary leading-none">
                HexaKode
              </span>
              <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded p-1 text-on-surface-variant hover:bg-surface-container md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path === "/admin/clients" && pathname.startsWith("/admin/clients"));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group cursor-pointer ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                }`}
              >
                {/* Active link pill indicator using motion */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 bg-surface-container rounded-lg border-l-2 border-secondary z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-secondary" : "text-on-surface-variant/70"
                  }`}
                />
                <span className="relative z-10 font-body-sm text-[13px]">{item.name}</span>
              </Link>
            );
          })}

          {/* ── CMS Section (expandable) ─────────────────────────── */}
          <button
            onClick={() => setCmsExpanded((v) => !v)}
            className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors group cursor-pointer ${
              isCmsActive
                ? "text-primary font-medium"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            {isCmsActive && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-surface-container rounded-lg border-l-2 border-secondary z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Database
              className={`relative z-10 w-4 h-4 transition-transform group-hover:scale-110 ${
                isCmsActive ? "text-secondary" : "text-on-surface-variant/70"
              }`}
            />
            <span className="relative z-10 font-body-sm text-[13px] flex-1 text-left">CMS</span>
            <ChevronRight
              className={`relative z-10 w-3.5 h-3.5 text-on-surface-variant/50 transition-transform duration-200 ${
                cmsExpanded ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* CMS Sub-items */}
          <AnimatePresence initial={false}>
            {cmsExpanded && (
              <motion.div
                key="cms-sub"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="ml-4 pl-3 border-l border-outline-variant/25 space-y-0.5 py-1">
                  {/* CMS Hub link */}
                  <Link
                    href="/admin/cms"
                    onClick={onClose}
                    className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      pathname === "/admin/cms"
                        ? "text-secondary font-medium bg-surface-container"
                        : "text-on-surface-variant/70 hover:text-primary hover:bg-surface-container-low"
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span className="font-body-sm text-[12px]">CMS Hub</span>
                  </Link>

                  {/* Dynamic sub-items */}
                  {cmsSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = pathname.startsWith(sub.path);
                    return (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        onClick={onClose}
                        className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          isSubActive
                            ? "text-secondary font-medium bg-surface-container"
                            : "text-on-surface-variant/70 hover:text-primary hover:bg-surface-container-low"
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5" />
                        <span className="font-body-sm text-[12px]">{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Footer / Logout Section */}
        <div className="pt-4 border-t border-outline-variant/20">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-colors group cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-error" />
            ) : (
              <LogOut className="w-4 h-4 text-on-surface-variant/70 group-hover:text-error transition-colors" />
            )}
            <span className="font-body-sm text-[13px]">
              {isLoggingOut ? "Ending Session..." : "Logout Session"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

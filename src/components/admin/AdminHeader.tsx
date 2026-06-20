"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic formatting of date on mount
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const timer = setTimeout(() => {
      setCurrentDate(new Date().toLocaleDateString("en-US", options));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Compute dynamic title based on path
  const getPageTitle = () => {
    const section = pathname.split("/").pop();
    if (!section || section === "admin") return "Overview";
    return section.charAt(0).toUpperCase() + section.slice(1);
  };

  const notifications = [
    { id: 1, text: "New project enquiry received from Nexis Corp", time: "10m ago" },
    { id: 2, text: "Client Sarah Jenkins left a 5-star review", time: "2h ago" },
    { id: 3, text: "System security audit completed successfully", time: "1d ago" },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-md px-6 shadow-sm">
      {/* Page Title & Mobile Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded p-1.5 text-on-surface-variant hover:bg-surface-container md:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex flex-col">
          <h1 className="font-headline-sm text-[16px] font-semibold text-primary leading-none">
            {getPageTitle()}
          </h1>
          <span className="font-label-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wide mt-1">
            {currentDate || "Admin Console"}
          </span>
        </div>
      </div>

      {/* Utilities: Search, Notification, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Field */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-64 bg-surface-container-low/60 border border-outline-variant/30 rounded-lg pl-9 pr-4 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all placeholder:text-outline/40"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />
              <div className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-premium">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2 mb-2">
                  <span className="font-label-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    Recent Activity
                  </span>
                  <span className="text-[9px] text-secondary cursor-pointer hover:underline">
                    Clear all
                  </span>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="text-[12px] leading-snug">
                      <p className="text-on-surface">{notif.text}</p>
                      <span className="text-[10px] text-on-surface-variant/50">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary font-semibold text-xs border border-outline-variant/40">
            HK
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-primary">Lead Architect</span>
            <span className="font-label-mono text-[9px] text-on-surface-variant/60 uppercase">
              Superuser
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

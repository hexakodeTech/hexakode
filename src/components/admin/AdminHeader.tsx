"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, Search, LogOut, User, Shield } from "lucide-react";
import { getAdminUserProfile } from "@/lib/auth/actions";
import { logoutAction } from "@/lib/auth/actions";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

interface HeaderProps {
  onMenuToggle: () => void;
}

interface AdminProfile {
  name: string;
  email: string;
  status: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Generate up to 2-letter initials from a full name or email. */
function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    // Use first letter of first word + first letter of last word
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  // Fall back to first letter of email local part
  return email ? email[0].toUpperCase() : "A";
}

/** Map UserStatus → human-readable role label. */
function getRoleLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Administrator";
    case "SUSPENDED":
      return "Suspended";
    case "INACTIVE":
      return "Inactive";
    default:
      return "Admin";
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Skeleton sub-component
// ──────────────────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-4 animate-pulse">
      {/* Avatar circle skeleton */}
      <div className="h-8 w-8 rounded-full bg-surface-container-low/70" />
      <div className="hidden lg:flex flex-col gap-1.5">
        <div className="h-2.5 w-20 rounded bg-surface-container-low/70" />
        <div className="h-2 w-14 rounded bg-surface-container-low/50" />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Profile Dropdown
// ──────────────────────────────────────────────────────────────────────────────

interface ProfileDropdownProps {
  profile: AdminProfile;
  onClose: () => void;
}

function ProfileDropdown({ profile, onClose }: ProfileDropdownProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutAction();
    // logoutAction does redirect — this is a safety fallback
    router.push("/admin");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-transparent"
        aria-hidden="true"
      />

      {/* Dropdown panel */}
      <div
        role="menu"
        aria-label="Profile menu"
        className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-premium overflow-hidden"
      >
        {/* Accent top bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-secondary to-secondary-container" />

        {/* User info block */}
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <p className="font-label-mono text-[9px] uppercase tracking-widest text-on-surface-variant/50 mb-2">
            Logged in as
          </p>
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-bold text-sm border border-outline-variant/40">
              {getInitials(profile.name, profile.email)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary truncate leading-tight">
                {profile.name || profile.email}
              </p>
              <p className="text-[11px] text-on-surface-variant/70 truncate mt-0.5">
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        {/* Role & status row */}
        <div className="px-5 py-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span className="text-xs font-semibold text-on-surface">
              {getRoleLabel(profile.status)}
            </span>
            <span
              className={`ml-auto text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                profile.status === "ACTIVE"
                  ? "bg-secondary-container/20 text-on-secondary-container"
                  : "bg-surface-container text-on-surface-variant/60"
              }`}
            >
              {profile.status}
            </span>
          </div>
        </div>

        {/* Profile link row */}
        <div className="px-2 py-1.5">
          <button
            role="menuitem"
            onClick={() => onClose()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-on-surface-variant hover:bg-surface-container-low/70 hover:text-primary transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Profile &amp; Account</span>
          </button>
        </div>

        {/* Divider + Logout */}
        <div className="border-t border-outline-variant/20 px-2 py-1.5">
          <button
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-error/80 hover:bg-error/5 hover:text-error transition-colors cursor-pointer disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{loggingOut ? "Signing out…" : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────────────────

export default function AdminHeader({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  // ── Date formatting (client-only to avoid hydration mismatch) ──
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

  // ── Fetch authenticated user profile ──
  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const data = await getAdminUserProfile();
        if (!cancelled) {
          setProfile(data ?? null);
        }
      } catch {
        // Silently fail — header won't crash if auth fetch errors
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  // ── Close profile dropdown on outside click ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  // ── Dynamic page title from path ──
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

  // Derived display values (only used when profile is available)
  const initials = profile ? getInitials(profile.name, profile.email) : "";
  const roleLabel = profile ? getRoleLabel(profile.status) : "";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-md px-6 shadow-sm">
      {/* Page Title & Mobile Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded p-1.5 text-on-surface-variant hover:bg-surface-container md:hidden cursor-pointer"
          aria-label="Toggle sidebar"
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

      {/* Utilities: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Field */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search resources..."
            aria-label="Search admin resources"
            className="w-64 bg-surface-container-low/60 border border-outline-variant/30 rounded-lg pl-9 pr-4 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all placeholder:text-outline/40"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Toggle notifications"
            aria-expanded={showNotifications}
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
                aria-hidden="true"
              />
              <div
                className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-premium"
                role="dialog"
                aria-label="Notifications"
              >
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

        {/* ── Profile Section ── */}
        <div className="relative" ref={profileRef}>
          {profileLoading ? (
            <ProfileSkeleton />
          ) : (
            <button
              id="admin-profile-trigger"
              onClick={() => setShowProfile((prev) => !prev)}
              aria-expanded={showProfile}
              aria-haspopup="menu"
              aria-label="Open profile menu"
              className="flex items-center gap-2 border-l border-outline-variant/30 pl-4 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 rounded-lg"
            >
              {/* Avatar */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-bold text-xs border border-outline-variant/40 transition-transform group-hover:scale-105 group-hover:shadow-sm">
                {profile ? initials : "—"}
              </div>

              {/* Name + role (large screens only) */}
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-primary leading-tight truncate max-w-[120px]">
                  {profile?.name || profile?.email || "Admin"}
                </span>
                <span className="font-label-mono text-[9px] text-on-surface-variant/60 uppercase tracking-wide mt-0.5">
                  {roleLabel || "Admin"}
                </span>
              </div>
            </button>
          )}

          {/* Profile Dropdown */}
          {showProfile && profile && (
            <ProfileDropdown
              profile={profile}
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}

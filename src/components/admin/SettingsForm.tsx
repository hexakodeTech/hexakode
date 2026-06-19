"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Sliders,
  Save,
  Loader2,
  Clock,
  Palette,
  Activity,
  Info,
  CheckCircle2
} from "lucide-react";

export default function SettingsForm() {
  // State variables for operational settings
  const [enquiriesPerPage, setEnquiriesPerPage] = useState("25");
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [accentColor, setAccentColor] = useState("secondary"); // secondary, emerald, indigo, orange
  const [cacheTtl, setCacheTtl] = useState("300"); // seconds
  const [logLevel, setLogLevel] = useState("info"); // debug, info, warn, error

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate system update delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success("System configurations updated successfully", {
        description: "Console variables and operations parameters are active.",
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Console Settings & Admin Preferences */}
        <div className="space-y-6">
          {/* Section 1: Console Settings */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-card hover:border-outline-variant/50 transition-all duration-300 space-y-4">
            <div className="border-b border-outline-variant/20 pb-3 mb-2 flex items-center gap-2 text-primary">
              <Sliders className="w-4 h-4 text-secondary" />
              <h3 className="font-headline-sm text-sm font-semibold">Console Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">
                  Enquiries Per Page
                </label>
                <select
                  value={enquiriesPerPage}
                  onChange={(e) => setEnquiriesPerPage(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 font-medium cursor-pointer"
                >
                  <option value="10">10 Enquiries</option>
                  <option value="25">25 Enquiries</option>
                  <option value="50">50 Enquiries</option>
                  <option value="100">100 Enquiries</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-1">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-primary">
                    Email Notifications
                  </span>
                  <span className="text-[10px] text-on-surface-variant/70 mt-0.5 font-body-sm">
                    Receive alert emails for new lead entries.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableEmailNotifications}
                    onChange={(e) => setEnableEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-outline-variant/35 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Admin Preferences */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-card hover:border-outline-variant/50 transition-all duration-300 space-y-4">
            <div className="border-b border-outline-variant/20 pb-3 mb-2 flex items-center gap-2 text-primary">
              <Palette className="w-4 h-4 text-secondary" />
              <h3 className="font-headline-sm text-sm font-semibold">Console Preferences</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">
                  Theme Accent Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "secondary", label: "Blue", color: "bg-[#006688]" },
                    { id: "emerald", label: "Teal", color: "bg-emerald-600" },
                    { id: "indigo", label: "Indigo", color: "bg-indigo-600" },
                    { id: "orange", label: "Orange", color: "bg-orange-500" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setAccentColor(theme.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        accentColor === theme.id
                          ? "border-secondary bg-secondary/5 text-primary"
                          : "border-outline-variant/20 bg-surface-container-low/40 text-on-surface-variant/75 hover:bg-surface-container-low"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${theme.color} mb-1`} />
                      <span className="text-[10px]">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">
                  Session Timeout Limit
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 font-medium cursor-pointer"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="240">4 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: System Parameters & Environment Metadata */}
        <div className="space-y-6">
          {/* Section 3: System Configuration */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-card hover:border-outline-variant/50 transition-all duration-300 space-y-4">
            <div className="border-b border-outline-variant/20 pb-3 mb-2 flex items-center gap-2 text-primary">
              <Activity className="w-4 h-4 text-secondary" />
              <h3 className="font-headline-sm text-sm font-semibold">System Parameters</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold">
                    API Cache TTL
                  </label>
                  <span className="text-[10px] text-secondary font-mono font-semibold">{cacheTtl}s</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="3600"
                  step="60"
                  value={cacheTtl}
                  onChange={(e) => setCacheTtl(e.target.value)}
                  className="w-full accent-secondary cursor-pointer h-1.5 bg-surface-container-low rounded-lg appearance-none"
                />
                <span className="text-[9px] text-on-surface-variant/55 block mt-1 font-body-sm">
                  Controls page query payload caching TTL in seconds.
                </span>
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">
                  Diagnostic Log Level
                </label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 font-medium cursor-pointer"
                >
                  <option value="debug">Debug (All events)</option>
                  <option value="info">Info (Standard operations)</option>
                  <option value="warn">Warning (Non-critical faults)</option>
                  <option value="error">Error (System failures)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Telemetry & Environment Metadata */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-card hover:border-outline-variant/50 transition-all duration-300 space-y-4">
            <div className="border-b border-outline-variant/20 pb-3 mb-2 flex items-center gap-2 text-primary">
              <Info className="w-4 h-4 text-secondary" />
              <h3 className="font-headline-sm text-sm font-semibold">Environment Telemetry</h3>
            </div>

            <div className="space-y-3 font-mono text-[10px] text-on-surface-variant/80">
              <div className="flex justify-between py-0.5">
                <span className="text-on-surface-variant/55">Node.js Version</span>
                <span className="font-semibold text-primary">v24.14.0</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-on-surface-variant/55">Next.js Framework</span>
                <span className="font-semibold text-primary">16.2.9</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-on-surface-variant/55">Active Environment</span>
                <span className="font-semibold text-secondary capitalize">production</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-on-surface-variant/55">API Cache Engine</span>
                <div className="flex items-center gap-1.5 text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Submit Panel */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold text-xs px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-80"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

import React from "react";
import { Globe2, ExternalLink, CheckCircle2 } from "lucide-react";
import { GOOGLE_BUSINESS_PROFILE_URL } from "../../constants/contact";
import { cn } from "../../lib/utils";

export default function MapCard({ isDark = false }: { isDark?: boolean }) {
  return (
    <div
      className={cn(
        "p-6 md:p-8 rounded-xl border transition-all duration-300 ease-out flex flex-col justify-between",
        isDark
          ? "glass-details-premium text-white border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:border-[#5dcafd]/30"
          : "glass-card text-on-background border border-outline-variant/10 shadow-sm hover:border-secondary/20"
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark ? "bg-white/10 text-[#5dcafd]" : "bg-primary/10 text-primary"
              )}
            >
              <Globe2 className="w-5 h-5" />
            </span>
            <span
              className={cn(
                "font-label-mono text-xs uppercase tracking-wider",
                isDark ? "text-slate-400" : "text-on-surface-variant"
              )}
            >
              Service Area
            </span>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full",
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            )}
          >
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        </div>

        <p
          className={cn(
            "font-headline-sm text-lg md:text-xl font-bold mb-2 transition-colors",
            isDark ? "text-white" : "text-primary"
          )}
        >
          Kerala, India
        </p>

        <p
          className={cn(
            "font-body-sm text-xs leading-relaxed mb-6 transition-colors",
            isDark ? "text-slate-300" : "text-on-surface-variant"
          )}
        >
          HexaKode operates as a remote-first engineering practice delivering custom web applications, mobile apps, and digital solutions for clients across Kerala and globally. We do not operate a physical walk-in office.
        </p>
      </div>

      <a
        href={GOOGLE_BUSINESS_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 w-full group",
          isDark
            ? "bg-white/10 text-[#5dcafd] hover:bg-white/15 hover:text-white border border-white/10"
            : "bg-primary text-white hover:bg-primary-hover shadow-sm"
        )}
      >
        <span>View Google Business Profile</span>
        <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}

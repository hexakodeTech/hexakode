import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import { CONTACT_DETAILS, GOOGLE_BUSINESS_PROFILE_URL } from "../../constants/contact";
import { cn } from "../../lib/utils";

export default function ContactDetailsCard({ isDark = false }: { isDark?: boolean }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-5 h-5 text-secondary" strokeWidth={1.5} />;
      case "phone":
        return <Phone className="w-5 h-5 text-secondary" strokeWidth={1.5} />;
      case "location":
        return <MapPin className="w-5 h-5 text-secondary" strokeWidth={1.5} />;
      case "website":
        return <Globe className="w-5 h-5 text-secondary" strokeWidth={1.5} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "p-8 rounded-xl transition-all duration-300 ease-out border",
        isDark
          ? "glass-details-premium text-white border-0"
          : "glass-card text-on-background border border-outline-variant/10 hover:border-secondary/20 shadow-sm"
      )}
    >
      <h3
        className={cn(
          "font-headline-sm text-headline-sm mb-6 transition-colors duration-500",
          isDark ? "text-white" : "text-primary"
        )}
      >
        Contact Details
      </h3>
      <ul className="space-y-6">
        {CONTACT_DETAILS.map((detail) => (
          <li key={detail.id} className="flex gap-4 group">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110",
                isDark
                  ? "bg-white/10 text-secondary-container"
                  : "bg-secondary-container/20 text-on-secondary-container"
              )}
            >
              {getIcon(detail.type)}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  "font-label-mono text-label-mono uppercase mb-1 transition-colors duration-500",
                  isDark ? "text-slate-400" : "text-on-surface-variant"
                )}
              >
                {detail.label}
              </p>
              {detail.type === "location" ? (
                <div>
                  <span
                    className={cn(
                      "font-semibold block transition-colors duration-500",
                      isDark ? "text-white" : "text-on-surface"
                    )}
                  >
                    {detail.value}
                  </span>
                  {detail.description && (
                    <span
                      className={cn(
                        "text-xs block mt-1 transition-colors duration-500",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}
                    >
                      {detail.description}
                    </span>
                  )}
                </div>
              ) : (
                <a
                  className={cn(
                    "font-semibold hover:underline break-all transition-colors duration-500 block",
                    isDark ? "text-secondary-container" : "text-secondary"
                  )}
                  href={detail.href}
                  target={detail.isExternal ? "_blank" : undefined}
                  rel={detail.isExternal ? "noopener noreferrer" : undefined}
                >
                  {detail.value}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Google Business Profile Action Link */}
      <div className="pt-6 mt-6 border-t border-outline-variant/10">
        <a
          href={GOOGLE_BUSINESS_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center justify-between w-full p-3.5 rounded-lg border text-xs font-semibold transition-all duration-300 group",
            isDark
              ? "bg-white/5 border-white/10 text-[#5dcafd] hover:bg-white/10 hover:text-white"
              : "bg-slate-50 border-slate-200 text-primary hover:bg-slate-100"
          )}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>View Google Business Profile</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
}

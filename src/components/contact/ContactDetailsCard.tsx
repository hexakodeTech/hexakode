import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { CONTACT_DETAILS } from "../../constants/contact";
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
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "p-8 rounded-xl shadow-sm transition-all duration-700 hover:shadow-premium-hover border",
        isDark
          ? "glass-panel-dark text-white border-white/10 hover:border-secondary/30"
          : "glass-card text-on-background border-outline-variant/10 hover:border-secondary/20"
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
            <div>
              <p
                className={cn(
                  "font-label-mono text-label-mono uppercase mb-1 transition-colors duration-500",
                  isDark ? "text-slate-400" : "text-on-surface-variant"
                )}
              >
                {detail.label}
              </p>
              {detail.type === "location" ? (
                <span
                  className={cn(
                    "font-semibold transition-colors duration-500",
                    isDark ? "text-white" : "text-on-surface"
                  )}
                >
                  {detail.value}
                </span>
              ) : (
                <a
                  className={cn(
                    "font-semibold hover:underline break-all transition-colors duration-500",
                    isDark ? "text-secondary-container" : "text-secondary"
                  )}
                  href={detail.href}
                >
                  {detail.value}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

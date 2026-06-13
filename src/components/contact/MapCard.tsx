import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "../../lib/utils";

export default function MapCard({ isDark = false }: { isDark?: boolean }) {
  return (
    <div
      className={cn(
        "relative h-64 w-full rounded-xl overflow-hidden shadow-sm group border",
        isDark ? "border-white/5" : "border-outline-variant/10"
      )}
    >
      <img
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt="HexaKode Kerala Office location"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcAJBvF9MPRq1rH2eMQw1PL04B4NaIAfUt9y3O81m_sBpTiadM10sL5PBN2DbRrOaub6nHj78Pddv0_v6zSdHDGS5uYQRFOfG_16vivhWkzsTLRqy7KjUuzIeV2t8jqHJ1N8M02cf4MOn0_WbhJfcMe6aaVhFuXsyKFqYvt9wWTIeqhuG_r9m3sH7Wn4RH-z297l1uX1MPXFhEfzy0ycxScjXoHHdar5JX5gkbv-3i6-vP_DNpLFyJ2Ti1j_WDoMrmL-Q8ZnK3WkJW"
      />
      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/30">
        <div
          className={cn(
            "p-4 rounded-full shadow-lg border transition-transform duration-300 group-hover:scale-110",
            isDark ? "bg-slate-900 border-white/10" : "bg-surface border-outline-variant"
          )}
        >
          <MapPin className="w-6 h-6 text-secondary fill-secondary/20" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-primary-container/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/10">
        <span className="font-label-mono text-[10px] text-white tracking-wider uppercase">Kerala, India</span>
      </div>
    </div>
  );
}

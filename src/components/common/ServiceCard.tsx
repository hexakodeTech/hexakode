import React from "react";
import * as Icons from "lucide-react";
import { Service } from "../../types/home";
import { cn } from "../../lib/utils";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, tags, highlighted, iconName, id } = service;
  
  // Dynamically resolve Lucide Icon
  const IconComponent = (Icons[iconName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{
    className?: string;
  }>;

  if (highlighted) {
    // Custom Software wide layout card (dark background, dashboard visual graphic on the right)
    return (
      <div
        className={cn(
          "col-span-1 md:col-span-2 bg-[#0b1329] text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] shadow-premium hover:shadow-premium-hover border border-white/5",
          "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.15),transparent_50%)] after:pointer-events-none"
        )}
      >
        <div className="flex-1 max-w-lg z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
              <IconComponent className="w-5 h-5" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h3>
          </div>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href="#contact"
            className="inline-flex items-center text-secondary hover:text-primary text-sm font-semibold transition-colors duration-200 group"
          >
            Learn More
            <Icons.ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Dashboard mock visual graphic on the right side of wide card */}
        <div className="w-full md:w-72 h-36 bg-[#0f1b36] rounded-xl border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden select-none shadow-inner shrink-0 z-10">
          <div className="space-y-2">
            <div className="h-2 w-1/3 bg-slate-700/60 rounded-full" />
            <div className="h-1.5 w-3/4 bg-slate-700/40 rounded-full" />
            <div className="h-1.5 w-1/2 bg-slate-700/40 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-secondary font-mono">
              <span>PROTOTYPE_LOADED</span>
              <span>85%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-secondary rounded-full shadow-glow-blue animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // API & Cloud is a gray tinted card, standard size
  if (id === "api-cloud") {
    return (
      <div className="bg-[#e2e8f0]/60 text-slate-900 rounded-2xl p-8 flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:translate-y-[-4px] shadow-premium hover:shadow-premium-hover border border-slate-200/50">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-slate-900/5 text-slate-800 border border-slate-900/10">
              <IconComponent className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-navy-dark tracking-tight">{title}</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {description}
          </p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-900/5 border border-slate-950/5 text-slate-700 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Standard light layout card
  return (
    <div className="bg-white text-slate-900 rounded-2xl p-8 flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:translate-y-[-4px] shadow-card hover:shadow-premium-hover border border-slate-100 hover:border-slate-200/60">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-secondary-container text-primary border border-secondary-container/50">
            <IconComponent className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-navy-dark tracking-tight">{title}</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

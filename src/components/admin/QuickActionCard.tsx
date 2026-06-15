import React from "react";
import { LucideIcon, ArrowRight } from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  actionText: string;
  icon: LucideIcon;
  onClick: () => void;
}

export default function QuickActionCard({
  title,
  description,
  actionText,
  icon: Icon,
  onClick,
}: QuickActionProps) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col justify-between p-5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:border-secondary/35 hover:shadow-premium transition-all duration-300 cursor-pointer text-left"
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-surface-container p-2 text-on-surface-variant group-hover:bg-secondary-container/20 group-hover:text-secondary transition-colors duration-300">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-headline-sm text-sm font-semibold text-primary">{title}</h3>
        </div>
        <p className="mt-3 text-xs text-on-surface-variant/70 leading-relaxed font-body-sm">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300">
        <span>{actionText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

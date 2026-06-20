"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import Card from "../ui/Card";

interface BenefitsCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export default function BenefitsCard({
  title,
  description,
  icon: Icon,
  className,
}: BenefitsCardProps) {
  return (
    <Card
      variant="light"
      className={cn("p-6 hover:border-secondary/30", className)}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary-container/20 text-secondary rounded-lg shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-headline-sm text-[18px] text-on-background mb-2">
            {title}
          </h4>
          <p className="text-on-surface-variant text-body-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

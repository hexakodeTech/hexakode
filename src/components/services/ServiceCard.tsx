"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tags?: string[];
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  largeLayout?: boolean; // If true, represents the 8-col landscape layout
  className?: string;
}

export default function ServiceCard({
  title,
  description,
  icon: Icon,
  tags = [],
  href,
  imageSrc,
  imageAlt = "Service illustration",
  largeLayout = false,
  className,
}: ServiceCardProps) {
  const cardContent = (
    <div className={cn("flex h-full flex-col", largeLayout ? "md:flex-row gap-8 justify-between" : "")}>
      <div className={cn("flex-1 flex flex-col justify-between h-full", largeLayout ? "max-w-lg" : "")}>
        <div>
          {/* Animated bouncing icon container on card hover */}
          <motion.div
            className="text-secondary mb-6 inline-block"
            variants={{
              hover: { y: -8 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Icon className="w-10 h-10" />
          </motion.div>

          <h3 className="text-headline-sm font-headline-sm mb-4 text-on-background">
            {title}
          </h3>

          <p className="text-on-surface-variant mb-6 text-body-md leading-relaxed">
            {description}
          </p>
        </div>

        <div>
          {/* Tags list */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag) => (
                <Badge key={tag} variant="mono-tag">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Learn More Action Link */}
          <Link
            href={href}
            className="text-secondary font-label-mono text-label-mono inline-flex items-center gap-2 group/link transition-all duration-300 hover:text-primary-container"
          >
            {largeLayout ? "View Details" : "Details"}{" "}
            <motion.span
              variants={{
                hover: { x: 4 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>
      </div>

      {/* Large layout image element */}
      {largeLayout && imageSrc && (
        <div className="flex-1 hidden md:block overflow-hidden rounded-lg relative min-h-[220px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      whileHover="hover"
      className={cn(
        "h-full",
        largeLayout ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4",
        className
      )}
    >
      <Card
        variant="light"
        className="p-8 h-full border-outline-variant/30 hover:border-secondary/40"
      >
        {cardContent}
      </Card>
    </motion.div>
  );
}

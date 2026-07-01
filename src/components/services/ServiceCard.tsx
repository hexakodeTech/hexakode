"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
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
  className?: string;
}

export default function ServiceCard({
  title,
  description,
  icon: Icon,
  tags = [],
  imageSrc,
  imageAlt = "Service illustration",
  className,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover="hover"
      className={cn("h-full flex flex-col", className)}
    >
      <Card
        variant="light"
        className="h-full border-outline-variant/30 hover:border-secondary/40 flex flex-col overflow-hidden"
      >
        {/* Card Header Image */}
        {imageSrc && (
          <div className="relative w-full aspect-[16/10] overflow-hidden border-b border-outline-variant/10">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={title === "Web Engineering"}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        {/* Card Content Area */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
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

          <div className="mt-auto">
            {/* Tags list */}
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <Badge key={tag} variant="mono-tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              // Empty spacer to align the CTA link consistently if there are no tags
              <div className="h-[26px] mb-6" />
            )}

            {/* Learn More Action Link */}
            {/* <Link
              href={href}
              className="text-secondary font-label-mono text-label-mono inline-flex items-center gap-2 group/link transition-all duration-300 hover:text-primary-container"
            >
              Details{" "}
              <motion.span
                variants={{
                  hover: { x: 4 },
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link> */}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

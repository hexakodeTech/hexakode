"use client";

import React from "react";
import { FAQItem } from "../../types/contact";

interface FAQCardProps {
  faq: FAQItem;
}

export default function FAQCard({ faq }: FAQCardProps) {
  return (
    <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 transition-all duration-300 hover:border-secondary/20 hover:bg-white dark:hover:bg-background/20 hover:shadow-premium-hover flex flex-col justify-start">
      <h4 className="font-headline-sm text-[20px] mb-3 text-primary tracking-tight">
        {faq.question}
      </h4>
      <p className="text-on-surface-variant font-body-md leading-relaxed">
        {faq.answer}
      </p>
    </div>
  );
}

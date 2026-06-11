import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "dark" | "blue" | "white";
  showArrow?: boolean;
}

export default function PrimaryButton({
  children,
  href,
  variant = "dark",
  showArrow = false,
  className,
  ...props
}: PrimaryButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-[250ms] ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] cursor-pointer gap-2";

  const variantClasses = {
    dark: "bg-navy-dark text-white btn-gradient-hover focus:ring-navy-dark",
    blue: "bg-secondary text-white btn-gradient-hover focus:ring-secondary shadow-sm",
    white: "bg-white text-navy-dark hover:translate-y-[-2px] hover:bg-slate-50 hover:shadow-premium focus:ring-white shadow-sm",
  };

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, variantClasses[variant], "group", className)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cn(baseClasses, variantClasses[variant], "group", className)} {...props}>
      {content}
    </button>
  );
}

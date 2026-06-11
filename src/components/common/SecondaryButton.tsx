import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "light" | "dark";
}

export default function SecondaryButton({
  children,
  href,
  variant = "light",
  className,
  ...props
}: SecondaryButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-[250ms] ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] cursor-pointer gap-2 border";

  const variantClasses = {
    light: "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 hover:translate-y-[-2px] hover:shadow-premium focus:ring-slate-200",
    dark: "border-white/10 text-white bg-white/5 hover:bg-white/10 hover:translate-y-[-2px] hover:shadow-premium focus:ring-white/20",
  };

  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, variantClasses[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}

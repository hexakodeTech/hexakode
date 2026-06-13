import React, { forwardRef, useState } from "react";
import { cn } from "../../lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isDark?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, id, onFocus, onBlur, isDark = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div className="space-y-2 flex flex-col w-full">
        <label
          htmlFor={id}
          className={cn(
            "font-label-mono text-label-mono uppercase transition-colors duration-200 self-start cursor-pointer",
            isFocused
              ? "text-secondary font-semibold"
              : isDark
              ? "text-slate-400"
              : "text-on-surface-variant"
          )}
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "w-full border rounded-lg px-4 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all outline-none duration-200",
            isDark
              ? "bg-white/5 text-white focus:shadow-[0_0_0_4px_rgba(93,202,253,0.1)]"
              : "bg-surface-container-lowest text-on-surface focus:shadow-[0_0_0_4px_rgba(93,202,253,0.2)]",
            error
              ? "border-error"
              : isDark
              ? "border-white/10"
              : "border-outline-variant/65",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-error font-body-sm mt-1 text-left">{error}</span>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

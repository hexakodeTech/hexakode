import React, { forwardRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  isDark?: boolean;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, placeholder, error, className, id, onFocus, onBlur, isDark = false, children, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
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
        <div className="relative w-full">
          <select
            id={id}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "w-full border rounded-lg pl-4 pr-10 py-3 font-body-md focus:border-secondary focus:ring-0 transition-all outline-none appearance-none cursor-pointer duration-200",
              isDark
                ? "bg-[#1f2937] text-white focus:shadow-[0_0_0_4px_rgba(93,202,253,0.1)]"
                : "bg-surface-container-lowest text-on-surface focus:shadow-[0_0_0_4px_rgba(93,202,253,0.2)]",
              error
                ? "border-error"
                : isDark
                ? "border-white/10"
                : "border-outline-variant/65",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-on-surface-variant/80">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <span className="text-error font-body-sm mt-1 text-left">{error}</span>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;

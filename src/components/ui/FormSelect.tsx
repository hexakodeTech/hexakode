import React, { forwardRef, useState, useEffect, useRef } from "react";
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
  ({ label, options, placeholder, error, className, id, onFocus, onBlur, isDark = false, value, defaultValue, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>((value || defaultValue || "") as string);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);

    // Sync state with incoming value from parent / react-hook-form
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value as string);
      }
    }, [value]);

    // Handle outside clicks to close the dropdown
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleOutsideClick);
      }
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [isOpen]);

    const handleSelectOption = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);

      // Trigger standard change event on the hidden native select element
      if (selectRef.current) {
        selectRef.current.value = optionValue;
        
        // Dispatch event so react-hook-form captures it
        const event = new Event("change", { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }
    };

    // Find label of selected value
    const selectedOption = options.find((o) => o.value === selectedValue);
    const displayLabel = selectedOption ? selectedOption.label : (placeholder || "Select option");

    // Handle keyboard accessibility on trigger button
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (props.disabled) return;
      
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    // Handle keyboard accessibility on options list
    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, optionValue: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelectOption(optionValue);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    return (
      <div className="space-y-2 flex flex-col w-full relative" ref={containerRef}>
        <label
          htmlFor={id}
          className={cn(
            "font-label-mono text-label-mono uppercase transition-colors duration-200 self-start cursor-pointer",
            isFocused || isOpen
              ? "text-secondary font-semibold"
              : isDark
              ? "text-slate-400"
              : "text-on-surface-variant"
          )}
          onClick={() => {
            const trigger = document.getElementById(`${id}-trigger`);
            if (trigger) trigger.focus();
          }}
        >
          {label}
        </label>
        
        <div className="relative w-full">
          {/* Hidden native select for React Hook Form integration */}
          <select
            id={id}
            ref={(node) => {
              selectRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
              }
            }}
            value={selectedValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              if (props.onChange) props.onChange(e);
            }}
            className="sr-only"
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

          {/* Custom Dropdown Trigger Button */}
          <button
            id={`${id}-trigger`}
            type="button"
            disabled={props.disabled}
            onClick={() => setIsOpen(!isOpen)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={cn(
              "w-full border rounded-lg pl-4 pr-10 py-3 font-body-md text-left transition-all outline-none appearance-none cursor-pointer duration-250 ease-out flex items-center justify-between",
              isDark
                ? "glass-input-premium text-white"
                : "bg-surface-container-lowest text-on-surface border-outline-variant/65",
              (isFocused || isOpen) && (
                isDark 
                  ? "border-secondary ring-2 ring-secondary/20" 
                  : "border-secondary shadow-[0_0_0_4px_rgba(93,202,253,0.2)]"
              ),
              error && "border-error focus:border-error",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <span className={cn(
              "truncate",
              !selectedOption && (isDark ? "text-slate-400" : "text-outline/60")
            )}>
              {displayLabel}
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-on-surface-variant/80 transition-transform duration-200 flex-shrink-0 ml-2",
              isOpen && "transform rotate-180"
            )} />
          </button>

          {/* Custom Dropdown Options Menu */}
          {isOpen && !props.disabled && (
            <div
              className={cn(
                "absolute top-full left-0 w-full mt-1.5 z-50 rounded-lg border shadow-premium max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150",
                isDark
                  ? "glass-form-premium border-outline-variant/30 text-white"
                  : "bg-surface-container-lowest border-outline-variant/60 text-on-surface"
              )}
              role="listbox"
            >
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(option.value)}
                    onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-xs transition-colors duration-150 cursor-pointer flex items-center justify-between border-l-2",
                      isSelected
                        ? (isDark 
                            ? "bg-secondary-container/20 text-white font-semibold border-secondary-container" 
                            : "bg-secondary-container/10 text-secondary-container font-semibold border-secondary-container")
                        : "border-transparent",
                      isDark
                        ? "text-slate-200 hover:bg-secondary-container/20 hover:text-white"
                        : "text-on-surface hover:bg-secondary-container hover:text-on-secondary-container"
                    )}
                  >
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
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

import React from "react";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({ label, id, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label htmlFor={id} className="font-headline-sm text-sm text-slate-300 font-medium select-none">
        {label} {required && <span className="text-[#5dcafd] font-bold">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-[#5dcafd] mt-1 font-medium select-none">{error}</span>}
    </div>
  );
}

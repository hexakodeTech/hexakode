import React, { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface ResumeUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function ResumeUpload({ file, onChange, error }: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Check size limit: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("Resume file size must be less than 10MB.");
      return;
    }

    onChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const selectedFile = e.dataTransfer.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <span className="font-headline-sm text-sm text-slate-300 font-medium select-none">
        Resume / CV <span className="text-[#5dcafd] font-bold">*</span>
      </span>

      {file ? (
        <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-secondary-container shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{file.name}</p>
              <p className="text-xs text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="Remove resume"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-all duration-200 ${
            isDragOver
              ? "border-secondary bg-secondary/5"
              : error
              ? "border-[#5dcafd]/50 hover:border-[#5dcafd]"
              : "border-white/10 hover:border-secondary/50 bg-white/[0.01] hover:bg-white/[0.03]"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <Upload className="w-7 h-7 text-slate-400 mb-2.5" />
          <p className="text-sm text-white font-medium mb-1 select-none">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-400 select-none">
            PDF, DOC, or DOCX (Max 10MB)
          </p>
        </div>
      )}

      {error && <span className="text-xs text-[#5dcafd] mt-1 font-medium select-none">{error}</span>}
    </div>
  );
}

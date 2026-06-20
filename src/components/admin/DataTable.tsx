import React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps {
  title: string;
  subtitle?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  headers: string[];
  children: React.ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DataTable({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filterSlot,
  actionSlot,
  headers,
  children,
  currentPage,
  totalPages,
  onPageChange,
}: DataTableProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-card transition-all duration-300">
      {/* Table Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-outline-variant/30 bg-surface-container-lowest">
        <div>
          <h2 className="font-headline-sm text-sm font-semibold text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-on-surface-variant/60 mt-1">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/50" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-48 sm:w-56 bg-surface-container-low/60 border border-outline-variant/30 rounded-lg pl-9 pr-4 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all placeholder:text-outline/40"
            />
          </div>

          {/* Filters Slot */}
          {filterSlot}

          {/* Action Slot (e.g. Add Button) */}
          {actionSlot}
        </div>
      </div>

      {/* Table Render */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low/40">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">{children}</tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 border-t border-outline-variant/30 bg-surface-container-lowest">
        <span className="font-label-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center p-1.5 rounded border border-outline-variant/40 hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center justify-center p-1.5 rounded border border-outline-variant/40 hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>
        </div>
      </div>
    </div>
  );
}

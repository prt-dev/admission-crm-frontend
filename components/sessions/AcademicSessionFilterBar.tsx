"use client";

import React from "react";
import { AcademicSessionFilterBarProps, ACADEMIC_SESSION_STATUS } from "@/types/session";

export default function AcademicSessionFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
}: AcademicSessionFilterBarProps) {
  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.status !== "all" ||
    filters.year !== "all";

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search academic session by name, code (e.g. SESS-2026-27), notes..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-4 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={String(filters.status)}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-medium text-gray-700 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">All Statuses</option>
            <option value={ACADEMIC_SESSION_STATUS.ACTIVE}>Active / Ongoing (2)</option>
            <option value={ACADEMIC_SESSION_STATUS.UPCOMING}>Upcoming (1)</option>
            <option value={ACADEMIC_SESSION_STATUS.COMPLETED}>Completed (3)</option>
            <option value={ACADEMIC_SESSION_STATUS.ARCHIVED}>Archived (4)</option>
          </select>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

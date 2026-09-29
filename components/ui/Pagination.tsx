"use client";

import React, { useMemo } from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  siblingCount?: number;
  showEdges?: boolean;
  showInfo?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  siblingCount = 1,
  showEdges = true,
  showInfo = true,
  size = "md",
  className = "",
}: PaginationProps) {
  // Generate page numbers with ellipses (e.g., [1, '...', 4, 5, 6, '...', 20])
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblingCount + firstPage + lastPage + currentPage + 2*dots

    // If total pages is less than page numbers we want to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 1: No left dots, only right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, idx) => idx + 1);
      return [...leftRange, "...", totalPages];
    }

    // Case 2: No right dots, only left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, idx) => totalPages - rightItemCount + idx + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    // Case 3: Both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, idx) => leftSiblingIndex + idx
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  }, [totalPages, siblingCount, currentPage]);

  if (totalPages <= 1 && !totalItems && !pageSizeOptions) {
    return null;
  }

  const startEntry = pageSize ? (currentPage - 1) * pageSize + 1 : 1;
  const endEntry = pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : undefined;

  const sizeClasses = {
    sm: "h-7 min-w-7 px-2 text-xs",
    md: "h-8.5 min-w-8.5 px-2.5 text-xs font-medium",
    lg: "h-10 min-w-10 px-3 text-sm font-medium",
  };

  const buttonBase =
    "inline-flex items-center justify-center rounded-xl border transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none";

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400 ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Left side: Info & Page Size Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        {showInfo && totalItems !== undefined && (
          <p className="text-xs">
            Showing <strong className="font-semibold text-gray-900 dark:text-white">{startEntry}</strong> to{" "}
            <strong className="font-semibold text-gray-900 dark:text-white">{endEntry ?? totalItems}</strong> of{" "}
            <strong className="font-semibold text-gray-900 dark:text-white">{totalItems}</strong> results
          </p>
        )}

        {pageSizeOptions && onPageSizeChange && pageSize && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Page Navigation Buttons */}
      <nav className="flex items-center gap-1">
        {/* First page button */}
        {showEdges && (
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            aria-label="Go to first page"
            title="First Page"
            className={`${buttonBase} ${sizeClasses[size]} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Previous page button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Go to previous page"
          title="Previous Page"
          className={`${buttonBase} ${sizeClasses[size]} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Number Pills */}
        {paginationRange.map((pageNumber, index) => {
          if (typeof pageNumber === "string") {
            return (
              <span
                key={`dots-${index}`}
                className="flex h-8.5 w-8.5 items-center justify-center text-gray-400 select-none"
              >
                &#8230;
              </span>
            );
          }

          const isCurrent = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Page ${pageNumber}`}
              className={`${buttonBase} ${sizeClasses[size]} ${
                isCurrent
                  ? "border-brand-500 bg-brand-500 font-bold text-white shadow-xs shadow-brand-500/25"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next page button */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Go to next page"
          title="Next Page"
          className={`${buttonBase} ${sizeClasses[size]} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Last page button */}
        {showEdges && (
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="Go to last page"
            title="Last Page"
            className={`${buttonBase} ${sizeClasses[size]} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </nav>
    </div>
  );
}

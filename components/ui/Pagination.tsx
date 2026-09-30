"use client";

import React, { useMemo } from "react";

export interface PaginationConfig {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  siblingCount?: number;
  showEdges?: boolean;
  showInfo?: boolean;
  showTotal?: boolean;
  size?: "sm" | "md" | "lg";
}

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

    // No left dots to show, but right dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, idx) => idx + 1);
      return [...leftRange, "...", totalPages];
    }

    // No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, idx) => totalPages - rightItemCount + idx + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    // Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, idx) => leftSiblingIndex + idx
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  }, [totalPages, currentPage, siblingCount]);

  // Size styling maps
  const sizeStyles = {
    sm: {
      btn: "h-7 min-w-7 px-2 text-xs rounded-lg",
      icon: "h-3.5 w-3.5",
      select: "h-7 text-xs rounded-lg py-0 px-2",
      text: "text-xs",
    },
    md: {
      btn: "h-8 min-w-8 px-2.5 text-xs font-medium rounded-xl",
      icon: "h-4 w-4",
      select: "h-8 text-xs rounded-xl py-1 px-2.5",
      text: "text-xs",
    },
    lg: {
      btn: "h-9 min-w-9 px-3 text-sm font-medium rounded-xl",
      icon: "h-4 w-4",
      select: "h-9 text-sm rounded-xl py-1 px-3",
      text: "text-sm",
    },
  };

  const currentSize = sizeStyles[size];

  // If no pages to display
  if (currentPage === 0 || totalPages <= 1) {
    if (!totalItems && !pageSizeOptions) return null;
  }

  const startItem = totalItems ? (currentPage - 1) * (pageSize || 10) + 1 : 0;
  const endItem = totalItems
    ? Math.min(currentPage * (pageSize || 10), totalItems)
    : 0;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-600 dark:text-gray-300 ${className}`}
    >
      {/* Left: Info / Page Size Selector */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {showInfo && totalItems !== undefined && (
          <span className={`${currentSize.text} text-gray-500 dark:text-gray-400`}>
            Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> results
          </span>
        )}

        {pageSizeOptions && onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            <span className={`${currentSize.text} text-gray-400 dark:text-gray-500`}>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={`border border-gray-200 bg-white font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${currentSize.select}`}
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

      {/* Right: Page Navigation Numbers */}
      {totalPages >= 1 && (
        <div className="flex items-center gap-1">
          {/* First Page */}
          {showEdges && (
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors ${currentSize.btn}`}
              title="First Page"
            >
              <svg className={currentSize.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors ${currentSize.btn}`}
            title="Previous Page"
          >
            <svg className={currentSize.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Range Items */}
          {paginationRange.map((pageNumber, idx) => {
            if (pageNumber === "...") {
              return (
                <span
                  key={`dots-${idx}`}
                  className={`inline-flex items-center justify-center text-gray-400 select-none ${currentSize.btn}`}
                >
                  &#8230;
                </span>
              );
            }

            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(Number(pageNumber))}
                className={`inline-flex items-center justify-center transition-all ${currentSize.btn} ${
                  isActive
                    ? "bg-brand-500 text-white font-semibold shadow-xs shadow-brand-500/30 dark:bg-brand-500 cursor-default"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors ${currentSize.btn}`}
            title="Next Page"
          >
            <svg className={currentSize.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Last Page */}
          {showEdges && (
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors ${currentSize.btn}`}
              title="Last Page"
            >
              <svg className={currentSize.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

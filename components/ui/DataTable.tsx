"use client";

import React, { useState, useMemo } from "react";
import Pagination, { PaginationConfig } from "./Pagination";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationConfig;
  onRowClick?: (row: T) => void;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  title,
  subtitle,
  headerActions,
  searchable = false,
  searchPlaceholder = "Search records...",
  searchFilter,
  isLoading = false,
  emptyMessage = "No records found.",
  pagination,
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Client-side pagination state
  const [clientPage, setClientPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState(pagination?.pageSize || 10);

  // Client-side search filtering
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    if (searchFilter) {
      return data.filter((row) => searchFilter(row, query));
    }

    return data.filter((row) =>
      Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, searchFilter]);

  // Client-side sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination calculations
  const pageSize = pagination?.pageSize || clientPageSize;
  const currentPage = pagination?.currentPage || clientPage;
  const totalPages =
    pagination?.totalPages || Math.max(1, Math.ceil(sortedData.length / pageSize));

  const displayData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {/* Table Header / Toolbar */}
      {(title || subtitle || searchable || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {searchable && (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-3.5 w-3.5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setClientPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="rounded-xl border border-gray-200 bg-gray-50/70 py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                />
              </div>
            )}

            {headerActions && <div>{headerActions}</div>}
          </div>
        </div>
      )}

      {/* Table element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 font-semibold ${alignStyles[col.align || "left"]}`}
                  style={{ width: col.width }}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{col.header}</span>
                      <span className="flex flex-col text-[8px] text-gray-400">
                        <svg
                          className={`h-3 w-3 ${
                            sortColumn === col.key && sortDirection === "asc"
                              ? "text-brand-600 dark:text-brand-400 font-bold"
                              : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-xs text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg
                      className="h-8 w-8 text-gray-300 dark:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayData.map((row, index) => {
                const key = keyExtractor
                  ? keyExtractor(row, index)
                  : (row.id as string | number) || index;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors ${
                      onRowClick
                        ? "cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                        : "hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-3 px-4 ${alignStyles[col.align || "left"]}`}
                      >
                        {col.render
                          ? col.render(row, index)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={pagination.totalItems || sortedData.length}
            pageSize={pageSize}
            pageSizeOptions={pagination.pageSizeOptions}
            onPageChange={(page) => {
              if (pagination.onPageChange) {
                pagination.onPageChange(page);
              } else {
                setClientPage(page);
              }
            }}
            onPageSizeChange={(size) => {
              if (pagination.onPageSizeChange) {
                pagination.onPageSizeChange(size);
              } else {
                setClientPageSize(size);
                setClientPage(1);
              }
            }}
            showEdges={pagination.showEdges}
            showInfo={pagination.showInfo ?? pagination.showTotal ?? true}
            size={pagination.size || "sm"}
          />
        </div>
      )}
    </div>
  );
}

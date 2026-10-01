"use client";

import React from "react";
import {
  AcademicSession,
  AcademicSessionStatus,
  AcademicSessionTableProps,
  ACADEMIC_SESSION_STATUS,
} from "@/types/session";
import LogoSpinner from "@/components/loader/LogoSpinner";

export default function AcademicSessionTable({
  sessions,
  isLoading = false,
  onViewBatches,
  onEditSession,
  onDeleteSession,
  onSetAsCurrent,
}: AcademicSessionTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: AcademicSessionStatus | string | number, isCurrent: boolean) => {
    const isCurrentActive = Boolean(isCurrent);

    if (status === 2 || status === "Active" || status === ACADEMIC_SESSION_STATUS.ACTIVE) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {isCurrentActive ? "Active (Current)" : "Active / Ongoing"}
        </span>
      );
    }

    if (status === 1 || status === "Upcoming" || status === ACADEMIC_SESSION_STATUS.UPCOMING) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Upcoming Planned
        </span>
      );
    }

    if (status === 3 || status === "Completed" || status === ACADEMIC_SESSION_STATUS.COMPLETED) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          Completed
        </span>
      );
    }

    if (status === 4 || status === "Archived" || status === ACADEMIC_SESSION_STATUS.ARCHIVED) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Archived / Inactive
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        Status: {String(status)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-14 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <LogoSpinner
          size="md"
          label="Loading Academic Sessions..."
          sublabel="Fetching academic cycles and capacity stats"
        />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
          No Academic Sessions Found
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          No academic sessions match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-100 bg-gray-50/75 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 font-semibold uppercase tracking-wider text-[11px]">
                Session Code & Name
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Academic Year Dates (start_date - end_date)
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Running Batches
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Status (status)
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Description / Notes
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right font-semibold uppercase tracking-wider text-[11px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {sessions.map((session) => {
              const sessionName = session.name || session.sessionName || "Academic Session";
              const sessionCode = session.code || session.sessionCode || "SESS";
              const startDate = session.start_date || session.startDate;
              const endDate = session.end_date || session.endDate;
              const isCurrent = Boolean(session.is_current ?? session.isCurrent);

              return (
                <tr
                  key={session.id}
                  className="transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                >
                  {/* 1. Code & Name */}
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                          isCurrent
                            ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 ring-2 ring-brand-500/20"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        🎓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => onViewBatches(session)}
                            className="font-bold text-sm text-gray-900 dark:text-white hover:text-brand-600 cursor-pointer"
                          >
                            {sessionName}
                          </span>
                          {isCurrent && (
                            <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white tracking-wide">
                              Active Current
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">
                          {sessionCode}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Dates */}
                  <td className="whitespace-nowrap px-3 py-4 text-gray-700 dark:text-gray-300">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white font-mono text-xs">
                        {startDate} → {endDate}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(startDate)} — {formatDate(endDate)}
                      </span>
                    </div>
                  </td>

                  {/* 3. Running Batches */}
                  <td className="whitespace-nowrap px-3 py-4">
                    <button
                      type="button"
                      onClick={() => onViewBatches(session)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 cursor-pointer transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {session.runningBatchesCount || 0} Batches Running →
                    </button>
                  </td>

                  {/* 4. Status */}
                  <td className="whitespace-nowrap px-3 py-4">
                    {renderStatusBadge(session.status, isCurrent)}
                  </td>

                  {/* 5. Description */}
                  <td className="px-3 py-4 text-gray-500 dark:text-gray-400 min-w-[200px] max-w-xs">
                    <p className="line-clamp-2 text-[11px]">
                      {session.description || "—"}
                    </p>
                  </td>

                  {/* 6. Actions */}
                  <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => onSetAsCurrent(session)}
                          className="rounded-lg border border-brand-200 bg-brand-50/60 px-2 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300 cursor-pointer"
                          title="Set as Current Institutional Academic Session"
                        >
                          Set Current
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditSession(session)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800 cursor-pointer"
                        title="Edit Academic Session"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteSession(session)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Delete Academic Session"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
        <span>
          Showing <strong className="text-gray-900 dark:text-white">{sessions.length}</strong> academic sessions
        </span>
        <span className="text-[11px] text-gray-500">
          Batches run within their assigned Academic Session
        </span>
      </div>
    </div>
  );
}

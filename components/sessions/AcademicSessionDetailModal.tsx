"use client";

import React from "react";
import { AcademicSessionDetailModalProps, ACADEMIC_SESSION_STATUS_LABELS } from "@/types/session";
import { Batch } from "@/types/batch";

export default function AcademicSessionDetailModal({
  session,
  isOpen,
  onClose,
  batches,
  courses,
  onViewBatchDetail,
}: AcademicSessionDetailModalProps) {
  if (!isOpen || !session) return null;

  const sessionName = session.name || session.sessionName || "Academic Session";
  const sessionCode = session.code || session.sessionCode || "SESS";
  const startDate = session.start_date || session.startDate || "";
  const endDate = session.end_date || session.endDate || "";
  const isCurrent = Boolean(session.is_current ?? session.isCurrent);

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

  const startYear = startDate.slice(0, 4);

  // Filter batches running under this academic session
  const sessionBatches = batches.filter(
    (b) =>
      b.academicSessionCode === sessionCode ||
      b.academicSessionCode === session.code ||
      b.academicSessionCode === session.sessionCode ||
      (b.startDate && b.startDate.startsWith(startYear))
  );

  const totalSeats = sessionBatches.reduce((sum, b) => sum + (b.maxSeats || 0), 0);
  const totalEnrolled = sessionBatches.reduce((sum, b) => sum + (b.enrolledSeats || 0), 0);
  const occupancyPct = totalSeats > 0 ? Math.round((totalEnrolled / totalSeats) * 100) : 0;

  const getStatusBadge = () => {
    if (session.status === 2 || String(session.status) === "Active") {
      return (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          Active / Ongoing
        </span>
      );
    }
    if (session.status === 1 || String(session.status) === "Upcoming") {
      return (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
          Upcoming Planned
        </span>
      );
    }
    if (session.status === 3 || String(session.status) === "Completed") {
      return (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Completed
        </span>
      );
    }
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
        Archived
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                {sessionCode}
              </span>
              {isCurrent && (
                <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                  Active Current Cycle
                </span>
              )}
              {getStatusBadge()}
            </div>
            <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {sessionName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Operational Dates: <span className="font-mono font-semibold">{startDate}</span> to <span className="font-mono font-semibold">{endDate}</span> ({formatDate(startDate)} — {formatDate(endDate)})
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 text-xs">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-2xl bg-gray-50/70 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400">Running Batches</span>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                {sessionBatches.length} Cohorts
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400">Total Enrolled</span>
              <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">
                {totalEnrolled} <span className="text-xs font-medium text-gray-500">/ {totalSeats} Seats</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400">Seat Occupancy</span>
              <p className="text-lg font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">
                {occupancyPct}%
              </p>
            </div>
          </div>

          {session.description && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Session Overview & Scope
              </h3>
              <p className="rounded-xl bg-gray-50/50 p-3 text-gray-600 dark:bg-gray-800/40 dark:text-gray-300">
                {session.description}
              </p>
            </div>
          )}

          {/* Running Batches List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Batches Operating in {sessionCode} ({sessionBatches.length})
              </h3>
              <span className="text-[11px] text-gray-500">
                Cohort Schedule & Capacity
              </span>
            </div>

            {sessionBatches.length === 0 ? (
              <div className="rounded-xl border border-gray-200/60 p-6 text-center text-gray-500 dark:border-gray-800">
                No active batches running in this academic session.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sessionBatches.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onViewBatchDetail && onViewBatchDetail(b)}
                    className="rounded-2xl border border-gray-200/80 bg-white p-4 transition-all hover:border-brand-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                        {b.batchCode}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          b.status === "Ongoing"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : b.status === "Upcoming"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                      {b.batchName}
                    </h4>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {b.courseNames?.join(", ") || b.courseName || b.courseCodes?.join(", ") || b.courseCode}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
                      <span>👤 {b.trainerName}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {b.enrolledSeats}/{b.maxSeats} Seats
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

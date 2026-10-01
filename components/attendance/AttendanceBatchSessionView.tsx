"use client";

import React from "react";
import { AttendanceSession, AttendanceType, AttendanceBatchSessionViewProps } from "@/types/attendance";

export default function AttendanceBatchSessionView({
  sessions,
  onSelectSession,
}: AttendanceBatchSessionViewProps) {
  const renderTypeBadge = (type: AttendanceType) => {
    switch (type) {
      case "T":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            T · Theory
          </span>
        );
      case "P":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            P · Practical
          </span>
        );
      case "O":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            O · On-Site
          </span>
        );
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs text-gray-500">No batch training sessions logged yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sessions.map((ses) => {
        const attendancePct =
          ses.totalStudents > 0
            ? Math.round((ses.presentCount / ses.totalStudents) * 100)
            : 0;

        return (
          <div
            key={ses.id}
            className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-700/60"
          >
            {/* Header: Date, Code & Type */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {ses.batchCode}
                </span>
                <h4 className="mt-1 text-sm font-bold text-gray-900 dark:text-white line-clamp-1" title={ses.topic}>
                  {ses.topic}
                </h4>
              </div>
              <div>{renderTypeBadge(ses.type)}</div>
            </div>

            {/* Info details */}
            <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {ses.date}
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {ses.duration} {ses.duration === 1 ? "Hour" : "Hours"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {ses.trainerName}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  {ses.status}
                </span>
              </div>
            </div>

            {/* Progress bar and turnout */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Turnout: <strong className="text-gray-900 dark:text-white">{ses.presentCount}/{ses.totalStudents}</strong>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {attendancePct}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full dark:bg-gray-800 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${attendancePct}%` }}
                />
              </div>
            </div>

            {ses.notes && (
              <p className="mt-3 text-[11px] italic text-gray-500 dark:text-gray-400 line-clamp-1">
                &ldquo;{ses.notes}&rdquo;
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

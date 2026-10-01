"use client";

import React from "react";
import { AcademicSessionStatsCardsProps } from "@/types/session";

export default function AcademicSessionStatsCards({ metrics }: AcademicSessionStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Active Academic Session */}
      <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50/70 to-white p-5 shadow-xs dark:border-brand-800/60 dark:from-brand-950/40 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            Current Academic Year
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white truncate">
            {metrics.activeSessionName}
          </h3>
          <span className="mt-0.5 inline-block font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
            {metrics.activeSessionCode} (Active Cycle)
          </span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          All admissions & batches operating in this cycle
        </p>
      </div>

      {/* 2. Running Batches */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Running Batches
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalRunningBatches}
          </span>
          <span className="text-xs text-gray-500 font-medium">Cohort Groups</span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          Across Technical, Engineering & IT programs
        </p>
      </div>

      {/* 3. Total Enrolled & Occupancy */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Enrolled Students
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalEnrolledStudents}
          </span>
          <span className="text-xs text-gray-500">
            / {metrics.overallCapacitySeats} Capacity ({metrics.occupancyPercentage}%)
          </span>
        </div>
        <div className="mt-2.5 w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-800 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full"
            style={{ width: `${metrics.occupancyPercentage}%` }}
          />
        </div>
      </div>

      {/* 4. Total Academic Sessions */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Institutional Cycles
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalAcademicSessions}
          </span>
          <span className="text-xs text-purple-600 font-semibold">
            {metrics.upcomingSessionsCount} Upcoming Planned
          </span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          Historical, Active & Upcoming Sessions
        </p>
      </div>
    </div>
  );
}

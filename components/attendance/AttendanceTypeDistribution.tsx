"use client";

import React from "react";
import { AttendanceTypeDistributionProps } from "@/types/attendance";

export default function AttendanceTypeDistribution({
  theoryHours,
  practicalHours,
  onsiteHours,
  targetTheoryHours = 40,
  targetPracticalHours = 80,
  targetOnsiteHours = 60,
}: AttendanceTypeDistributionProps) {
  const totalLogged = theoryHours + practicalHours + onsiteHours;
  const theoryPct = totalLogged > 0 ? Math.round((theoryHours / totalLogged) * 100) : 0;
  const practicalPct = totalLogged > 0 ? Math.round((practicalHours / totalLogged) * 100) : 0;
  const onsitePct = totalLogged > 0 ? Math.round((onsiteHours / totalLogged) * 100) : 0;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </span>
            Curriculum Type Distribution (T, P, O)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Theory vs Practical vs On-Site training ratio as per NLETA Skill India Mission
          </p>
        </div>
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Total Logged: <span className="text-brand-600 dark:text-brand-400 font-bold">{totalLogged} Hours</span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="mt-4">
        <div className="h-4 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 flex shadow-inner">
          <div
            style={{ width: `${theoryPct}%` }}
            title={`Theory: ${theoryHours}h (${theoryPct}%)`}
            className="bg-blue-500 transition-all duration-500 hover:opacity-90"
          />
          <div
            style={{ width: `${practicalPct}%` }}
            title={`Practical: ${practicalHours}h (${practicalPct}%)`}
            className="bg-emerald-500 transition-all duration-500 hover:opacity-90"
          />
          <div
            style={{ width: `${onsitePct}%` }}
            title={`On-Site: ${onsiteHours}h (${onsitePct}%)`}
            className="bg-amber-500 transition-all duration-500 hover:opacity-90"
          />
        </div>
      </div>

      {/* Breakdown detail cards */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* T */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/30 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Type T (Theory)
            </span>
            <span className="text-xs font-bold text-blue-800 dark:text-blue-200">
              {theoryPct}%
            </span>
          </div>
          <p className="mt-2 text-lg font-extrabold text-blue-950 dark:text-blue-100">
            {theoryHours}{" "}
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              / {targetTheoryHours}h Target
            </span>
          </p>
          <div className="mt-1.5 h-1.5 w-full bg-blue-200/60 rounded-full dark:bg-blue-900/60 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${Math.min((theoryHours / targetTheoryHours) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* P */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Type P (Practical)
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
              {practicalPct}%
            </span>
          </div>
          <p className="mt-2 text-lg font-extrabold text-emerald-950 dark:text-emerald-100">
            {practicalHours}{" "}
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              / {targetPracticalHours}h Target
            </span>
          </p>
          <div className="mt-1.5 h-1.5 w-full bg-emerald-200/60 rounded-full dark:bg-emerald-900/60 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${Math.min((practicalHours / targetPracticalHours) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* O */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 dark:border-amber-900/30 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Type O (On-Site / Field)
            </span>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
              {onsitePct}%
            </span>
          </div>
          <p className="mt-2 text-lg font-extrabold text-amber-950 dark:text-amber-100">
            {onsiteHours}{" "}
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              / {targetOnsiteHours}h Target
            </span>
          </p>
          <div className="mt-1.5 h-1.5 w-full bg-amber-200/60 rounded-full dark:bg-amber-900/60 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full"
              style={{ width: `${Math.min((onsiteHours / targetOnsiteHours) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { AttendanceStatsCardsProps } from "@/types/attendance";

export default function AttendanceStatsCards({ metrics }: AttendanceStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Overall Attendance Rate */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Avg Attendance
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.overallAttendanceRate}%
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            High Target
          </span>
        </div>
        <div className="mt-2.5 w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-brand-500 h-1.5 rounded-full"
            style={{ width: `${Math.min(metrics.overallAttendanceRate, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          {metrics.presentMarksCount} Present · {metrics.lateMarksCount} Late · {metrics.absentMarksCount} Absent
        </p>
      </div>

      {/* 2. Total Training Hours */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Logged
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalLoggedHours} <span className="text-sm font-medium text-gray-500">Hrs</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            across {metrics.totalLoggedSessions} sessions
          </span>
        </div>
        <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
          Across {metrics.totalStudentsTracked} active enrolled candidates
        </p>
      </div>

      {/* 3. Theory Hours (T) */}
      <div className="rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50/40 to-transparent p-5 shadow-xs transition-all hover:shadow-md dark:border-blue-900/40 dark:from-blue-950/20 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              T
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Theory
            </span>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-blue-900 dark:text-blue-200">
            {metrics.theoryHours}
          </span>
          <span className="text-sm font-semibold text-blue-600/80 dark:text-blue-400">Hours</span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          Curriculum Standards & Codes
        </p>
      </div>

      {/* 4. Practical Hours (P) */}
      <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/40 to-transparent p-5 shadow-xs transition-all hover:shadow-md dark:border-emerald-900/40 dark:from-emerald-950/20 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              P
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Practical
            </span>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
            {metrics.practicalHours}
          </span>
          <span className="text-sm font-semibold text-emerald-600/80 dark:text-emerald-400">Hours</span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          Hands-on Lab & Simulator Drills
        </p>
      </div>

      {/* 5. On-Site / Other Hours (O) */}
      <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50/40 to-transparent p-5 shadow-xs transition-all hover:shadow-md dark:border-amber-900/40 dark:from-amber-950/20 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              O
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              On-Site (O)
            </span>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100/80 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-amber-900 dark:text-amber-200">
            {metrics.onsiteHours}
          </span>
          <span className="text-sm font-semibold text-amber-600/80 dark:text-amber-400">Hours</span>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          Field Shaft Survey & OJT
        </p>
      </div>
    </div>
  );
}

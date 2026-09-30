"use client";

import React from "react";
import { StudentProfileCardProps } from "@/types/student";

export default function StudentProfileCard({ admission }: StudentProfileCardProps) {
  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Certified":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Inactive":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      {/* Decorative gradient blur background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-400/10" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Avatar & Personal Info */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-400 text-white font-bold text-2xl shadow-md shadow-brand-500/20">
            {admission.studentName.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {admission.studentName}
              </h1>
              <span
                className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  admission.status
                )}`}
              >
                ● {admission.status} Student
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enrolled in <strong className="text-gray-800 dark:text-gray-200">{admission.courseName || admission.courseCode}</strong>
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400 mt-2 font-mono">
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md font-semibold text-brand-600 dark:text-brand-400">
                ID: {admission.studentId}
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-gray-700 dark:text-gray-300">
                Reg: {admission.registrationId}
              </span>
              <span className="bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-md font-semibold">
                Skill India: {admission.skillIndiaRegId}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/80 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print ID Card</span>
          </button>

          <a
            href={`mailto:support@nletacrm.com?subject=Inquiry from Student ${admission.studentId} - ${admission.studentName}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-600 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Help Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}

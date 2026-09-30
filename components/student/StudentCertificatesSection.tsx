"use client";

import React from "react";
import { StudentCertificatesSectionProps } from "@/types/student";

export default function StudentCertificatesSection({
  admission,
  course,
}: StudentCertificatesSectionProps) {
  const isCertified = admission.status === "Certified";

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Skill India / NSDC Certifications
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Government aligned qualification pack & national certification status.
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
            isCertified
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200"
              : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200"
          }`}
        >
          {isCertified ? "🏆 Certificate Issued" : "⏳ Evaluation Pending"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-brand-200/60 bg-gradient-to-r from-brand-50/50 to-white dark:from-brand-950/30 dark:to-gray-900 dark:border-brand-800/50">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white font-bold text-lg shadow-sm">
            🎓
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {course?.courseName || admission.courseName || "Full Stack Web Development"}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
              <span>Skill India ID: {admission.skillIndiaRegId}</span>
              <span>•</span>
              <span>QP Code: {course?.skillIndiaQpCode || "SSC/Q0501"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCertified ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-600 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Certificate</span>
            </button>
          ) : (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
              Assessed on course completion
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

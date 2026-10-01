"use client";

import React from "react";
import { Course } from "@/types/course";
import { Batch } from "@/types/batch";

interface AcademicAllocationSectionProps {
  courses: Course[];
  batches: Batch[];
  courseCode: string;
  batchCode: string;
  onCourseChange: (code: string) => void;
  onBatchChange: (code: string) => void;
  errors?: Record<string, string>;
}

export default function AcademicAllocationSection({
  courses,
  batches,
  courseCode,
  batchCode,
  onCourseChange,
  onBatchChange,
  errors = {},
}: AcademicAllocationSectionProps) {
  const selectedCourse = courses.find(
    (c) => c.courseCode.toLowerCase() === courseCode.toLowerCase()
  );

  const cleanTargetCode = courseCode.toLowerCase();
  const filteredBatches = batches.filter((b) => {
    if (b.courseCodes && b.courseCodes.some((c) => c.toLowerCase() === cleanTargetCode)) {
      return true;
    }
    return b.courseCode && b.courseCode.toLowerCase() === cleanTargetCode;
  });

  const selectedBatch = batches.find(
    (b) => b.batchCode.toLowerCase() === batchCode.toLowerCase()
  );

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          3
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Academic Enrollment & Batch Allocation
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Select curriculum track and assign training batch cohort.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Course Code (List - Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Course Program Code <span className="text-rose-500">*</span>
          </label>
          <select
            value={courseCode}
            onChange={(e) => onCourseChange(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.courseCode ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <option value="">-- Select Course Program --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.courseCode}>
                {c.courseCode} - {c.courseName} (₹{c.totalFee.toLocaleString()})
              </option>
            ))}
          </select>
          {errors.courseCode && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.courseCode}</p>
          )}

          {selectedCourse && (
            <div className="mt-3 p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/30 text-xs">
              <p className="font-semibold text-brand-900 dark:text-brand-200">
                {selectedCourse.courseName}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Duration: {selectedCourse.duration} • Fee: ₹{selectedCourse.totalFee.toLocaleString()}
              </p>
              {selectedCourse.classroomLocation && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  📍 Venue: {selectedCourse.classroomLocation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Batch Code (Auto - Mandatory) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Allocated Batch Code <span className="text-brand-600 font-bold">(Auto)</span> <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-gray-400">
              {filteredBatches.length} cohort(s) available
            </span>
          </div>

          <select
            value={batchCode}
            onChange={(e) => onBatchChange(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.batchCode ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <option value="">-- Select or Auto Assign --</option>
            {filteredBatches.map((b) => (
              <option key={b.id} value={b.batchCode}>
                {b.batchCode} - {b.batchName} ({b.scheduleTiming} | {b.enrolledSeats}/{b.maxSeats} seats)
              </option>
            ))}
            {!filteredBatches.some((b) => b.batchCode === batchCode) && batchCode && (
              <option value={batchCode}>{batchCode} (Auto Assigned Cohort)</option>
            )}
          </select>
          {errors.batchCode && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.batchCode}</p>
          )}

          {selectedBatch && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-xs">
              <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                {selectedBatch.batchName}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Trainer: {selectedBatch.trainerName} • {selectedBatch.scheduleTiming} • {selectedBatch.mode}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

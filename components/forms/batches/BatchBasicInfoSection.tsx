"use client";

import React from "react";
import { Course } from "@/types/course";
import { BatchStatus } from "@/types/batch";

const STATUSES: BatchStatus[] = [
  "Upcoming",
  "Ongoing",
  "Completed",
  "Full",
];

interface BatchBasicInfoSectionProps {
  courses: Course[];
  courseCode: string;
  batchCode: string;
  batchName: string;
  trainerName: string;
  status: BatchStatus;
  onCourseChange: (val: string) => void;
  onBatchCodeChange: (val: string) => void;
  onBatchNameChange: (val: string) => void;
  onTrainerNameChange: (val: string) => void;
  onStatusChange: (val: BatchStatus) => void;
  errors?: Record<string, string>;
}

export default function BatchBasicInfoSection({
  courses,
  courseCode,
  batchCode,
  batchName,
  trainerName,
  status,
  onCourseChange,
  onBatchCodeChange,
  onBatchNameChange,
  onTrainerNameChange,
  onStatusChange,
  errors = {},
}: BatchBasicInfoSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          1
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Batch Identification & Faculty
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Select parent course, assign unique batch code, batch title, and designated trainer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Parent Course */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Parent Course <span className="text-rose-500">*</span>
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
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
          {errors.courseCode && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.courseCode}</p>
          )}
        </div>

        {/* Batch Code */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Batch Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={batchCode}
            onChange={(e) => onBatchCodeChange(e.target.value.toUpperCase())}
            placeholder="e.g. BAT-2026-WD01"
            className={`w-full rounded-xl border font-mono px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.batchCode ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.batchCode && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.batchCode}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Batch Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Batch Title / Cohort Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => onBatchNameChange(e.target.value)}
            placeholder="e.g. Full Stack Morning Cohort #01"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.batchName ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.batchName && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.batchName}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Batch Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainer Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Assigned Trainer / Lead Faculty <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={trainerName}
          onChange={(e) => onTrainerNameChange(e.target.value)}
          placeholder="e.g. Prof. Rajesh Sharma"
          className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
            errors.trainerName ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
          }`}
        />
        {errors.trainerName && (
          <p className="text-[11px] text-rose-500 mt-1">{errors.trainerName}</p>
        )}
      </div>
    </div>
  );
}

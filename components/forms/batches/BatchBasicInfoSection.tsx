"use client";

import React, { useState } from "react";
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
  courseCodes: string[];
  batchCode: string;
  batchName: string;
  trainerName: string;
  status: BatchStatus;
  onCourseCodesChange: (codes: string[]) => void;
  onBatchCodeChange: (val: string) => void;
  onBatchNameChange: (val: string) => void;
  onTrainerNameChange: (val: string) => void;
  onStatusChange: (val: BatchStatus) => void;
  errors?: Record<string, string>;
}

export default function BatchBasicInfoSection({
  courses,
  courseCodes,
  batchCode,
  batchName,
  trainerName,
  status,
  onCourseCodesChange,
  onBatchCodeChange,
  onBatchNameChange,
  onTrainerNameChange,
  onStatusChange,
  errors = {},
}: BatchBasicInfoSectionProps) {
  const [courseSearch, setCourseSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleCourse = (code: string) => {
    if (courseCodes.includes(code)) {
      onCourseCodesChange(courseCodes.filter((c) => c !== code));
    } else {
      onCourseCodesChange([...courseCodes, code]);
    }
  };

  const removeCourse = (code: string) => {
    onCourseCodesChange(courseCodes.filter((c) => c !== code));
  };

  const selectAllFiltered = () => {
    const filteredCodes = filteredCourses
      .map((c) => c.code || c.courseCode)
      .filter(Boolean) as string[];
    const merged = Array.from(new Set([...courseCodes, ...filteredCodes]));
    onCourseCodesChange(merged);
  };

  const clearAllCourses = () => {
    onCourseCodesChange([]);
  };

  const filteredCourses = courses.filter((c) => {
    const q = courseSearch.toLowerCase();
    const cCode = (c.code || c.courseCode || "").toLowerCase();
    const cName = (c.name || c.courseName || "").toLowerCase();
    const cCat = (c.category || "").toLowerCase();
    return cCode.includes(q) || cName.includes(q) || cCat.includes(q);
  });

  const selectedCoursesList = courses.filter((c) => {
    const cCode = c.code || c.courseCode || "";
    return courseCodes.includes(cCode);
  });

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          1
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Batch Identification, Courses & Faculty
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Select one or multiple courses associated with this batch, assign unique batch code, title, and designated trainer.
          </p>
        </div>
      </div>

      {/* Multiple Courses Selection Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Associated Courses <span className="text-rose-500">*</span>{" "}
            <span className="text-[11px] font-normal text-gray-400">
              (One batch can deliver multiple curriculum courses)
            </span>
          </label>
          <div className="flex items-center gap-2 text-xs">
            {courseCodes.length > 0 && (
              <button
                type="button"
                onClick={clearAllCourses}
                className="text-[11px] font-medium text-rose-500 hover:text-rose-600"
              >
                Clear all ({courseCodes.length})
              </button>
            )}
          </div>
        </div>

        {/* Selected Course Chips */}
        {selectedCoursesList.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 bg-brand-50/40 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 rounded-xl">
            {selectedCoursesList.map((c) => (
              <div
                key={c.id}
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-brand-200 dark:border-brand-800/60 shadow-xs px-2.5 py-1.5 rounded-lg text-xs"
              >
                <div className="flex flex-col text-left">
                  <span className="font-mono font-bold text-[10px] text-brand-600 dark:text-brand-400">
                    {c.courseCode}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-[11px] max-w-[220px] truncate">
                    {c.courseName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCourse(c.courseCode)}
                  className="p-1 text-gray-400 hover:text-rose-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Remove Course"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
            <p className="text-xs text-gray-400">
              No courses selected yet. Choose one or more courses below.
            </p>
          </div>
        )}

        {/* Course Search & Multi-select Dropdown Container */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
          <div className="p-2.5 bg-gray-50/70 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search available courses by code or title..."
              className="w-full bg-transparent text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            {filteredCourses.length > 0 && (
              <button
                type="button"
                onClick={selectAllFiltered}
                className="text-[11px] whitespace-nowrap font-medium text-brand-600 dark:text-brand-400 hover:underline px-1.5"
              >
                Select {filteredCourses.length} Shown
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 p-1">
            {filteredCourses.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No courses match "{courseSearch}"
              </p>
            ) : (
              filteredCourses.map((c) => {
                const code = c.code || c.courseCode || "";
                const name = c.name || c.courseName || "";
                const fee = c.fee !== undefined ? Number(c.fee) : (c.totalFee || 0);
                const isSelected = courseCodes.includes(code);
                return (
                  <label
                    key={c.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                       <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCourse(code)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                            {code}
                          </span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            • {c.duration}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {name}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 ml-2 whitespace-nowrap">
                      ₹{fee.toLocaleString()}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {errors.courseCode && (
          <p className="text-[11px] text-rose-500 mt-1">{errors.courseCode}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
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

        {/* Batch Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Batch Title / Cohort Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => onBatchNameChange(e.target.value)}
            placeholder="e.g. Lift Operator & Mechanical Safety Cohort #01"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.batchName ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.batchName && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.batchName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
    </div>
  );
}

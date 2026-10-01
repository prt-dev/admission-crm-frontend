"use client";

import React from "react";
import { CourseCategory, CourseStatus } from "@/types/course";

const CATEGORIES: CourseCategory[] = [
  "OVERVIEW OF NLETA SKILL INDIA MISSION",
  "OVERVIEW OF ELEVATOR INDUSTRY",
  "SAFETY TRAINING",
  "OVERVIEW OF PREVAILING CODES AND STANDARDS",
  "TRAINING FOR NEW INSTALLATIONS (NI)",
  "TRAINING FOR EXISTING INSTALLATIONS (EI)",
];

interface CourseBasicInfoSectionProps {
  courseCode: string;
  courseName: string;
  category: CourseCategory;
  duration: string;
  totalFee: number;
  status: CourseStatus;
  classroomLocation: string;
  onCourseCodeChange: (val: string) => void;
  onCourseNameChange: (val: string) => void;
  onCategoryChange: (val: CourseCategory) => void;
  onDurationChange: (val: string) => void;
  onTotalFeeChange: (val: number) => void;
  onStatusChange: (val: CourseStatus) => void;
  onClassroomLocationChange: (val: string) => void;
  errors?: Record<string, string>;
}

export default function CourseBasicInfoSection({
  courseCode,
  courseName,
  category,
  duration,
  totalFee,
  status,
  classroomLocation,
  onCourseCodeChange,
  onCourseNameChange,
  onCategoryChange,
  onDurationChange,
  onTotalFeeChange,
  onStatusChange,
  onClassroomLocationChange,
  errors = {},
}: CourseBasicInfoSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          1
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Course Basic Information & Training Venue
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Course code, official program title, duration, pricing, category, and assigned lab/classroom/virtual link.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Course Code */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Course Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => onCourseCodeChange(e.target.value.toUpperCase())}
            placeholder="e.g. CRS-FSWD-101"
            className={`w-full rounded-xl border font-mono px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.courseCode ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.courseCode && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.courseCode}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Course Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Program / Course Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => onCourseNameChange(e.target.value)}
          placeholder="e.g. Full Stack Web Development (MERN & Next.js)"
          className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
            errors.courseName ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
          }`}
        />
        {errors.courseName && (
          <p className="text-[11px] text-rose-500 mt-1">{errors.courseName}</p>
        )}
      </div>

      {/* Classroom / Lab Location / Virtual Room Link */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Classroom / Lab Location / Virtual Room Link
        </label>
        <div className="relative">
          <input
            type="text"
            value={classroomLocation}
            onChange={(e) => onClassroomLocationChange(e.target.value)}
            placeholder="e.g. Mechanical Shaft Bay 1 & Rigging Lab 302 or https://meet.google.com/xyz-abc"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 pl-9 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-sans"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          Specify campus room / lab facility or online meeting URL used for lectures and practical assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Duration <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            placeholder="e.g. 6 Months (360 Hours)"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* Total Fee */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Total Program Fee (₹) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            value={totalFee}
            onChange={(e) => onTotalFeeChange(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Course Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          >
            <option value="Active">Active (Accepting Admissions)</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

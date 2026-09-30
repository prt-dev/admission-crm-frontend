"use client";

import React from "react";
import { BatchMode } from "@/types/batch";

const MODES: BatchMode[] = [
  "Offline (Classroom)",
  "Online (Live)",
  "Hybrid",
];

interface BatchScheduleSectionProps {
  scheduleTiming: string;
  mode: BatchMode;
  startDate: string;
  endDate: string;
  maxSeats: number;
  classroomLocation: string;
  onScheduleTimingChange: (val: string) => void;
  onModeChange: (val: BatchMode) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onMaxSeatsChange: (val: number) => void;
  onClassroomLocationChange: (val: string) => void;
  errors?: Record<string, string>;
}

export default function BatchScheduleSection({
  scheduleTiming,
  mode,
  startDate,
  endDate,
  maxSeats,
  classroomLocation,
  onScheduleTimingChange,
  onModeChange,
  onStartDateChange,
  onEndDateChange,
  onMaxSeatsChange,
  onClassroomLocationChange,
  errors = {},
}: BatchScheduleSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          2
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Schedule, Timings & Capacity
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Training delivery mode, session timings, seat quotas, and venue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Schedule Timing */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Daily Session Timings <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={scheduleTiming}
            onChange={(e) => onScheduleTimingChange(e.target.value)}
            placeholder="e.g. 09:00 AM - 12:00 PM (Mon - Fri)"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.scheduleTiming ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.scheduleTiming && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.scheduleTiming}</p>
          )}
        </div>

        {/* Mode */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Delivery Mode
          </label>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          >
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Start Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Batch Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Target Completion Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* Max Seats */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Max Student Capacity <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            value={maxSeats}
            onChange={(e) => onMaxSeatsChange(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Classroom Location */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Classroom / Lab Location / Virtual Room Link
        </label>
        <input
          type="text"
          value={classroomLocation}
          onChange={(e) => onClassroomLocationChange(e.target.value)}
          placeholder="e.g. Lab 301, 3rd Floor / Zoom Room A"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
        />
      </div>
    </div>
  );
}

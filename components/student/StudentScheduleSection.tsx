"use client";

import React from "react";
import { Batch } from "@/types/batch";

interface StudentScheduleSectionProps {
  batch?: Batch;
}

export default function StudentScheduleSection({ batch }: StudentScheduleSectionProps) {
  const scheduleSlots = [
    {
      day: "Monday - Friday",
      timing: batch?.scheduleTiming || "09:30 AM - 12:30 PM (Mon-Fri)",
      subject: "Interactive Technical Training & Lab Coding",
      instructor: batch?.trainerName || "Prof. Senior Instructor",
      location: batch?.classroomLocation || "Lab 302 / Smart Classroom",
      status: "Active",
    },
    {
      day: "Saturday (Bi-weekly)",
      timing: "10:00 AM - 01:00 PM",
      subject: "Industry Masterclass & Project Code Review",
      instructor: "Guest Industry Mentor",
      location: "Virtual Webcast & Hybrid Hall A",
      status: "Upcoming",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Class Schedule & Batch Timings
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {batch?.batchName || "Assigned Batch Schedule"} ({batch?.batchCode || "BAT-2026-01"})
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Cohort Status: {batch?.status || "Ongoing"}
        </span>
      </div>

      <div className="space-y-3">
        {scheduleSlots.map((slot, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {slot.subject}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    🗓️ {slot.day} ({slot.timing})
                  </span>
                  <span>•</span>
                  <span>👨‍🏫 {slot.instructor}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg">
                📍 {slot.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

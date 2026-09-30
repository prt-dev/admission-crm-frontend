"use client";

import React from "react";
import { Course } from "@/types/course";

interface StudentSyllabusSectionProps {
  course?: Course;
}

export default function StudentSyllabusSection({ course }: StudentSyllabusSectionProps) {
  const highlights: string[] =
    course?.syllabusHighlights && course.syllabusHighlights.length > 0
      ? course.syllabusHighlights
      : [
          "Core Module 01: Foundations & Architecture",
          "Core Module 02: Advanced Concepts & Frameworks",
          "Practical Lab 03: Industry Capstone Project",
          "Assessment 04: Skill India QP Certification",
        ];

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Program Curriculum & Syllabus Progress
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {course?.courseName || "Academic Curriculum Modules"} ({course?.duration || "6 Months"})
          </p>
        </div>
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-lg">
          NSDC Level: {course?.skillIndiaQpCode || "QP-NSDC-2026"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {highlights.map((item: string, index: number) => {
          const isCompleted = index === 0;
          const isInProgress = index === 1;

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                isCompleted
                  ? "border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                  : isInProgress
                  ? "border-brand-200/80 bg-brand-50/40 dark:border-brand-800/40 dark:bg-brand-950/20 shadow-xs"
                  : "border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isInProgress
                        ? "bg-brand-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {item}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : isInProgress
                      ? "bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300 animate-pulse"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-200/60 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isCompleted
                      ? "bg-emerald-500 w-full"
                      : isInProgress
                      ? "bg-brand-500 w-3/5"
                      : "w-0"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Course } from "@/types/course";
import { Batch } from "@/types/batch";
import Button from "@/components/ui/Button";

interface CourseDetailModalProps {
  course: Course | null;
  batches: Batch[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onAddBatchForCourse: (courseCode: string) => void;
}

export default function CourseDetailModal({
  course,
  batches,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAddBatchForCourse,
}: CourseDetailModalProps) {
  if (!isOpen || !course) return null;

  const targetCode = course.courseCode.toLowerCase();
  const courseBatches = batches.filter((b) => {
    if (b.courseCodes && b.courseCodes.some((c) => c.toLowerCase() === targetCode)) {
      return true;
    }
    return b.courseCode && b.courseCode.toLowerCase() === targetCode;
  });
  const totalEnrolled = courseBatches.reduce((acc, b) => acc + (b.enrolledSeats || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                {course.courseCode}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  course.status === "Active"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                }`}
              >
                {course.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mt-1">
              {course.courseName}
            </h2>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-[11px] text-gray-400">Total Fee</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                ₹{course.totalFee.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Duration</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                {course.duration}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Active Batches</p>
              <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                {courseBatches.length} Batches
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Enrolled Students</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {totalEnrolled} Students
              </p>
            </div>
          </div>

          {/* Training Venue / Lab / Virtual Room */}
          {course.classroomLocation && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-300">
                  Classroom / Lab Location / Virtual Room Link
                </p>
                {course.classroomLocation.startsWith("http") ? (
                  <a
                    href={course.classroomLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-700 dark:text-emerald-300 hover:underline truncate block"
                  >
                    {course.classroomLocation} ↗
                  </a>
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5 truncate">
                    {course.classroomLocation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              Course Description
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              {course.description || "No description provided."}
            </p>
          </div>

          {/* Syllabus */}
          {course.syllabusHighlights && course.syllabusHighlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Curriculum & Syllabus Modules
              </h4>
              <div className="space-y-1.5">
                {course.syllabusHighlights.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batches under this course */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Associated Batches ({courseBatches.length})
              </h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddBatchForCourse(course.courseCode);
                }}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
              >
                + Schedule Batch
              </button>
            </div>

            {courseBatches.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-800/20 p-3 rounded-xl text-center">
                No active batches scheduled yet for this course.
              </p>
            ) : (
              <div className="space-y-2">
                {courseBatches.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{b.batchCode}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{b.batchName}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {b.scheduleTiming} • Trainer: {b.trainerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {b.enrolledSeats} / {b.maxSeats} Seats
                      </span>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{b.mode}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onDelete(course)}
          >
            Delete Course
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onEdit(course)}
            >
              Edit Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

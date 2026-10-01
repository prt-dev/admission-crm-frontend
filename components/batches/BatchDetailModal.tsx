"use client";

import React from "react";
import { Batch } from "@/types/batch";
import { Admission } from "@/types/admission";
import { courseService } from "@/services/courseService";
import { courseCache } from "@/services/courseCache";
import { initialCourses } from "@/data/courseData";
import { admissionService } from "@/services/admissionService";
import Button from "@/components/ui/Button";

interface BatchDetailModalProps {
  batch: Batch | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
  onViewAdmission: (admission: Admission) => void;
}

export default function BatchDetailModal({
  batch,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onViewAdmission,
}: BatchDetailModalProps) {
  if (!isOpen || !batch) return null;

  const allAdmissions = admissionService.getAdmissions();
  const enrolledStudents = allAdmissions.filter(
    (a) => a.batchCode.toLowerCase() === batch.batchCode.toLowerCase()
  );

  const percentOccupancy = Math.min(
    100,
    Math.round(((batch.enrolledSeats || enrolledStudents.length) / batch.maxSeats) * 100)
  );

  const courseCodes =
    batch.courseCodes && batch.courseCodes.length > 0
      ? batch.courseCodes
      : batch.courseCode
      ? [batch.courseCode]
      : [];

  const allCourses = courseCache.getValidCache() || initialCourses;
  const associatedCourses = courseCodes
    .map((code) =>
      allCourses.find(
        (c) => (c.code || c.courseCode).toLowerCase() === code.toLowerCase()
      )
    )
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                {batch.batchCode}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  batch.status === "Ongoing"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : batch.status === "Upcoming"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {batch.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mt-1">
              {batch.batchName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {courseCodes.length} Associated Course{courseCodes.length > 1 ? "s" : ""}
            </p>
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Seat Capacity Gauge */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50/60 to-brand-100/30 dark:from-brand-950/40 dark:to-brand-900/10 border border-brand-200/50 dark:border-brand-800/40">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-gray-700 dark:text-gray-300">Seat Occupancy</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">
                {enrolledStudents.length} / {batch.maxSeats} Seats Filled ({percentOccupancy}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  percentOccupancy >= 90
                    ? "bg-rose-500"
                    : percentOccupancy >= 60
                    ? "bg-brand-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${percentOccupancy}%` }}
              />
            </div>
          </div>

          {/* Associated Courses List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Delivered Courses ({courseCodes.length})
            </h4>
            <div className="space-y-2">
              {associatedCourses.map((c) => (
                <div
                  key={c!.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                        {c!.courseCode}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white truncate">
                        {c!.courseName}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Duration: {c!.duration} • Category: {c!.category || "Standard"}
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="font-semibold text-gray-900 dark:text-white text-xs">
                      ₹{c!.totalFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Timings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
            <div>
              <p className="text-gray-400 text-[11px]">Assigned Trainer</p>
              <p className="font-bold text-gray-900 dark:text-white mt-0.5">{batch.trainerName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Daily Timings</p>
              <p className="font-bold text-gray-900 dark:text-white mt-0.5">{batch.scheduleTiming}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Training Mode</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{batch.mode}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Start Date</p>
              <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{batch.startDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">End Date</p>
              <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{batch.endDate || "TBD"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px]">Classroom / Lab</p>
              <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{batch.classroomLocation || "N/A"}</p>
            </div>
          </div>

          {/* Enrolled Students Roster */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5">
              Enrolled Students Roster ({enrolledStudents.length})
            </h4>

            {enrolledStudents.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-gray-50 dark:bg-gray-800/20 p-4 rounded-xl text-center">
                No students enrolled in this batch yet.
              </p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 px-3">
                {enrolledStudents.map((stu) => (
                  <div key={stu.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold text-xs">
                        {stu.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{stu.studentName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{stu.studentId} • {stu.skillIndiaRegId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {stu.status}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onViewAdmission(stu);
                        }}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 px-2 py-1 rounded bg-brand-50 dark:bg-brand-950/40"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <Button type="button" variant="danger" size="sm" onClick={() => onDelete(batch)}>
            Delete Batch
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={() => onEdit(batch)}>
              Edit Batch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

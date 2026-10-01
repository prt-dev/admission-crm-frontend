"use client";

import React, { useMemo } from "react";
import { StudentAttendanceSectionProps } from "@/types/student";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceType, AttendanceStatus } from "@/types/attendance";

export default function StudentAttendanceSection({
  admission,
}: StudentAttendanceSectionProps) {
  const studentData = useMemo(() => {
    return attendanceService.getStudentAttendance(admission.studentId);
  }, [admission.studentId]);

  const { records, totalHours, theoryHours, practicalHours, onsiteHours, attendanceRate } =
    studentData;

  const renderTypeBadge = (type: AttendanceType) => {
    switch (type) {
      case "T":
        return (
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            T · Theory
          </span>
        );
      case "P":
        return (
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            P · Practical
          </span>
        );
      case "O":
        return (
          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            O · On-Site
          </span>
        );
    }
  };

  const renderStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Present
          </span>
        );
      case "Absent":
        return (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            Absent
          </span>
        );
      case "Late":
        return (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            Late
          </span>
        );
      case "Excused":
        return (
          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
            Excused
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Attendance KPI Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Rate */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            My Attendance Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Good Standing</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full dark:bg-gray-800 overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Theory T Hours */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-xs dark:border-blue-900/30 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Theory (T) Attended
            </span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-950 dark:text-blue-100">
            {theoryHours} <span className="text-sm font-medium text-blue-600">Hours</span>
          </p>
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Classroom lectures</p>
        </div>

        {/* Practical P Hours */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-xs dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Practical (P) Attended
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-950 dark:text-emerald-100">
            {practicalHours} <span className="text-sm font-medium text-emerald-600">Hours</span>
          </p>
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Simulator & labs</p>
        </div>

        {/* On-Site O Hours */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-xs dark:border-amber-900/30 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              On-Site (O) Attended
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-950 dark:text-amber-100">
            {onsiteHours} <span className="text-sm font-medium text-amber-600">Hours</span>
          </p>
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Field drills & workshop</p>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800 mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            My Session Attendance History ({records.length} Sessions)
          </h3>
          <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">
            Total Logged: {totalHours} Hours
          </span>
        </div>

        {records.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
            No attendance records logged for this student yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-2.5 px-3 font-semibold uppercase text-[10px]">Date</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold uppercase text-[10px]">Topic / Subject</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold uppercase text-[10px]">Type (T/P/O)</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold uppercase text-[10px]">Duration</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold uppercase text-[10px]">Status</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold uppercase text-[10px]">Trainer</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold uppercase text-[10px]">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-3 px-3 text-gray-800 dark:text-gray-200 min-w-[200px]">
                      {r.topic}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderTypeBadge(r.type)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {r.duration} Hrs
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderStatusBadge(r.status)}
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {r.trainerName}
                    </td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400 italic text-[11px]">
                      {r.remarks || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

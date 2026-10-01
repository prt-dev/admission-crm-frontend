"use client";

import React, { useState } from "react";
import { AttendanceRecord, AttendanceStatus, AttendanceType, AttendanceTableProps } from "@/types/attendance";
import LogoSpinner from "@/components/loader/LogoSpinner";

export default function AttendanceTable({
  records,
  isLoading = false,
  onStatusChange,
  onViewDetails,
}: AttendanceTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderTypeBadge = (type: AttendanceType) => {
    switch (type) {
      case "T":
        return (
          <span
            title="Theory Classroom Session"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-500/30"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
            T (Theory)
          </span>
        );
      case "P":
        return (
          <span
            title="Practical / Simulator Lab Session"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/30"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            P (Practical)
          </span>
        );
      case "O":
        return (
          <span
            title="On-site / Workshop / Field Drill"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-500/30"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            O (On-Site)
          </span>
        );
      default:
        return <span>{type}</span>;
    }
  };

  const renderStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <svg className="h-3 w-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Present
          </span>
        );
      case "Absent":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            <svg className="h-3 w-3 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Absent
          </span>
        );
      case "Late":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            <svg className="h-3 w-3 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Late
          </span>
        );
      case "Excused":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
            <svg className="h-3 w-3 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excused
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-14 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <LogoSpinner
          size="md"
          label="Loading Attendance Logs..."
          sublabel="Fetching student attendance records and biometric logs"
        />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
          No Attendance Logs Found
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          No attendance records match the selected filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-100 bg-gray-50/75 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 font-semibold uppercase tracking-wider text-[11px]">
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Student & Batch
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Subject / Curriculum Topic
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Type (T,P,O)
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Duration
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold uppercase tracking-wider text-[11px]">
                Remarks / Notes
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right font-semibold uppercase tracking-wider text-[11px]">
                Quick Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {records.map((record) => (
              <tr
                key={record.id}
                className="transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
              >
                {/* 1. Date */}
                <td className="whitespace-nowrap py-4 pl-6 pr-3 font-medium text-gray-900 dark:text-white">
                  <div className="flex flex-col">
                    <span className="font-semibold">{formatDate(record.date)}</span>
                    <span className="text-[10px] text-gray-400">{record.date}</span>
                  </div>
                </td>

                {/* 2. Student & Batch */}
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      {getInitials(record.studentName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {record.studentName}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                        <span>{record.rollNo || record.studentId}</span>
                        <span>•</span>
                        <span className="truncate max-w-[120px]" title={record.batchName}>
                          {record.batchCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 3. Subject / Topic from NLETA */}
                <td className="px-3 py-4 min-w-[220px]">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1" title={record.topic}>
                      {record.topic}
                    </p>
                    {record.moduleName && (
                      <span className="inline-block text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        {record.moduleName} · {record.trainerName}
                      </span>
                    )}
                  </div>
                </td>

                {/* 4. Type (T, P, O) */}
                <td className="whitespace-nowrap px-3 py-4">
                  {renderTypeBadge(record.type)}
                </td>

                {/* 5. Duration */}
                <td className="whitespace-nowrap px-3 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {record.duration} {record.duration === 1 ? "Hr" : "Hrs"}
                  </span>
                </td>

                {/* 6. Status */}
                <td className="whitespace-nowrap px-3 py-4">
                  {renderStatusBadge(record.status)}
                </td>

                {/* 7. Remarks */}
                <td className="px-3 py-4 text-gray-500 dark:text-gray-400 min-w-[160px]">
                  <p className="line-clamp-1 italic text-[11px]">
                    {record.remarks || "—"}
                  </p>
                </td>

                {/* 8. Quick Action */}
                <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right">
                  <div className="relative inline-block text-left">
                    <select
                      value={record.status}
                      onChange={(e) =>
                        onStatusChange &&
                        onStatusChange(record.id, e.target.value as AttendanceStatus)
                      }
                      title="Update attendance status"
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-700 shadow-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Excused">Excused</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer info bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
        <span>
          Showing <strong className="text-gray-900 dark:text-white">{records.length}</strong> logged attendance entries
        </span>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[11px]">T = Theory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px]">P = Practical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-[11px]">O = On-Site / Field</span>
          </div>
        </div>
      </div>
    </div>
  );
}

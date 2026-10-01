"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Breadcrumb, Button } from "@/components/ui";
import {
  AttendanceRecord,
  AttendanceSession,
  AttendanceFilterState,
  AttendanceStatus,
  CurriculumTopic,
} from "@/types/attendance";
import { Batch } from "@/types/batch";
import { Course } from "@/types/course";
import { Admission } from "@/types/admission";
import { attendanceService } from "@/services/attendanceService";
import { batchService } from "@/services/batchService";
import { courseService } from "@/services/courseService";
import { admissionService } from "@/services/admissionService";

import AttendanceStatsCards from "@/components/attendance/AttendanceStatsCards";
import AttendanceFilterBar from "@/components/attendance/AttendanceFilterBar";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceMarkModal from "@/components/attendance/AttendanceMarkModal";
import AttendanceTypeDistribution from "@/components/attendance/AttendanceTypeDistribution";
import AttendanceBatchSessionView from "@/components/attendance/AttendanceBatchSessionView";

export default function AttendancePage() {
  // State
  const [activeTab, setActiveTab] = useState<"records" | "sessions" | "curriculum">("records");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Admission[]>([]);
  const [curriculumTopics, setCurriculumTopics] = useState<CurriculumTopic[]>([]);

  const [isMarkModalOpen, setIsMarkModalOpen] = useState<boolean>(false);

  // Filter State
  const [filters, setFilters] = useState<AttendanceFilterState>({
    searchQuery: "",
    batchCode: "all",
    courseCode: "all",
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Load data
  const loadData = async () => {
    const [allBatches, allCourses] = await Promise.all([
      batchService.getBatches(),
      courseService.getCourses(),
    ]);
    setRecords(attendanceService.getRecords());
    setSessions(attendanceService.getSessions());
    setCurriculumTopics(attendanceService.getCurriculumTopics());
    setBatches(allBatches);
    setCourses(allCourses);
    setStudents(admissionService.getAdmissions());
  };

  useEffect(() => {
    loadData();
    const unsubAtt = attendanceService.subscribe(loadData);
    const unsubBatches = batchService.subscribe(loadData);
    const unsubAdmissions = admissionService.subscribeToChanges(loadData);
    return () => {
      unsubAtt();
      unsubBatches();
      unsubAdmissions();
    };
  }, []);

  // Filtered attendance records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Search query
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = rec.studentName.toLowerCase().includes(query);
        const matchesRoll = (rec.rollNo || "").toLowerCase().includes(query);
        const matchesTopic = rec.topic.toLowerCase().includes(query);
        const matchesTrainer = (rec.trainerName || "").toLowerCase().includes(query);
        if (!matchesName && !matchesRoll && !matchesTopic && !matchesTrainer) {
          return false;
        }
      }

      // Batch filter
      if (filters.batchCode !== "all" && rec.batchCode !== filters.batchCode) {
        return false;
      }

      // Type filter (T, P, O)
      if (filters.type !== "all" && rec.type !== filters.type) {
        return false;
      }

      // Status filter (Present, Absent, Late, Excused)
      if (filters.status !== "all" && rec.status !== filters.status) {
        return false;
      }

      // Date from
      if (filters.dateFrom && rec.date < filters.dateFrom) {
        return false;
      }

      // Date to
      if (filters.dateTo && rec.date > filters.dateTo) {
        return false;
      }

      return true;
    });
  }, [records, filters]);

  // Overall metrics
  const metrics = useMemo(() => {
    return attendanceService.getMetrics();
  }, [records]);

  // Filter handlers
  const handleFilterChange = (updates: Partial<AttendanceFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      batchCode: "all",
      courseCode: "all",
      type: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Status toggle handler
  const handleRecordStatusChange = (
    recordId: string,
    newStatus: AttendanceStatus
  ) => {
    attendanceService.updateRecordStatus(recordId, newStatus);
  };

  // Modal save session handler
  const handleSaveSession = (
    newSession: Partial<AttendanceSession>,
    recordList: Partial<AttendanceRecord>[]
  ) => {
    attendanceService.addSessionWithRecords(newSession, recordList);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Record ID",
      "Date",
      "Student Name",
      "Roll / ID",
      "Batch Code",
      "Topic",
      "Type (T/P/O)",
      "Duration (Hours)",
      "Status",
      "Trainer",
      "Remarks",
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      `"${r.studentName}"`,
      r.rollNo || r.studentId,
      r.batchCode,
      `"${r.topic}"`,
      r.type,
      r.duration,
      r.status,
      `"${r.trainerName}"`,
      `"${r.remarks || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `nleta-attendance-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Attendance Management", active: true },
            ]}
          />
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Training Attendance & Hours Engine
            </h1>
            <span className="rounded-full bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300">
              NLETA Skill India Mission
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Track daily classroom and workshop attendance with Date, Duration, Type (T: Theory, P: Practical, O: On-Site), and candidate statuses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Export CSV
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsMarkModalOpen(true)}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Record Session Attendance
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <AttendanceStatsCards metrics={metrics} />

      {/* Curriculum Hours Breakdown */}
      <AttendanceTypeDistribution
        theoryHours={metrics.theoryHours}
        practicalHours={metrics.practicalHours}
        onsiteHours={metrics.onsiteHours}
      />

      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("records")}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === "records"
                ? "text-brand-600 dark:text-brand-400"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Daily Attendance Logs ({records.length})
            {activeTab === "records" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("sessions")}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === "sessions"
                ? "text-brand-600 dark:text-brand-400"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Cohort Session Sheets ({sessions.length})
            {activeTab === "sessions" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("curriculum")}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === "curriculum"
                ? "text-brand-600 dark:text-brand-400"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Curriculum Blueprint Reference (courses-and-batches.txt)
            {activeTab === "curriculum" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: Daily Attendance Records */}
      {activeTab === "records" && (
        <div className="space-y-4">
          <AttendanceFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            availableBatches={batches.map((b) => ({
              code: b.batchCode,
              name: b.batchName,
            }))}
            availableCourses={courses.map((c) => ({
              code: c.courseCode,
              name: c.courseName,
            }))}
          />

          <AttendanceTable
            records={filteredRecords}
            onStatusChange={handleRecordStatusChange}
          />
        </div>
      )}

      {/* TAB 2: Batch Session Sheets */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Conducted Training Sessions
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing {sessions.length} sessions
            </span>
          </div>

          <AttendanceBatchSessionView sessions={sessions} />
        </div>
      )}

      {/* TAB 3: Curriculum Blueprint Reference */}
      {activeTab === "curriculum" && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Detailed Curriculum Blueprint (NLETA SKILL INDIA MISSION)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Standard syllabus hours breakdown: Theory (T), Practical (P), and On-site (O) as per course specifications.
              </p>
            </div>
            <span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              Theory (T) · Practical (P) · On-Site (O)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-3 font-semibold uppercase text-[10px]">Module Code</th>
                  <th scope="col" className="py-3 px-3 font-semibold uppercase text-[10px]">Domain / Category</th>
                  <th scope="col" className="py-3 px-3 font-semibold uppercase text-[10px]">Subjects & Topics</th>
                  <th scope="col" className="py-3 px-3 text-center font-semibold uppercase text-[10px]">T (Theory)</th>
                  <th scope="col" className="py-3 px-3 text-center font-semibold uppercase text-[10px]">P (Practical)</th>
                  <th scope="col" className="py-3 px-3 text-center font-semibold uppercase text-[10px]">O (On-Site)</th>
                  <th scope="col" className="py-3 px-3 text-center font-semibold uppercase text-[10px]">Total Hrs</th>
                  <th scope="col" className="py-3 px-3 font-semibold uppercase text-[10px]">Applicable Roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {curriculumTopics.map((top) => (
                  <tr key={top.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {top.topicCode}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {top.moduleName}
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white max-w-sm">
                      {top.topicTitle}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-blue-600 dark:text-blue-400">
                      {top.theoryHours}h
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {top.practicalHours}h
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-600 dark:text-amber-400">
                      {top.onsiteHours}h
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-gray-900 dark:text-white">
                      {top.totalHours}h
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {top.applicablePrograms.map((p) => (
                          <span
                            key={p}
                            className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Attendance Modal */}
      <AttendanceMarkModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        onSaveSession={handleSaveSession}
        batches={batches}
        courses={courses}
        students={students}
        curriculumTopics={curriculumTopics}
      />
    </div>
  );
}

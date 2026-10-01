"use client";

import React, { useState, useEffect } from "react";
import {
  AttendanceType,
  AttendanceStatus,
  AttendanceRecord,
  AttendanceSession,
  AttendanceMarkModalProps,
} from "@/types/attendance";

export default function AttendanceMarkModal({
  isOpen,
  onClose,
  onSaveSession,
  batches,
  courses,
  students,
  curriculumTopics,
}: AttendanceMarkModalProps) {
  // Form State
  const [selectedBatchCode, setSelectedBatchCode] = useState<string>(
    batches[0]?.batchCode || ""
  );
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [duration, setDuration] = useState<number>(2);
  const [attendanceType, setAttendanceType] = useState<AttendanceType>("T");
  const [selectedTopic, setSelectedTopic] = useState<string>(
    curriculumTopics[0]?.topicTitle || ""
  );
  const [trainerName, setTrainerName] = useState<string>(
    batches[0]?.trainerName || "Prof. Rajesh Sharma"
  );
  const [sessionNotes, setSessionNotes] = useState<string>("");

  // Student roster state for this session
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});

  // Filter students enrolled in the selected batch
  const batchStudents = students.filter(
    (s) => s.batchCode === selectedBatchCode
  );

  // When selected batch changes, sync trainer and initialize student statuses
  useEffect(() => {
    const activeBatch = batches.find((b) => b.batchCode === selectedBatchCode);
    if (activeBatch) {
      setTrainerName(activeBatch.trainerName);
    }

    const currentBatchStudents = students.filter(
      (s) => s.batchCode === selectedBatchCode
    );

    const initialMap: Record<
      string,
      { status: AttendanceStatus; remarks: string }
    > = {};

    currentBatchStudents.forEach((st) => {
      initialMap[st.studentId] = {
        status: "Present",
        remarks: "",
      };
    });

    setStudentStatuses(initialMap);
  }, [selectedBatchCode, batches, students]);

  if (!isOpen) return null;

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    batchStudents.forEach((st) => {
      updated[st.studentId] = {
        status,
        remarks: studentStatuses[st.studentId]?.remarks || "",
      };
    });
    setStudentStatuses(updated);
  };

  const handleIndividualStatusChange = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleIndividualRemarksChange = (
    studentId: string,
    remarks: string
  ) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activeBatch = batches.find((b) => b.batchCode === selectedBatchCode);
    const activeCourse = courses.find((c) => c.courseCode === activeBatch?.courseCode);
    const topicObj = curriculumTopics.find((t) => t.topicTitle === selectedTopic);

    const sessionId = `ses-${Date.now()}`;
    const sessionCode = `SES-${sessionDate.replace(/-/g, "")}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;

    const generatedRecords: Partial<AttendanceRecord>[] = batchStudents.map(
      (st) => {
        const studentState = studentStatuses[st.studentId] || {
          status: "Present",
          remarks: "",
        };

        if (studentState.status === "Present") presentCount++;
        else if (studentState.status === "Absent") absentCount++;
        else if (studentState.status === "Late") lateCount++;
        else if (studentState.status === "Excused") excusedCount++;

        return {
          id: `att-${st.studentId}-${Date.now()}`,
          sessionId,
          studentId: st.studentId,
          studentName: st.studentName,
          rollNo: st.registrationId || st.studentId,
          batchCode: selectedBatchCode,
          batchName: activeBatch?.batchName || selectedBatchCode,
          courseCode: activeCourse?.courseCode || "",
          courseName: activeCourse?.courseName || "",
          date: sessionDate,
          duration,
          type: attendanceType,
          status: studentState.status,
          topic: selectedTopic,
          moduleName: topicObj?.moduleName || "Curriculum Session",
          trainerName,
          remarks: studentState.remarks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    );

    const newSession: Partial<AttendanceSession> = {
      id: sessionId,
      sessionCode,
      batchCode: selectedBatchCode,
      batchName: activeBatch?.batchName || selectedBatchCode,
      courseCode: activeCourse?.courseCode || "",
      courseName: activeCourse?.courseName || "",
      date: sessionDate,
      duration,
      type: attendanceType,
      topic: selectedTopic,
      moduleName: topicObj?.moduleName || "Curriculum Module",
      trainerName,
      status: "Completed",
      totalStudents: batchStudents.length,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      notes: sessionNotes,
    };

    onSaveSession(newSession, generatedRecords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </span>
              Record Session Attendance
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Log date, duration, curriculum type (T, P, O), and candidate statuses
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Top Session Parameters */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {/* Batch Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Select Cohort / Batch *
              </label>
              <select
                value={selectedBatchCode}
                onChange={(e) => setSelectedBatchCode(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {batches.map((b) => (
                  <option key={b.batchCode} value={b.batchCode}>
                    {b.batchCode} - {b.batchName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Session Date *
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Duration (Hours) *
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours (Standard)</option>
                <option value={3}>3 Hours</option>
                <option value={4}>4 Hours (Half Day)</option>
                <option value={6}>6 Hours</option>
                <option value={8}>8 Hours (Full Day / Workshop)</option>
              </select>
            </div>
          </div>

          {/* Curriculum Type (T, P, O) Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Session Type (T, P, O) *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Theory T */}
              <button
                type="button"
                onClick={() => setAttendanceType("T")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  attendanceType === "T"
                    ? "border-blue-500 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white font-bold text-xs mb-1">
                  T
                </span>
                <span className="text-xs font-bold">Theory</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Classroom / Concepts
                </span>
              </button>

              {/* Practical P */}
              <button
                type="button"
                onClick={() => setAttendanceType("P")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  attendanceType === "P"
                    ? "border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs mb-1">
                  P
                </span>
                <span className="text-xs font-bold">Practical</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Lab & Simulation
                </span>
              </button>

              {/* On-Site O */}
              <button
                type="button"
                onClick={() => setAttendanceType("O")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  attendanceType === "O"
                    ? "border-amber-500 bg-amber-50/80 text-amber-900 ring-2 ring-amber-500/20 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs mb-1">
                  O
                </span>
                <span className="text-xs font-bold">On-Site / Other</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Field / Workshop
                </span>
              </button>
            </div>
          </div>

          {/* Curriculum Topic & Trainer */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Curriculum Topic (NLETA Reference) *
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {curriculumTopics.map((t) => (
                  <option key={t.id} value={t.topicTitle}>
                    [{t.topicCode}] {t.topicTitle} (T:{t.theoryHours}h, P:{t.practicalHours}h, O:{t.onsiteHours}h)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Trainer / Instructor *
              </label>
              <input
                type="text"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                required
                placeholder="Trainer name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Student Roster Marking Table */}
          <div className="rounded-2xl border border-gray-200/80 bg-gray-50/30 p-4 dark:border-gray-800 dark:bg-gray-800/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Student Attendance Roster ({batchStudents.length} Students)
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Toggle status for each candidate
                </p>
              </div>

              {/* Bulk mark helpers */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMarkAll("Present")}
                  className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  ✓ All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll("Absent")}
                  className="rounded-lg bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-800 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
                >
                  ✗ All Absent
                </button>
              </div>
            </div>

            {batchStudents.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                No active students found in this batch. Please select another batch.
              </div>
            ) : (
              <div className="divide-y divide-gray-200/60 dark:divide-gray-700/60 max-h-56 overflow-y-auto pr-1">
                {batchStudents.map((st) => {
                  const currentStatus =
                    studentStatuses[st.studentId]?.status || "Present";
                  const currentRemarks =
                    studentStatuses[st.studentId]?.remarks || "";

                  return (
                    <div
                      key={st.studentId}
                      className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-[10px] font-bold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                          {st.studentName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {st.studentName}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            {st.studentId} · {st.registrationId}
                          </p>
                        </div>
                      </div>

                      {/* Status selectors */}
                      <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800">
                          {(["Present", "Absent", "Late", "Excused"] as AttendanceStatus[]).map(
                            (stOption) => (
                              <button
                                key={stOption}
                                type="button"
                                onClick={() =>
                                  handleIndividualStatusChange(st.studentId, stOption)
                                }
                                className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                                  currentStatus === stOption
                                    ? stOption === "Present"
                                      ? "bg-emerald-500 text-white"
                                      : stOption === "Absent"
                                      ? "bg-rose-500 text-white"
                                      : stOption === "Late"
                                      ? "bg-amber-500 text-white"
                                      : "bg-purple-500 text-white"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                }`}
                              >
                                {stOption}
                              </button>
                            )
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Remarks..."
                          value={currentRemarks}
                          onChange={(e) =>
                            handleIndividualRemarksChange(st.studentId, e.target.value)
                          }
                          className="w-28 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Session Delivery Notes / Observations (Optional)
            </label>
            <textarea
              rows={2}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="e.g. Conducted safety simulation test; all students cleared PPE checklist."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={batchStudents.length === 0}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Save Attendance Sheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

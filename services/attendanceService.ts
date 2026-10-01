import {
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  CurriculumTopic,
  AttendanceMetrics,
} from "@/types/attendance";
import {
  initialAttendanceRecords,
  initialAttendanceSessions,
  curriculumTopics,
  calculateAttendanceMetrics,
} from "@/data/attendanceData";

const STORAGE_RECORDS_KEY = "crm_attendance_records_v1";
const STORAGE_SESSIONS_KEY = "crm_attendance_sessions_v1";
export const CRM_ATTENDANCE_CHANGED_EVENT = "crm_attendance_changed";

const isBrowser = typeof window !== "undefined";

function triggerAttendanceEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_ATTENDANCE_CHANGED_EVENT, {
        detail: { type: "attendance" },
      })
    );
  }
}

export const attendanceService = {
  getRecords: function (): AttendanceRecord[] {
    if (!isBrowser) return initialAttendanceRecords;
    try {
      const stored = localStorage.getItem(STORAGE_RECORDS_KEY);
      if (!stored) {
        localStorage.setItem(
          STORAGE_RECORDS_KEY,
          JSON.stringify(initialAttendanceRecords)
        );
        return initialAttendanceRecords;
      }
      return JSON.parse(stored);
    } catch {
      return initialAttendanceRecords;
    }
  },

  getSessions: function (): AttendanceSession[] {
    if (!isBrowser) return initialAttendanceSessions;
    try {
      const stored = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (!stored) {
        localStorage.setItem(
          STORAGE_SESSIONS_KEY,
          JSON.stringify(initialAttendanceSessions)
        );
        return initialAttendanceSessions;
      }
      return JSON.parse(stored);
    } catch {
      return initialAttendanceSessions;
    }
  },

  getCurriculumTopics: function (): CurriculumTopic[] {
    return curriculumTopics;
  },

  getMetrics: function (): AttendanceMetrics {
    const records = this.getRecords();
    return calculateAttendanceMetrics(records);
  },

  updateRecordStatus: function (
    recordId: string,
    newStatus: AttendanceStatus
  ): AttendanceRecord | null {
    const records = this.getRecords();
    const index = records.findIndex((r) => r.id === recordId);
    if (index === -1) return null;

    const updated: AttendanceRecord = {
      ...records[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    records[index] = updated;

    if (isBrowser) {
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
      triggerAttendanceEvent();
    }

    return updated;
  },

  addSessionWithRecords: function (
    sessionData: Partial<AttendanceSession>,
    recordList: Partial<AttendanceRecord>[]
  ): AttendanceSession {
    const sessions = this.getSessions();
    const records = this.getRecords();

    const sessionId = sessionData.id || `ses-${Date.now()}`;
    const newSession: AttendanceSession = {
      id: sessionId,
      sessionCode:
        sessionData.sessionCode ||
        `SES-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
          100 + Math.random() * 900
        )}`,
      batchCode: sessionData.batchCode || "",
      batchName: sessionData.batchName || sessionData.batchCode || "",
      courseCode: sessionData.courseCode || "",
      courseName: sessionData.courseName || "",
      date: sessionData.date || new Date().toISOString().slice(0, 10),
      duration: sessionData.duration || 2,
      type: sessionData.type || "T",
      topic: sessionData.topic || "General Curriculum Session",
      moduleName: sessionData.moduleName || "Curriculum Module",
      trainerName: sessionData.trainerName || "Faculty Instructor",
      status: sessionData.status || "Completed",
      totalStudents: recordList.length,
      presentCount: recordList.filter((r) => r.status === "Present").length,
      absentCount: recordList.filter((r) => r.status === "Absent").length,
      lateCount: recordList.filter((r) => r.status === "Late").length,
      excusedCount: recordList.filter((r) => r.status === "Excused").length,
      records: [],
      notes: sessionData.notes,
    };

    const newFullRecords: AttendanceRecord[] = recordList.map((r, i) => ({
      id: r.id || `att-${Date.now()}-${i}`,
      sessionId,
      studentId: r.studentId || `STU-${i}`,
      studentName: r.studentName || "Student",
      rollNo: r.rollNo || r.studentId || `ROL-${i}`,
      batchCode: newSession.batchCode,
      batchName: newSession.batchName,
      courseCode: newSession.courseCode,
      courseName: newSession.courseName,
      date: newSession.date,
      duration: newSession.duration,
      type: newSession.type,
      status: r.status || "Present",
      topic: newSession.topic,
      moduleName: newSession.moduleName,
      trainerName: newSession.trainerName,
      remarks: r.remarks || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    newSession.records = newFullRecords;

    const updatedSessions = [newSession, ...sessions];
    const updatedRecords = [...newFullRecords, ...records];

    if (isBrowser) {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(updatedSessions));
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(updatedRecords));
      triggerAttendanceEvent();
    }

    return newSession;
  },

  getStudentAttendance: function (studentId: string): {
    records: AttendanceRecord[];
    totalHours: number;
    theoryHours: number;
    practicalHours: number;
    onsiteHours: number;
    attendanceRate: number;
  } {
    const all = this.getRecords();
    const records = all.filter((r) => r.studentId === studentId);

    let theoryHours = 0;
    let practicalHours = 0;
    let onsiteHours = 0;

    records.forEach((r) => {
      if (r.status === "Present" || r.status === "Late") {
        if (r.type === "T") theoryHours += r.duration;
        else if (r.type === "P") practicalHours += r.duration;
        else if (r.type === "O") onsiteHours += r.duration;
      }
    });

    const totalHours = theoryHours + practicalHours + onsiteHours;
    const presentCount = records.filter(
      (r) => r.status === "Present" || r.status === "Late"
    ).length;
    const attendanceRate =
      records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

    return {
      records,
      totalHours,
      theoryHours,
      practicalHours,
      onsiteHours,
      attendanceRate,
    };
  },

  subscribe: function (callback: () => void): () => void {
    if (!isBrowser) return () => {};
    const handler = () => callback();
    window.addEventListener(CRM_ATTENDANCE_CHANGED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CRM_ATTENDANCE_CHANGED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

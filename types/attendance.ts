import { Admission } from "./admission";
import { Batch } from "./batch";
import { Course } from "./course";

/**
 * Attendance Type based on NLETA Skill India Mission Curriculum:
 * - T: Theory
 * - P: Practical
 * - O: On-site / Workshop / Field / Other
 */
export type AttendanceType = "T" | "P" | "O";

/**
 * Attendance Status for individual student records
 */
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export type AttendanceSessionStatus = "Completed" | "Scheduled" | "In-Progress" | "Cancelled" | number;

/**
 * Single student attendance record
 */
export interface AttendanceRecord {
  id: string;
  sessionId?: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  batchCode: string;
  batchName: string;
  courseCode: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  duration: number; // Duration in hours (e.g. 2, 4, 8)
  type: AttendanceType; // T (Theory), P (Practical), O (On-site/Other)
  status: AttendanceStatus; // Present, Absent, Late, Excused
  topic: string; // e.g. "General Safety & PPE", "IS 14665 Part-1"
  moduleName?: string;
  trainerName: string;
  timeIn?: string;
  timeOut?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Curriculum topic blueprint from NLETA course guidelines
 */
export interface CurriculumTopic {
  id: string;
  topicCode: string;
  moduleNumber: string;
  moduleName: string;
  topicTitle: string;
  theoryHours: number; // T
  practicalHours: number; // P
  onsiteHours: number; // O
  totalHours: number;
  applicablePrograms: string[];
}

/**
 * Batch-level attendance session summary
 */
export interface AttendanceSession {
  id: string;
  sessionCode: string;
  batchCode: string;
  batchName: string;
  courseCode: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  duration: number; // in hours
  type: AttendanceType; // T | P | O
  topic: string;
  moduleName: string;
  trainerName: string;
  status: AttendanceSessionStatus;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  records: AttendanceRecord[];
  notes?: string;
}

/**
 * Filter parameters for attendance queries
 */
export interface AttendanceFilterState {
  searchQuery: string;
  batchCode: string;
  courseCode: string;
  type: string; // "all" | "T" | "P" | "O"
  status: string; // "all" | "Present" | "Absent" | "Late" | "Excused"
  dateFrom: string;
  dateTo: string;
}

/**
 * Aggregate summary metrics
 */
export interface AttendanceMetrics {
  totalLoggedSessions: number;
  totalLoggedHours: number;
  theoryHours: number; // T
  practicalHours: number; // P
  onsiteHours: number; // O
  overallAttendanceRate: number; // Percentage
  totalStudentsTracked: number;
  presentMarksCount: number;
  absentMarksCount: number;
  lateMarksCount: number;
}

/**
 * Component Props
 */
export interface AttendanceStatsCardsProps {
  metrics: AttendanceMetrics;
}

export interface AttendanceFilterBarProps {
  filters: AttendanceFilterState;
  onFilterChange: (filters: Partial<AttendanceFilterState>) => void;
  onResetFilters: () => void;
  availableBatches: { code: string; name: string }[];
  availableCourses: { code: string; name: string }[];
}

export interface AttendanceTableProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
  onStatusChange?: (recordId: string, newStatus: AttendanceStatus) => void;
  onViewDetails?: (record: AttendanceRecord) => void;
}

export interface AttendanceMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (session: Partial<AttendanceSession>, records: Partial<AttendanceRecord>[]) => void;
  batches: Batch[];
  courses: Course[];
  students: Admission[];
  curriculumTopics: CurriculumTopic[];
}

export interface AttendanceTypeDistributionProps {
  theoryHours: number;
  practicalHours: number;
  onsiteHours: number;
  targetTheoryHours?: number;
  targetPracticalHours?: number;
  targetOnsiteHours?: number;
}

export interface AttendanceBatchSessionViewProps {
  sessions: AttendanceSession[];
  onSelectSession?: (session: AttendanceSession) => void;
}

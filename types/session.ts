import { Batch } from "./batch";
import { Course } from "./course";

/**
 * Academic Session Status (TinyInteger from Laravel Migration):
 * 1 = Upcoming
 * 2 = Active / Ongoing
 * 3 = Completed
 * 4 = Archived / Inactive
 */
export const ACADEMIC_SESSION_STATUS = {
  UPCOMING: 1,
  ACTIVE: 2,
  COMPLETED: 3,
  ARCHIVED: 4,
} as const;

export type AcademicSessionStatus = 1 | 2 | 3 | 4;

export const ACADEMIC_SESSION_STATUS_LABELS: Record<AcademicSessionStatus, string> = {
  1: "Upcoming",
  2: "Active",
  3: "Completed",
  4: "Archived",
};


export interface AcademicSession {
  id: string | number;
  name: string; // e.g. "2025-2026", "2026-2027", "Session 2026"
  code: string; // e.g. "SESS-2025-26", "SESS-2026-27"
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  is_current: boolean; // True if current active academic session
  status: AcademicSessionStatus; // 1=Upcoming, 2=Active/Ongoing, 3=Completed, 4=Archived/Inactive
  description?: string | null;
  created_by?: number | null; // code-level relation with users
  created_at?: string;
  updated_at?: string;

  // Frontend dynamic calculated metrics
  runningBatchesCount?: number;
  totalEnrolledStudents?: number;
  totalCapacitySeats?: number;

  // Backwards-compatible aliases
  sessionName?: string;
  sessionCode?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

// Backwards compatibility alias
export type SessionStatus = AcademicSessionStatus;
export type TrainingSession = AcademicSession;

/**
 * Data Transfer Objects (DTOs) for Academic Session API
 */
export interface CreateAcademicSessionDTO {
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  is_current?: boolean;
  status?: AcademicSessionStatus;
  description?: string | null;
  created_by?: number | null;
}

export interface UpdateAcademicSessionDTO {
  name?: string;
  code?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  status?: AcademicSessionStatus;
  description?: string | null;
}

export interface AcademicSessionQueryParams {
  search?: string;
  status?: AcademicSessionStatus | "all" | string | number;
  year?: string;
  is_current?: boolean | number | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  with_batches?: boolean;
  with_metrics?: boolean;
  [key: string]: any;
}

/**
 * Cache Storage Envelope for Academic Sessions with TTL timestamp
 */
export interface SessionCacheEnvelope {
  data: AcademicSession[];
  cachedAt: number; // Timestamp in milliseconds
}

export type AcademicSessionCacheEnvelope = SessionCacheEnvelope;

/**
 * Filter Parameters for Academic Session queries
 */
export interface AcademicSessionFilterState {
  searchQuery: string;
  status: "all" | string | number; // "all" | 1 | 2 | 3 | 4
  year: string; // "all" | "2025" | "2026" | "2027"
}

export type SessionFilterState = AcademicSessionFilterState;

/**
 * Academic Session Aggregate Metrics
 */
export interface AcademicSessionMetrics {
  totalAcademicSessions: number;
  activeSessionName: string;
  activeSessionCode: string;
  totalRunningBatches: number;
  totalEnrolledStudents: number;
  overallCapacitySeats: number;
  occupancyPercentage: number;
  upcomingSessionsCount: number;
}

export type SessionMetrics = AcademicSessionMetrics;

/**
 * Component Props
 */
export interface AcademicSessionStatsCardsProps {
  metrics: AcademicSessionMetrics;
}

export interface AcademicSessionFilterBarProps {
  filters: AcademicSessionFilterState;
  onFilterChange: (updates: Partial<AcademicSessionFilterState>) => void;
  onResetFilters: () => void;
}

export interface AcademicSessionTableProps {
  sessions: AcademicSession[];
  isLoading?: boolean;
  onViewBatches: (session: AcademicSession) => void;
  onEditSession: (session: AcademicSession) => void;
  onDeleteSession: (session: AcademicSession) => void;
  onSetAsCurrent: (session: AcademicSession) => void;
}

export interface AcademicSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (sessionData: Partial<AcademicSession>) => void;
  initialSession?: AcademicSession | null;
}

export interface AcademicSessionDetailModalProps {
  session: AcademicSession | null;
  isOpen: boolean;
  onClose: () => void;
  batches: Batch[];
  courses: Course[];
  onViewBatchDetail?: (batch: Batch) => void;
}

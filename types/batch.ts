import { Course } from "./course";

export type BatchMode = "Offline (Classroom)" | "Online (Live)" | "Hybrid";

/**
 * Batch Status (TinyInteger from Laravel Migration):
 * 1 = Upcoming
 * 2 = Ongoing
 * 3 = Completed
 * 4 = Cancelled / Full
 */
export const BATCH_STATUS = {
  UPCOMING: 1,
  ONGOING: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

export type BatchStatus =
  | 1
  | 2
  | 3
  | 4
  | "Upcoming"
  | "Ongoing"
  | "Completed"
  | "Full"
  | "Cancelled";

export const BATCH_STATUS_LABELS: Record<number | string, string> = {
  1: "Upcoming",
  2: "Ongoing",
  3: "Completed",
  4: "Cancelled",
  Upcoming: "Upcoming",
  Ongoing: "Ongoing",
  Completed: "Completed",
  Full: "Full",
  Cancelled: "Cancelled",
};

export interface Batch {
  id: string | number;
  name: string; // Batch Name from DB
  code: string; // Unique Identifier (e.g. BAT-2026-WD01)
  academic_session_id?: number | null; // Code-level relation with AcademicSession
  start_date?: string | null; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
  timing?: string | null; // e.g. "09:00 AM - 01:00 PM"
  capacity: number; // Default 30
  status: BatchStatus; // 1=Upcoming, 2=Ongoing, 3=Completed, 4=Cancelled
  instructor_id?: number | null; // Code-level relation with users
  created_by?: number | null; // Code-level relation with users
  created_at?: string;
  updated_at?: string;

  // Code-level relationships
  courses?: Array<{
    id: number | string;
    name: string;
    code: string;
  }>;
  course_ids?: number[];
  academic_session?: {
    id: number | string;
    name: string;
    code: string;
  } | null;
  instructor?: {
    id: number | string;
    name: string;
    email?: string;
  } | null;
  creator?: {
    id: number | string;
    name: string;
  } | null;

  // Frontend / Backwards-compatible aliases
  batchCode: string; // Alias for `code`
  batchName: string; // Alias for `name`
  courseCodes?: string[]; // Multiple courses associated with this batch
  courseCode?: string; // Backwards compatible primary course code
  courseNames?: string[]; // Names of associated courses
  courseName?: string; // Backwards compatible primary course name
  academicSessionCode?: string; // Foreign key referencing AcademicSession code
  academicSessionName?: string;
  trainerName: string;
  startDate?: string; // Alias for `start_date`
  endDate?: string; // Alias for `end_date`
  scheduleTiming?: string; // Alias for `timing`
  mode?: BatchMode;
  maxSeats: number; // Alias for `capacity`
  enrolledSeats: number;
  classroomLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BatchFilterState {
  searchQuery: string;
  courseCode: string;
  mode: string;
  status: string;
}

/**
 * Data Transfer Objects (DTOs) for Batch API
 */
export interface CreateBatchDTO {
  name?: string;
  code?: string;
  academic_session_id?: number | null;
  course_ids?: number[];
  start_date?: string | null;
  end_date?: string | null;
  timing?: string | null;
  capacity?: number;
  status?: BatchStatus | number;
  instructor_id?: number | null;
  created_by?: number | null;

  // Frontend input aliases
  batchCode?: string;
  batchName?: string;
  courseCodes?: string[];
  courseCode?: string;
  courseNames?: string[];
  courseName?: string;
  academicSessionCode?: string;
  academicSessionName?: string;
  trainerName?: string;
  startDate?: string;
  endDate?: string;
  scheduleTiming?: string;
  mode?: BatchMode;
  maxSeats?: number;
  enrolledSeats?: number;
  classroomLocation?: string;
}

export interface UpdateBatchDTO extends Partial<CreateBatchDTO> {}

export interface BatchQueryParams {
  search?: string;
  course_id?: string | number;
  course_code?: string;
  academic_session_id?: string | number;
  mode?: string;
  status?: BatchStatus | "all" | string | number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  [key: string]: any;
}

/**
 * Cache Storage Envelope for Batches with TTL timestamp
 */
export interface BatchCacheEnvelope {
  data: Batch[];
  cachedAt: number;
}

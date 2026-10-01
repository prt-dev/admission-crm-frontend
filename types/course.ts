import { Batch } from "./batch";

export type CourseCategory =
  | "OVERVIEW OF NLETA SKILL INDIA MISSION"
  | "OVERVIEW OF ELEVATOR INDUSTRY"
  | "SAFETY TRAINING"
  | "OVERVIEW OF PREVAILING CODES AND STANDARDS"
  | "TRAINING FOR NEW INSTALLATIONS (NI)"
  | "TRAINING FOR EXISTING INSTALLATIONS (EI)"
  | (string & {});

/**
 * Course Status (TinyInteger from Laravel Migration):
 * 1 = Active
 * 2 = Inactive
 */
export const COURSE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
} as const;

export type CourseStatus = 1 | 2 | "Active" | "Inactive" | "Upcoming";

export const COURSE_STATUS_LABELS: Record<number | string, string> = {
  1: "Active",
  2: "Inactive",
  Active: "Active",
  Inactive: "Inactive",
  Upcoming: "Upcoming",
};

export interface Course {
  id: string | number;
  name: string; // Course Name from DB
  code: string; // Unique Course Code (e.g. CRS-FSWD-101)
  description?: string | null;
  duration?: string | null; // e.g. "6 Months (360 Hours)"
  fee?: number; // Numeric fee from DB
  status: CourseStatus; // 1=Active, 2=Inactive
  created_by?: number | null; // User ID
  created_at?: string;
  updated_at?: string;

  // Code-level relationships
  creator?: {
    id: number | string;
    name: string;
  } | null;
  batches?: Batch[];

  // Frontend / Backwards-compatible aliases
  courseCode: string; // Alias for `code`
  courseName: string; // Alias for `name`
  totalFee: number; // Alias for `fee`
  category?: CourseCategory;
  eligibility?: string;
  skillIndiaSector?: string;
  skillIndiaQpCode?: string;
  classroomLocation?: string;
  syllabusHighlights?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFilterState {
  searchQuery: string;
  category: string;
  status: string;
}

/**
 * Data Transfer Objects (DTOs) for Course API
 */
export interface CreateCourseDTO {
  name?: string;
  code?: string;
  description?: string | null;
  duration?: string | null;
  fee?: number;
  status?: CourseStatus | number;
  created_by?: number | null;

  // Frontend input aliases
  courseCode?: string;
  courseName?: string;
  category?: CourseCategory;
  totalFee?: number;
  eligibility?: string;
  skillIndiaSector?: string;
  skillIndiaQpCode?: string;
  classroomLocation?: string;
  syllabusHighlights?: string[];
}

export interface UpdateCourseDTO extends Partial<CreateCourseDTO> {}

export interface CourseQueryParams {
  search?: string;
  status?: CourseStatus | "all" | string | number;
  category?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  [key: string]: any;
}

/**
 * Cache Storage Envelope for Courses with TTL timestamp
 */
export interface CourseCacheEnvelope {
  data: Course[];
  cachedAt: number;
}

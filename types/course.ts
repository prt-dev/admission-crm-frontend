export type CourseCategory =
  | "IT & Software"
  | "Data Science & AI"
  | "Digital Marketing"
  | "Design & Multimedia"
  | "Electronics & Hardware"
  | "Healthcare"
  | "Vocational & Skills";

export type CourseStatus = "Active" | "Inactive" | "Upcoming";

export interface Course {
  id: string;
  courseCode: string; // Unique Identifier (e.g. CRS-FSWD-101)
  courseName: string;
  category: CourseCategory;
  duration: string; // e.g. "6 Months (360 Hours)"
  totalFee: number; // e.g. 45000
  eligibility: string; // e.g. "12th Pass or Graduate"
  skillIndiaSector: string; // e.g. "IT-ITeS Sector Skill Council"
  skillIndiaQpCode?: string; // e.g. "SSC/Q0501"
  status: CourseStatus;
  description: string;
  syllabusHighlights?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilterState {
  searchQuery: string;
  category: string;
  status: string;
}

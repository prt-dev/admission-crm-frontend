export type BatchStatus = "Upcoming" | "Ongoing" | "Completed" | "Full";
export type BatchMode = "Offline (Classroom)" | "Online (Live)" | "Hybrid";

export interface Batch {
  id: string;
  batchCode: string; // Unique Identifier (e.g. BAT-2026-WD01)
  batchName: string;
  courseCode: string; // Foreign key referencing Course.courseCode
  courseName?: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  scheduleTiming: string; // e.g. "09:30 AM - 12:30 PM (Mon-Fri)"
  mode: BatchMode;
  maxSeats: number;
  enrolledSeats: number;
  classroomLocation: string; // e.g. "Lab 302 / Smart Classroom"
  status: BatchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BatchFilterState {
  searchQuery: string;
  courseCode: string;
  mode: string;
  status: string;
}

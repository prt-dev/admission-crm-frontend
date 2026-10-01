import { Admission } from "./admission";
import { Course } from "./course";
import { Batch } from "./batch";

export type StudentTabType =
  | "overview"
  | "syllabus"
  | "attendance"
  | "schedule"
  | "fees"
  | "certificates";

export interface StudentScheduleSlot {
  day: string;
  timing: string;
  subject: string;
  instructor: string;
  location: string;
  status: "Active" | "Upcoming" | "Completed";
}

export interface StudentProfileCardProps {
  admission: Admission;
}

export interface StudentStatsCardsProps {
  admission: Admission;
  course?: Course;
  batch?: Batch;
}

export interface StudentSyllabusSectionProps {
  course?: Course;
}

export interface StudentScheduleSectionProps {
  batch?: Batch;
}

export interface StudentFeeBreakdownProps {
  admission: Admission;
}

export interface StudentCertificatesSectionProps {
  admission: Admission;
  course?: Course;
}

export interface StudentAttendanceSectionProps {
  admission: Admission;
}

export interface StudentDashboardViewProps {
  customAdmission?: Admission;
}

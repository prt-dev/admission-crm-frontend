export type QualificationType =
  | "10th Pass"
  | "12th Pass (Science)"
  | "12th Pass (Commerce)"
  | "12th Pass (Arts)"
  | "Diploma (Polytechnic)"
  | "B.Tech / B.E."
  | "BCA / B.Sc (IT/CS)"
  | "B.Com / BBA"
  | "B.A."
  | "MCA / M.Tech / M.Sc"
  | "Post Graduate"
  | "Other";

export type AdmissionStatus = "Active" | "Inactive" | "Certified";

export type PaymentStatus = "Paid" | "Partial" | "Pending";

export interface Admission {
  id: string; // Unique internal ID
  studentId: string; // Auto generated: e.g. STU-2026-0001 (Mandatory)
  registrationId: string; // Text: e.g. REG-2026-7890 (Mandatory)
  studentName: string; // Text (Mandatory)
  mobile: string; // Text (Mandatory)
  email?: string; // Text (Optional)
  aadhaar: string; // Text: 12 digits (Mandatory)
  qualification: string; // Text (Mandatory)
  courseCode: string; // References Course.courseCode (Mandatory)
  courseName?: string;
  batchCode: string; // References Batch.batchCode (Mandatory)
  batchName?: string;
  skillIndiaRegId: string; // Text (Mandatory)
  admissionDate: string; // YYYY-MM-DD
  status: AdmissionStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  totalFee: number;
  notes?: string;
  guardianName?: string;
  guardianMobile?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionFilterState {
  searchQuery: string;
  courseCode: string;
  batchCode: string;
  status: string;
  paymentStatus: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Re-export Course and Batch types for backwards compatibility
export * from "./course";
export * from "./batch";

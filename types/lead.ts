export type LeadStatus =
  | "New"
  | "Contacted"
  | "Follow-up"
  | "Qualified"
  | "Converted"
  | "Closed";

export interface Lead {
  id: string;
  leadCode: string; // e.g. LED-2026-001
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilterState {
  searchQuery: string;
  status: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  source?: string;
}

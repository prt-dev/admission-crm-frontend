export type DashboardStatType =
  | "applications"
  | "leads"
  | "admissions"
  | "revenue";

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  type: DashboardStatType;
}

export type ApplicationStatus =
  | "Verified"
  | "Under Review"
  | "Fee Pending"
  | "Documents Needed";

export interface RecentApplication {
  id: string;
  name: string;
  course: string;
  date: string;
  status: ApplicationStatus;
  statusColor: string;
}

export interface FunnelStage {
  label: string;
  count: number;
  percentage: string;
  barColor: string;
}

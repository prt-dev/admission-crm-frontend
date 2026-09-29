import {
  DashboardStat,
  RecentApplication,
  FunnelStage,
} from "@/types/dashboard";

export const dashboardStats: DashboardStat[] = [
  {
    title: "Total Applications",
    value: "1,428",
    change: "+12.5%",
    isPositive: true,
    period: "vs last month",
    type: "applications",
  },
  {
    title: "New Inquiries / Leads",
    value: "384",
    change: "+8.2%",
    isPositive: true,
    period: "this week",
    type: "leads",
  },
  {
    title: "Admissions Confirmed",
    value: "862",
    change: "+18.4%",
    isPositive: true,
    period: "vs last year",
    type: "admissions",
  },
  {
    title: "Fee Collection",
    value: "₹2.48 Cr",
    change: "+15.3%",
    isPositive: true,
    period: "this quarter",
    type: "revenue",
  },
];

export const recentApplicationsData: RecentApplication[] = [
  {
    id: "APP-9821",
    name: "Aarav Sharma",
    course: "B.Tech Computer Science & AI",
    date: "Today, 11:20 AM",
    status: "Verified",
    statusColor:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  {
    id: "APP-9820",
    name: "Sneha Reddy",
    course: "MBA in Business Analytics",
    date: "Today, 10:45 AM",
    status: "Under Review",
    statusColor:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  },
  {
    id: "APP-9819",
    name: "Rohan Verma",
    course: "BBA (FinTech)",
    date: "Yesterday, 04:30 PM",
    status: "Fee Pending",
    statusColor:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
  {
    id: "APP-9818",
    name: "Meera Nair",
    course: "B.Tech Electronics & VLSI",
    date: "Yesterday, 02:15 PM",
    status: "Documents Needed",
    statusColor:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
  },
  {
    id: "APP-9817",
    name: "Karan Johar",
    course: "MCA (Cloud Computing)",
    date: "28 Sep 2026",
    status: "Verified",
    statusColor:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
];

export const admissionFunnelStages: FunnelStage[] = [
  {
    label: "Inquiries",
    count: 3400,
    percentage: "100%",
    barColor: "bg-blue-500",
  },
  {
    label: "Applications Filed",
    count: 1428,
    percentage: "42%",
    barColor: "bg-brand-500",
  },
  {
    label: "Documents Verified",
    count: 1040,
    percentage: "30.5%",
    barColor: "bg-purple-500",
  },
  {
    label: "Confirmed Enrollments",
    count: 862,
    percentage: "25.3%",
    barColor: "bg-emerald-500",
  },
];

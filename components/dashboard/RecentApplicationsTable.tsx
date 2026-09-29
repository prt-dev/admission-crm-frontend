"use client";

import React from "react";
import Link from "next/link";
import { RecentApplication } from "@/types/dashboard";
import { recentApplicationsData } from "@/data/dashboardData";
import { DataTable, ColumnDef, Button } from "@/components/ui";

interface RecentApplicationsTableProps {
  applications?: RecentApplication[];
  onReview?: (id: string) => void;
}

export default function RecentApplicationsTable({
  applications = recentApplicationsData,
  onReview,
}: RecentApplicationsTableProps) {
  const columns: ColumnDef<RecentApplication>[] = [
    {
      key: "name",
      header: "Applicant",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-[10px] text-gray-400">{row.id}</p>
        </div>
      ),
    },
    {
      key: "course",
      header: "Program",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {row.course}
        </span>
      ),
    },
    {
      key: "date",
      header: "Time",
      sortable: true,
      render: (row) => <span className="text-gray-400">{row.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${row.statusColor}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (row) => (
        <Button
          variant="secondary"
          size="xs"
          onClick={() => onReview?.(row.id)}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      title="Recent Applications"
      subtitle="Latest candidate submissions across programs"
      columns={columns}
      data={applications}
      headerActions={
        <Link
          href="/admissions"
          className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
        >
          See all
        </Link>
      }
    />
  );
}

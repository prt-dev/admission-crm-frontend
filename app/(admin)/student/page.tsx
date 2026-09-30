"use client";

import React from "react";
import { Breadcrumb } from "@/components/ui";
import { StudentDashboardView } from "@/components/student";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Student Portal", active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Student Academic Portal
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Access your enrolled training programs, syllabus progress, cohort schedules, fee receipts, and Skill India certificates.
        </p>
      </div>

      {/* Main Student Dashboard View */}
      <StudentDashboardView />
    </div>
  );
}

"use client";

import React from "react";
import StatCard from "@/components/ui/StatCard";
import { Admission } from "@/types/admission";
import { Course } from "@/types/course";
import { Batch } from "@/types/batch";

interface StudentStatsCardsProps {
  admission: Admission;
  course?: Course;
  batch?: Batch;
}

export default function StudentStatsCards({
  admission,
  course,
  batch,
}: StudentStatsCardsProps) {
  const balanceDue = (admission.totalFee || 0) - (admission.amountPaid || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Academic Program */}
      <StatCard
        title="Enrolled Program"
        value={course?.courseCode || admission.courseCode}
        badge={{
          label: course?.duration || "6 Months",
          variant: "brand",
        }}
        subtitle={course?.skillIndiaSector || "Skill India QP Certified"}
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        }
      />

      {/* 2. Assigned Batch & Timings */}
      <StatCard
        title="Assigned Batch"
        value={batch?.batchCode || admission.batchCode}
        badge={{
          label: batch?.mode || "Hybrid Classroom",
          variant: "success",
        }}
        subtitle={batch?.scheduleTiming || "Morning: 09:30 AM - 12:30 PM"}
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />

      {/* 3. Fee & Payment Clearance */}
      <StatCard
        title="Fee Clearance"
        value={`₹${(admission.amountPaid || 0).toLocaleString()}`}
        badge={{
          label: admission.paymentStatus === "Paid" ? "100% Paid" : admission.paymentStatus,
          variant: admission.paymentStatus === "Paid" ? "success" : "warning",
        }}
        subtitle={
          balanceDue > 0
            ? `Balance Due: ₹${balanceDue.toLocaleString()}`
            : "No Dues Pending"
        }
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      {/* 4. Attendance & Assessment Readiness */}
      <StatCard
        title="Attendance & Progress"
        value="94.5%"
        badge={{
          label: "Eligible for Exam",
          variant: "success",
          trend: "up",
        }}
        subtitle="38 of 40 sessions attended"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
}

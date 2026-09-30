"use client";

import React from "react";
import StatCard from "@/components/ui/StatCard";

interface AdmissionStatsProps {
  stats: {
    totalAdmissions: number;
    confirmedAdmissions: number;
    pendingAdmissions: number;
    totalFeeCollected: number;
    totalFeeExpected: number;
    feeCollectionRate: number;
  };
}

export default function AdmissionStats({ stats }: AdmissionStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Admissions */}
      <StatCard
        title="Total Admitted Students"
        value={stats.totalAdmissions.toString()}
        badge={{
          label: "+18% MoM",
          variant: "success",
          trend: "up",
        }}
        subtitle="Across all active academic batches"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />

      {/* Confirmed */}
      <StatCard
        title="Confirmed Admissions"
        value={stats.confirmedAdmissions.toString()}
        badge={{
          label: "KYC Verified",
          variant: "brand",
        }}
        subtitle="Aadhaar & Skill India verified"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Pending Verification */}
      <StatCard
        title="Pending Verifications"
        value={stats.pendingAdmissions.toString()}
        badge={{
          label: "Action Required",
          variant: "warning",
        }}
        subtitle="Awaiting documents or approval"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Fee Collection */}
      <StatCard
        title="Total Fee Collection"
        value={`₹${(stats.totalFeeCollected / 100000).toFixed(2)}L`}
        badge={{
          label: `${stats.feeCollectionRate}% Recovered`,
          variant: "success",
          trend: "up",
        }}
        subtitle={`Expected: ₹${(stats.totalFeeExpected / 100000).toFixed(2)}L`}
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import StatCard from "@/components/ui/StatCard";
import { AdmissionStatsProps } from "@/types/admission";


export default function AdmissionStats({ stats }: AdmissionStatsProps) {
  const activeCount = stats.activeAdmissions ?? stats.confirmedAdmissions ?? 0;
  const certifiedCount = stats.certifiedAdmissions ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Admissions */}
      <StatCard
        title="Total Admissions"
        value={stats.totalAdmissions.toString()}
        badge={{
          label: "Registry Total",
          variant: "brand",
        }}
        subtitle="Across all academic programs"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />


      {/* Certified Alumni */}
      <StatCard
        title="Certified Alumni"
        value={certifiedCount.toString()}
        badge={{
          label: "Certified",
          variant: "brand",
        }}
        subtitle="Graduated & Skill certified"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

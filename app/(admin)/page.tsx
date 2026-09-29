"use client";

import React from "react";
import {
  WelcomeBanner,
  StatsGrid,
  RecentApplicationsTable,
  AdmissionFunnel,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* KPI Stats Cards */}
      <StatsGrid />

      {/* Main Grid: Recent Applications & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentApplicationsTable />
        </div>
        <div className="lg:col-span-1">
          <AdmissionFunnel />
        </div>
      </div>
    </div>
  );
}

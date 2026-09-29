"use client";

import React from "react";
import Link from "next/link";
import { FunnelStage } from "@/types/dashboard";
import { admissionFunnelStages } from "@/data/dashboardData";

interface AdmissionFunnelProps {
  stages?: FunnelStage[];
}

export default function AdmissionFunnel({
  stages = admissionFunnelStages,
}: AdmissionFunnelProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Admission Funnel
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Conversion stage breakdown
        </p>

        <div className="mt-5 space-y-4">
          {stages.map((stage, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-700 dark:text-gray-300">
                  {stage.label} ({stage.count.toLocaleString()})
                </span>
                <span className="text-brand-600 dark:text-brand-400 font-semibold">
                  {stage.percentage}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${stage.barColor}`}
                  style={{ width: stage.percentage }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/reports"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <span>Download Detailed Analytics</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

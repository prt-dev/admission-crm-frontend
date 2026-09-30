"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import BatchForm from "@/components/forms/batches/BatchForm";

function BatchCreateContent() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get("course") || "";

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Batches & Cohorts", href: "/batches" },
            { label: "Schedule Batch", active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Schedule New Academic Batch
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Assign lead faculty, timings, start/end dates, mode, and student capacity quota.
        </p>
      </div>

      {/* Form */}
      <BatchForm defaultCourseCode={courseCode} />
    </div>
  );
}

export default function NewBatchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      }
    >
      <BatchCreateContent />
    </Suspense>
  );
}

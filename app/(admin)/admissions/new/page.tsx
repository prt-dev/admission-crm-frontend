"use client";

import React from "react";
import { Breadcrumb } from "@/components/ui";
import AdmissionForm from "@/components/forms/admissions/AdmissionForm";

export default function NewAdmissionPage() {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Admissions", href: "/admissions" },
            { label: "New Admission", active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          New Student Admission Form
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Enter student KYC details, registration number, Aadhaar UID, and allocate active course batch.
        </p>
      </div>

      {/* Form Component */}
      <AdmissionForm />
    </div>
  );
}

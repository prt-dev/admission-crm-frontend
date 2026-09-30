"use client";

import React from "react";
import { Breadcrumb } from "@/components/ui";
import { LeadForm } from "@/components/forms/leads";

export default function NewLeadPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Leads & Inquiries", href: "/leads" },
            { label: "New Lead", active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Capture New Lead / Inquiry
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Record student applicant contact information, inquiries, and initial status.
        </p>
      </div>

      {/* Form Component */}
      <LeadForm />
    </div>
  );
}

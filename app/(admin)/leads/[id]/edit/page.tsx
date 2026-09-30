"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Button } from "@/components/ui";
import { Lead } from "@/types/lead";
import { leadService } from "@/services/leadService";
import { LeadForm } from "@/components/forms/leads";

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = leadService.getLeadById(id);
      if (found) {
        setLead(found);
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Lead Record Not Found
        </h2>
        <p className="text-xs text-gray-500">
          The requested lead or inquiry could not be located in the CRM.
        </p>
        <Button onClick={() => router.push("/leads")} variant="primary" size="sm">
          Return to Leads Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Leads & Inquiries", href: "/leads" },
            { label: `Edit ${lead.leadCode}`, active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Edit Lead: {lead.name} ({lead.leadCode})
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Update contact details, inquiry message notes, and pipeline status.
        </p>
      </div>

      {/* Form Component */}
      <LeadForm leadToEdit={lead} />
    </div>
  );
}

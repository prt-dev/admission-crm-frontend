"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Button } from "@/components/ui";
import { Admission } from "@/types/admission";
import { admissionService } from "@/services/admissionService";
import AdmissionForm from "@/components/forms/admissions/AdmissionForm";

export default function EditAdmissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [admission, setAdmission] = useState<Admission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = admissionService.getAdmissionById(id);
      if (found) {
        setAdmission(found);
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

  if (!admission) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Admission Record Not Found
        </h2>
        <p className="text-xs text-gray-500">
          The requested admission ID could not be located in the system.
        </p>
        <Button onClick={() => router.push("/admissions")} variant="primary" size="sm">
          Return to Admissions List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Admissions", href: "/admissions" },
            { label: `Edit ${admission.studentId}`, active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Edit Admission: {admission.studentName} ({admission.studentId})
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Modify student KYC, batch cohort assignment, qualification, and fee status.
        </p>
      </div>

      {/* Form Component */}
      <AdmissionForm admissionToEdit={admission} />
    </div>
  );
}

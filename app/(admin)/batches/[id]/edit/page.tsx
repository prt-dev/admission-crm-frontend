"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Button } from "@/components/ui";
import { Batch } from "@/types/batch";
import { batchService } from "@/services/batchService";
import BatchForm from "@/components/forms/batches/BatchForm";

export default function EditBatchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      if (id) {
        const found = await batchService.getBatchById(id);
        if (found) {
          setBatch(found);
        }
        setIsLoading(false);
      }
    };
    fetchBatch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Academic Batch Not Found
        </h2>
        <p className="text-xs text-gray-500">
          The requested batch record could not be found.
        </p>
        <Button onClick={() => router.push("/batches")} variant="primary" size="sm">
          Return to Batches Directory
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
            { label: "Batches & Cohorts", href: "/batches" },
            { label: `Edit ${batch.batchCode}`, active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Edit Batch: {batch.batchName} ({batch.batchCode})
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Update trainer assignment, schedule timings, capacity seats, and room venue.
        </p>
      </div>

      {/* Form Component */}
      <BatchForm batchToEdit={batch} />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Button, DataTable, ColumnDef, StatCard } from "@/components/ui";
import { Batch } from "@/types/batch";
import { Course } from "@/types/course";
import { Admission } from "@/types/admission";
import { batchService } from "@/services/batchService";
import { courseService } from "@/services/courseService";
import { admissionService } from "@/services/admissionService";
import BatchDetailModal from "@/components/batches/BatchDetailModal";
import AdmissionDetailDrawer from "@/components/admissions/AdmissionDetailDrawer";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function BatchesPage() {
  const router = useRouter();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [selectedBatchForDetail, setSelectedBatchForDetail] = useState<Batch | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [deletingBatch, setDeletingBatch] = useState<Batch | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Student drawer
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [isAdmissionDrawerOpen, setIsAdmissionDrawerOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [allBatches, allCourses] = await Promise.all([
        batchService.getBatches(),
        courseService.getCourses(),
      ]);
      setBatches(allBatches);
      setCourses(allCourses);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubBatches = batchService.subscribe(loadData);
    const unsubCourses = courseService.subscribe(loadData);
    const unsubAdmissions = admissionService.subscribeToChanges(loadData);
    return () => {
      unsubBatches();
      unsubCourses();
      unsubAdmissions();
    };
  }, []);

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (selectedCourse !== "all") {
        const matchesCourse =
          b.courseCodes?.includes(selectedCourse) ||
          b.courseCode === selectedCourse;
        if (!matchesCourse) return false;
      }
      if (selectedMode !== "all" && b.mode !== selectedMode) return false;
      if (selectedStatus !== "all" && b.status !== selectedStatus) return false;
      return true;
    });
  }, [batches, selectedCourse, selectedMode, selectedStatus]);

  const totalSeats = batches.reduce((sum, b) => sum + (b.maxSeats || 0), 0);
  const totalEnrolled = batches.reduce((sum, b) => sum + (b.enrolledSeats || 0), 0);
  const overallOccupancy = totalSeats > 0 ? Math.round((totalEnrolled / totalSeats) * 100) : 0;

  const handleOpenAddPage = () => {
    router.push("/batches/new");
  };

  const handleOpenEditPage = (batch: Batch) => {
    router.push(`/batches/${batch.id}/edit`);
  };

  const handleViewDetail = (batch: Batch) => {
    setSelectedBatchForDetail(batch);
    setIsDetailModalOpen(true);
  };

  const handleDeleteRequest = (batch: Batch) => {
    setDeletingBatch(batch);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingBatch) {
      batchService.deleteBatch(deletingBatch.id);
      setIsDeleteModalOpen(false);
      setDeletingBatch(null);
      if (selectedBatchForDetail?.id === deletingBatch.id) {
        setIsDetailModalOpen(false);
        setSelectedBatchForDetail(null);
      }
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Ongoing":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Full":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<Batch>[] = [
    {
      key: "batchCode",
      header: "Batch Code",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
          {row.batchCode}
        </span>
      ),
    },
    {
      key: "batchName",
      header: "Batch Name & Courses",
      sortable: true,
      render: (row) => {
        const codes =
          row.courseCodes && row.courseCodes.length > 0
            ? row.courseCodes
            : row.courseCode
            ? [row.courseCode]
            : [];
        return (
          <div className="flex flex-col min-w-0 max-w-[260px]">
            <span
              onClick={() => handleViewDetail(row)}
              className="font-semibold text-xs text-gray-900 dark:text-white hover:text-brand-600 cursor-pointer truncate"
              title={row.batchName}
            >
              {row.batchName}
            </span>
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {codes.slice(0, 2).map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  {code}
                </span>
              ))}
              {codes.length > 2 && (
                <span className="text-[10px] font-medium text-brand-600 dark:text-brand-400">
                  +{codes.length - 2} more
                </span>
              )}
            </div>
            {row.courseNames && row.courseNames.length > 0 ? (
              <span className="text-[10px] text-gray-400 truncate mt-0.5">
                {row.courseNames.join(" • ")}
              </span>
            ) : (
              row.courseName && (
                <span className="text-[10px] text-gray-400 truncate mt-0.5">
                  {row.courseName}
                </span>
              )
            )}
          </div>
        );
      },
    },
    {
      key: "trainerName",
      header: "Trainer / Faculty",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-700 dark:text-gray-300">
            {row.trainerName.charAt(0)}
          </div>
          <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">
            {row.trainerName}
          </span>
        </div>
      ),
    },
    {
      key: "scheduleTiming",
      header: "Schedule & Mode",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs text-gray-800 dark:text-gray-200">
            {row.scheduleTiming}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {row.mode} • {row.classroomLocation || "Campus"}
          </span>
        </div>
      ),
    },
    {
      key: "occupancy",
      header: "Seat Occupancy",
      render: (row) => {
        const pct = Math.min(100, Math.round(((row.enrolledSeats || 0) / row.maxSeats) * 100));
        return (
          <div className="flex flex-col w-28">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                {row.enrolledSeats} / {row.maxSeats}
              </span>
              <span className="text-[10px] text-gray-400">{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  pct >= 90 ? "bg-rose-500" : pct >= 60 ? "bg-brand-500" : "bg-emerald-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(row);
            }}
            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg cursor-pointer"
            title="View Details"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditPage(row);
            }}
            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
            title="Edit Batch"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRequest(row);
            }}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
            title="Delete Batch"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Batches & Cohorts", active: true },
            ]}
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            Academic Batches & Cohorts
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Schedule training batches, monitor capacity utilization, faculty allocation, and session timings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenAddPage}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Schedule New Batch
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Batches"
          value={batches.length.toString()}
          subtitle="Across all courses"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <StatCard
          title="Ongoing Batches"
          value={batches.filter((b) => b.status === "Ongoing").length.toString()}
          badge={{ label: "Live", variant: "success" }}
          subtitle="Currently active classes"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Upcoming Cohorts"
          value={batches.filter((b) => b.status === "Upcoming").length.toString()}
          badge={{ label: "Enrollment Open", variant: "brand" }}
          subtitle="Starting next month"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Seat Occupancy Rate"
          value={`${overallOccupancy}%`}
          badge={{ label: `${totalEnrolled}/${totalSeats} Seats`, variant: "success", trend: "up" }}
          subtitle="Overall capacity utilized"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 min-w-[200px] flex-1">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Filter:
          </span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.courseCode}>
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Modes</option>
            <option value="Offline (Classroom)">Offline (Classroom)</option>
            <option value="Online (Live)">Online (Live)</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Full">Full</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        title="Batch Directory"
        subtitle={`Showing ${filteredBatches.length} batch cohorts in directory`}
        data={filteredBatches}
        columns={columns}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search batches by code, trainer, timing..."
        pagination={{
          pageSize: 5,
          pageSizeOptions: [5, 10, 20, 50],
          showEdges: true,
          showInfo: true,
          showTotal: true,
          size: "md",
        }}
        onRowClick={(row) => handleViewDetail(row)}
      />

      {/* Detail Modal */}
      <BatchDetailModal
        batch={selectedBatchForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBatchForDetail(null);
        }}
        onEdit={(batch) => {
          setIsDetailModalOpen(false);
          handleOpenEditPage(batch);
        }}
        onDelete={(batch) => {
          handleDeleteRequest(batch);
        }}
        onViewAdmission={(adm) => {
          setSelectedAdmission(adm);
          setIsAdmissionDrawerOpen(true);
        }}
      />

      <AdmissionDetailDrawer
        admission={selectedAdmission}
        isOpen={isAdmissionDrawerOpen}
        onClose={() => {
          setIsAdmissionDrawerOpen(false);
          setSelectedAdmission(null);
        }}
        onEdit={(adm) => {
          setIsAdmissionDrawerOpen(false);
          router.push(`/admissions/${adm.id}/edit`);
        }}
        onDelete={() => {}}
        onUpdated={loadData}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Academic Batch"
        message={`Are you sure you want to delete batch "${deletingBatch?.batchName}" (${deletingBatch?.batchCode})?`}
        confirmLabel="Yes, Delete Batch"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBatch(null);
        }}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Button, DataTable, ColumnDef } from "@/components/ui";
import { Admission } from "@/types/admission";
import { Course } from "@/types/course";
import { Batch } from "@/types/batch";
import { admissionService } from "@/services/admissionService";
import { courseService } from "@/services/courseService";
import { batchService } from "@/services/batchService";
import AdmissionDetailDrawer from "@/components/admissions/AdmissionDetailDrawer";
import AdmissionStats from "@/components/admissions/AdmissionStats";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdmissionsPage() {
  const router = useRouter();

  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [stats, setStats] = useState(admissionService.getStats());

  // Filter States
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Drawer / Delete States
  const [selectedAdmissionForDetail, setSelectedAdmissionForDetail] = useState<Admission | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [deletingAdmission, setDeletingAdmission] = useState<Admission | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadData = async () => {
    const [allCourses, allBatches] = await Promise.all([
      courseService.getCourses(),
      batchService.getBatches(),
    ]);
    setAdmissions(admissionService.getAdmissions());
    setCourses(allCourses);
    setBatches(allBatches);
    setStats(admissionService.getStats());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = admissionService.subscribeToChanges(loadData);
    return () => unsubscribe();
  }, []);

  // Filtered Admissions
  const filteredData = useMemo(() => {
    return admissions.filter((item) => {
      if (selectedCourse !== "all" && item.courseCode !== selectedCourse) return false;
      if (selectedBatch !== "all" && item.batchCode !== selectedBatch) return false;
      if (selectedStatus !== "all" && item.status !== selectedStatus) return false;
      return true;
    });
  }, [admissions, selectedCourse, selectedBatch, selectedStatus]);

  // Handlers
  const handleOpenAddPage = () => {
    router.push("/admissions/new");
  };

  const handleOpenEditPage = (adm: Admission) => {
    router.push(`/admissions/${adm.id}/edit`);
  };

  const handleViewDetail = (adm: Admission) => {
    setSelectedAdmissionForDetail(adm);
    setIsDetailDrawerOpen(true);
  };

  const handleDeleteRequest = (adm: Admission) => {
    setDeletingAdmission(adm);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingAdmission) {
      admissionService.deleteAdmission(deletingAdmission.id);
      setIsDeleteModalOpen(false);
      setDeletingAdmission(null);
      if (selectedAdmissionForDetail?.id === deletingAdmission.id) {
        setIsDetailDrawerOpen(false);
        setSelectedAdmissionForDetail(null);
      }
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Student ID",
      "Registration ID",
      "Student Name",
      "Mobile",
      "Email",
      "Aadhaar",
      "Qualification",
      "Course Code",
      "Course Name",
      "Batch Code",
      "Batch Name",
      "Skill India Reg ID",
      "Admission Date",
      "Status",
      "Payment Status",
      "Amount Paid",
      "Total Fee",
    ];

    const rows = filteredData.map((item) => [
      `"${item.studentId}"`,
      `"${item.registrationId}"`,
      `"${item.studentName}"`,
      `"${item.mobile}"`,
      `"${item.email || ""}"`,
      `"${item.aadhaar}"`,
      `"${item.qualification}"`,
      `"${item.courseCode}"`,
      `"${item.courseName || ""}"`,
      `"${item.batchCode}"`,
      `"${item.batchName || ""}"`,
      `"${item.skillIndiaRegId}"`,
      `"${item.admissionDate}"`,
      `"${item.status}"`,
      `"${item.paymentStatus}"`,
      item.amountPaid || 0,
      item.totalFee || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admissions_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Certified":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Inactive":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  // Table Columns
  const columns: ColumnDef<Admission>[] = [
    {
      key: "studentId",
      header: "Student ID (Auto)",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
            {row.studentId}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            {row.registrationId}
          </span>
        </div>
      ),
    },
    {
      key: "studentName",
      header: "Student & Contact",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-xs shadow-xs">
            {row.studentName.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              onClick={() => handleViewDetail(row)}
              className="font-semibold text-xs text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer truncate"
            >
              {row.studentName}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
              <span>+91 {row.mobile}</span>
              {row.email && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[130px]">{row.email}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "aadhaar",
      header: "Aadhaar UID",
      render: (row) => (
        <span className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded-md">
          {row.aadhaar}
        </span>
      ),
    },
    {
      key: "qualification",
      header: "Qualification",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
          {row.qualification}
        </span>
      ),
    },
    {
      key: "courseCode",
      header: "Course Code",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-gray-900 dark:text-white">
            {row.courseCode}
          </span>
          <span className="text-[10px] text-gray-400 truncate max-w-[140px]">
            {row.courseName}
          </span>
        </div>
      ),
    },
    {
      key: "batchCode",
      header: "Batch Code (Auto)",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
          {row.batchCode}
        </span>
      ),
    },
    {
      key: "skillIndiaRegId",
      header: "Skill India Reg ID",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-medium text-brand-700 dark:text-brand-300">
          {row.skillIndiaRegId}
        </span>
      ),
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
            title="View Details"
            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-lg transition-colors cursor-pointer"
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
            title="Edit Admission"
            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer"
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
            title="Delete Record"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
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
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Admissions", active: true },
            ]}
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            Student Admissions Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage student registrations, batch assignments, Aadhaar KYC, and Skill India certifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Export CSV
          </Button>
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
            New Admission
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <AdmissionStats stats={stats} />

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 min-w-[200px] flex-1">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Filters:
          </span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Courses ({courses.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.courseCode}>
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Batches ({batches.length})</option>
            {batches.map((b) => (
              <option key={b.id} value={b.batchCode}>
                {b.batchCode} ({b.mode})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Certified">Certified</option>
          </select>
        </div>

        {(selectedCourse !== "all" || selectedBatch !== "all" || selectedStatus !== "all") && (
          <button
            onClick={() => {
              setSelectedCourse("all");
              setSelectedBatch("all");
              setSelectedStatus("all");
            }}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Admission Records"
        subtitle={`Showing ${filteredData.length} admitted students in registry`}
        data={filteredData}
        columns={columns}
        searchable
        searchPlaceholder="Search by student name, ID, Aadhaar, mobile, course..."
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

      {/* Detail Slide-over Drawer */}
      <AdmissionDetailDrawer
        admission={selectedAdmissionForDetail}
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedAdmissionForDetail(null);
        }}
        onEdit={(adm) => {
          setIsDetailDrawerOpen(false);
          handleOpenEditPage(adm);
        }}
        onDelete={(adm) => {
          handleDeleteRequest(adm);
        }}
        onUpdated={loadData}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Admission Record"
        message={`Are you sure you want to permanently delete admission record for "${deletingAdmission?.studentName}" (${deletingAdmission?.studentId})? This will release their allocated seat from batch ${deletingAdmission?.batchCode}.`}
        confirmLabel="Yes, Delete Record"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingAdmission(null);
        }}
      />
    </div>
  );
}

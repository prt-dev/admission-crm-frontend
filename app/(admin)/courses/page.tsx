"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Button, DataTable, ColumnDef, StatCard } from "@/components/ui";
import { Course } from "@/types/course";
import { Batch } from "@/types/batch";
import { courseService } from "@/services/courseService";
import { batchService } from "@/services/batchService";
import CourseDetailModal from "@/components/courses/CourseDetailModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function CoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadData = () => {
    setCourses(courseService.getCourses());
    setBatches(batchService.getBatches());
  };

  useEffect(() => {
    loadData();
    const unsubCourses = courseService.subscribe(loadData);
    const unsubBatches = batchService.subscribe(loadData);
    return () => {
      unsubCourses();
      unsubBatches();
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && c.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = c.courseCode.toLowerCase().includes(q);
        const matchesName = c.courseName.toLowerCase().includes(q);
        const matchesDesc = (c.description || "").toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [courses, selectedCategory, selectedStatus, searchQuery]);

  const categories = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.category)));
  }, [courses]);

  const handleOpenAddPage = () => {
    router.push("/courses/new");
  };

  const handleOpenEditPage = (course: Course) => {
    router.push(`/courses/${course.id}/edit`);
  };

  const handleViewDetail = (course: Course) => {
    setSelectedCourseForDetail(course);
    setIsDetailModalOpen(true);
  };

  const handleDeleteRequest = (course: Course) => {
    setDeletingCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCourse) {
      courseService.deleteCourse(deletingCourse.id);
      setIsDeleteModalOpen(false);
      setDeletingCourse(null);
      if (selectedCourseForDetail?.id === deletingCourse.id) {
        setIsDetailModalOpen(false);
        setSelectedCourseForDetail(null);
      }
    }
  };

  const handleAddBatch = (courseCode: string) => {
    router.push(`/batches/new?course=${encodeURIComponent(courseCode)}`);
  };

  const columns: ColumnDef<Course>[] = [
    {
      key: "courseCode",
      header: "Course Code",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
          {row.courseCode}
        </span>
      ),
    },
    {
      key: "courseName",
      header: "Course Title & Category",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span
            onClick={() => handleViewDetail(row)}
            className="font-semibold text-xs text-gray-900 dark:text-white hover:text-brand-600 cursor-pointer"
          >
            {row.courseName}
          </span>
          <span className="text-[10px] text-gray-400">{row.category}</span>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-700 dark:text-gray-300">{row.duration}</span>
      ),
    },
    {
      key: "totalFee",
      header: "Total Fee",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-xs text-gray-900 dark:text-white">
          ₹{row.totalFee.toLocaleString()}
        </span>
      ),
    },
    {
      key: "batches",
      header: "Active Batches",
      render: (row) => {
        const active = batches.filter((b) => b.courseCode === row.courseCode);
        return (
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
            {active.length} Batches
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            row.status === "Active"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
          }`}
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
            title="Edit Course"
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
            title="Delete Course"
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Courses & Programs", active: true },
            ]}
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            Courses & Academic Programs
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage course catalog, fee structures, eligibility benchmarks, and curriculum syllabi.
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
            Add New Course
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Programs"
          value={courses.length.toString()}
          subtitle="Certified curriculum tracks"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          title="Active Batches"
          value={batches.length.toString()}
          badge={{ label: "Running", variant: "brand" }}
          subtitle="Across all courses"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <StatCard
          title="Skill India SSCs"
          value="4 Sectors"
          badge={{ label: "Govt Certified", variant: "success" }}
          subtitle="NSDC aligned qualification packs"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-gray-900 text-brand-600 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white dark:bg-gray-900 text-brand-600 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Grid or Table Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const courseBatches = batches.filter(
              (b) => b.courseCode.toLowerCase() === course.courseCode.toLowerCase()
            );
            const totalEnrolled = courseBatches.reduce((sum, b) => sum + (b.enrolledSeats || 0), 0);

            return (
              <div
                key={course.id}
                className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                      {course.courseCode}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        course.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleViewDetail(course)}
                    className="font-bold text-sm text-gray-900 dark:text-white hover:text-brand-600 cursor-pointer line-clamp-2"
                  >
                    {course.courseName}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    {course.category} • {course.duration}
                  </p>

                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400">Total Fee</span>
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{course.totalFee.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400">Batches / Enrolled</span>
                      <p className="font-bold text-brand-600 dark:text-brand-400">
                        {courseBatches.length} / {totalEnrolled}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => handleAddBatch(course.courseCode)}
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    + Add Batch
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleViewDetail(course)}
                      className="p-1.5 text-gray-400 hover:text-brand-600 rounded-lg cursor-pointer"
                      title="View Details"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleOpenEditPage(course)}
                      className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg cursor-pointer"
                      title="Edit Course"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(course)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Delete Course"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable
          title="Courses Directory"
          subtitle={`Total ${filteredCourses.length} courses registered`}
          data={filteredCourses}
          columns={columns}
          searchable
          searchPlaceholder="Search courses by title, code, sector..."
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
      )}

      {/* Modals for Detail & Delete */}
      <CourseDetailModal
        course={selectedCourseForDetail}
        batches={batches}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCourseForDetail(null);
        }}
        onEdit={(course) => {
          setIsDetailModalOpen(false);
          handleOpenEditPage(course);
        }}
        onDelete={(course) => {
          handleDeleteRequest(course);
        }}
        onAddBatchForCourse={handleAddBatch}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Course"
        message={`Are you sure you want to delete course "${deletingCourse?.courseName}" (${deletingCourse?.courseCode})?`}
        confirmLabel="Yes, Delete Course"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCourse(null);
        }}
      />
    </div>
  );
}

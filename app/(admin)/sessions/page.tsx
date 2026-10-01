"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Breadcrumb, Button } from "@/components/ui";
import {
  AcademicSession,
  AcademicSessionFilterState,
} from "@/types/session";
import { Batch } from "@/types/batch";
import { Course } from "@/types/course";
import { sessionService } from "@/services/sessionService";
import { batchService } from "@/services/batchService";
import { courseService } from "@/services/courseService";

import AcademicSessionStatsCards from "@/components/sessions/AcademicSessionStatsCards";
import AcademicSessionFilterBar from "@/components/sessions/AcademicSessionFilterBar";
import AcademicSessionTable from "@/components/sessions/AcademicSessionTable";
import AcademicSessionModal from "@/components/sessions/AcademicSessionModal";
import AcademicSessionDetailModal from "@/components/sessions/AcademicSessionDetailModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const router = useRouter();

  // State
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);

  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<AcademicSession | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [deletingSession, setDeletingSession] = useState<AcademicSession | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Loading State
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [filters, setFilters] = useState<AcademicSessionFilterState>({
    searchQuery: "",
    status: "all",
    year: "all",
  });

  const loadData = async () => {
    try {
      const allSessions = await sessionService.getSessions();
      const allBatches = await batchService.getBatches();
      const allCourses = await courseService.getCourses();

      // Dynamically calculate running batches count per session
      const enrichedSessions = allSessions.map((s) => {
        const startDate = s.start_date || s.startDate || "2026-04-01";
        const sessionCode = s.code || s.sessionCode || "";
        const startYear = startDate.slice(0, 4);

        const sessionBatches = allBatches.filter(
          (b) =>
            b.academicSessionCode === sessionCode ||
            b.academicSessionCode === s.code ||
            b.academicSessionCode === s.sessionCode ||
            (b.startDate && b.startDate.startsWith(startYear))
        );
        const totalEnrolled = sessionBatches.reduce((sum, b) => sum + (b.enrolledSeats || 0), 0);
        const totalCapacity = sessionBatches.reduce((sum, b) => sum + (b.maxSeats || 0), 0);

        return {
          ...s,
          runningBatchesCount: sessionBatches.length,
          totalEnrolledStudents: totalEnrolled,
          totalCapacitySeats: totalCapacity,
        };
      });

      setSessions(enrichedSessions);
      setBatches(allBatches);
      setCourses(allCourses);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // const unsubSessions = sessionService.subscribe(loadData);
    const unsubBatches = batchService.subscribe(loadData);
    const unsubCourses = courseService.subscribe(loadData);
    return () => {
      // unsubSessions();
      unsubBatches();
      unsubCourses();
    };
  }, []);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const sessionName = s.name || s.sessionName || "";
      const sessionCode = s.code || s.sessionCode || "";
      const sessionDesc = s.description || "";

      // Search query
      if (filters.searchQuery.trim() !== "") {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = sessionName.toLowerCase().includes(q);
        const matchesCode = sessionCode.toLowerCase().includes(q);
        const matchesDesc = sessionDesc.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDesc) {
          return false;
        }
      }

      // Status
      if (filters.status !== "all") {
        const matchNumeric = String(s.status) === String(filters.status);
        const matchString =
          (filters.status === "Active" && s.status === 2) ||
          (filters.status === "Upcoming" && s.status === 1) ||
          (filters.status === "Completed" && s.status === 3) ||
          (filters.status === "Archived" && s.status === 4);
        if (!matchNumeric && !matchString) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, filters]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    return sessionService.getMetrics();
  }, [sessions, batches]);

  // Handlers
  const handleFilterChange = (updates: Partial<AcademicSessionFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      status: "all",
      year: "all",
    });
  };

  const handleOpenCreateModal = () => {
    setEditingSession(null);
    setIsModalOpen(true);
  };

  const handleEditSession = (session: AcademicSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleViewBatches = (session: AcademicSession) => {
    setSelectedSessionForDetail(session);
    setIsDetailModalOpen(true);
  };

  const handleDeleteRequest = (session: AcademicSession) => {
    setDeletingSession(session);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingSession) {
      sessionService.deleteSession(deletingSession.id);
      setIsDeleteModalOpen(false);
      setDeletingSession(null);
      if (selectedSessionForDetail?.id === deletingSession.id) {
        setIsDetailModalOpen(false);
        setSelectedSessionForDetail(null);
      }
    }
  };

  const handleSetAsCurrent = (session: AcademicSession) => {
    sessionService.setAsCurrentSession(session.id);
  };

  const handleSaveSession = (sessionData: Partial<AcademicSession>) => {
    if (sessionData.id) {
      sessionService.updateSession(sessionData.id, sessionData);
    } else {
      sessionService.createSession(sessionData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Academic Sessions", active: true },
            ]}
          />
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Academic Sessions & Operational Cycles
            </h1>
            <span className="rounded-full bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300 font-mono">
              academic_sessions
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Configure institutional academic years (e.g. 2026-2027) containing and running training cohort batches.
          </p>
        </div>

        {/* Action CTA */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/batches")}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          >
            View All Batches
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Academic Session
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <AcademicSessionStatsCards metrics={metrics} />

      {/* Filter Bar */}
      <AcademicSessionFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Table */}
      <AcademicSessionTable
        sessions={filteredSessions}
        isLoading={isLoading}
        onViewBatches={handleViewBatches}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteRequest}
        onSetAsCurrent={handleSetAsCurrent}
      />

      {/* Create / Edit Modal */}
      <AcademicSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSession={handleSaveSession}
        initialSession={editingSession}
      />

      {/* Detail Modal with Running Batches */}
      <AcademicSessionDetailModal
        session={selectedSessionForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSessionForDetail(null);
        }}
        batches={batches}
        courses={courses}
        onViewBatchDetail={(batch) => {
          setIsDetailModalOpen(false);
          router.push("/batches");
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Academic Session"
        message={`Are you sure you want to delete academic session "${deletingSession?.name || deletingSession?.sessionName}" (${deletingSession?.code || deletingSession?.sessionCode})?`}
        confirmLabel="Yes, Delete Session"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSession(null);
        }}
      />
    </div>
  );
}

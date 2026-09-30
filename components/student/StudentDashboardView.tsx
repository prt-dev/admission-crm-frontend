"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Admission } from "@/types/admission";
import { admissionService } from "@/services/admissionService";
import { courseService } from "@/services/courseService";
import { batchService } from "@/services/batchService";
import StudentProfileCard from "./StudentProfileCard";
import StudentStatsCards from "./StudentStatsCards";
import StudentSyllabusSection from "./StudentSyllabusSection";
import StudentScheduleSection from "./StudentScheduleSection";
import StudentFeeBreakdown from "./StudentFeeBreakdown";
import StudentCertificatesSection from "./StudentCertificatesSection";

interface StudentDashboardViewProps {
  customAdmission?: Admission;
}

export default function StudentDashboardView({ customAdmission }: StudentDashboardViewProps) {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "syllabus" | "schedule" | "fees" | "certificates">("overview");

  useEffect(() => {
    const list = admissionService.getAdmissions();
    setAdmissions(list);

    if (customAdmission) {
      setSelectedAdmissionId(customAdmission.id);
    } else if (list.length > 0) {
      // If current logged-in user matches a student email, pick that student
      const matched = list.find(
        (a) => a.email?.toLowerCase() === user?.email?.toLowerCase() || a.studentName.toLowerCase() === user?.fullName?.toLowerCase()
      );
      setSelectedAdmissionId(matched ? matched.id : list[0].id);
    }
  }, [user, customAdmission]);

  const currentAdmission =
    admissions.find((a) => a.id === selectedAdmissionId) ||
    customAdmission ||
    admissions[0];

  const course = currentAdmission ? courseService.getCourseByCode(currentAdmission.courseCode) : undefined;
  const batch = currentAdmission ? batchService.getBatchByCode(currentAdmission.batchCode) : undefined;

  if (!currentAdmission) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          No Student Record Found
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Please register an admission first to view the student dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Selector Switcher (useful when viewing/testing different students) */}
      {admissions.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              🎓 Viewing Student:
            </span>
            <select
              value={selectedAdmissionId}
              onChange={(e) => setSelectedAdmissionId(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {admissions.map((adm) => (
                <option key={adm.id} value={adm.id}>
                  {adm.studentName} ({adm.studentId} - {adm.courseCode})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Enrolled Batch:</span>
            <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
              {currentAdmission.batchCode}
            </span>
          </div>
        </div>
      )}

      {/* 1. Student Profile Header */}
      <StudentProfileCard admission={currentAdmission} />

      {/* 2. Key Metric Stat Cards */}
      <StudentStatsCards
        admission={currentAdmission}
        course={course}
        batch={batch}
      />

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          📌 Overview & Highlights
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("syllabus")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "syllabus"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          📚 Syllabus & Modules
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("schedule")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "schedule"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          🗓️ Class Schedule
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("fees")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "fees"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          💳 Fee Receipts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("certificates")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "certificates"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          🏆 Skill Certification
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentSyllabusSection course={course} />
          <StudentScheduleSection batch={batch} />
          <div className="lg:col-span-2">
            <StudentFeeBreakdown admission={currentAdmission} />
          </div>
          <div className="lg:col-span-2">
            <StudentCertificatesSection admission={currentAdmission} course={course} />
          </div>
        </div>
      )}

      {activeTab === "syllabus" && <StudentSyllabusSection course={course} />}
      {activeTab === "schedule" && <StudentScheduleSection batch={batch} />}
      {activeTab === "fees" && <StudentFeeBreakdown admission={currentAdmission} />}
      {activeTab === "certificates" && (
        <StudentCertificatesSection admission={currentAdmission} course={course} />
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Batch, BatchMode, BatchStatus } from "@/types/batch";
import { Course } from "@/types/course";
import { batchService } from "@/services/batchService";
import { courseService } from "@/services/courseService";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import BatchBasicInfoSection from "./BatchBasicInfoSection";
import BatchScheduleSection from "./BatchScheduleSection";

interface BatchFormProps {
  batchToEdit?: Batch | null;
  defaultCourseCode?: string;
  onSuccess?: (batch: Batch) => void;
}

export default function BatchForm({
  batchToEdit,
  defaultCourseCode,
  onSuccess,
}: BatchFormProps) {
  const router = useRouter();
  const isEdit = Boolean(batchToEdit);

  const [courses, setCourses] = useState<Course[]>([]);
  const [batchCode, setBatchCode] = useState("");
  const [batchName, setBatchName] = useState("");
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [trainerName, setTrainerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduleTiming, setScheduleTiming] = useState("");
  const [mode, setMode] = useState<BatchMode>("Offline (Classroom)");
  const [maxSeats, setMaxSeats] = useState<number>(30);
  const [enrolledSeats, setEnrolledSeats] = useState<number>(0);
  const [classroomLocation, setClassroomLocation] = useState("");
  const [status, setStatus] = useState<BatchStatus>("Upcoming");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    courseService.getCourses().then((availableCourses) => {
      if (!isMounted) return;
      setCourses(availableCourses);

      if (batchToEdit) {
        setBatchCode(batchToEdit.code || batchToEdit.batchCode || "");
        setBatchName(batchToEdit.name || batchToEdit.batchName || "");
        const codes =
          batchToEdit.courseCodes && batchToEdit.courseCodes.length > 0
            ? batchToEdit.courseCodes
            : batchToEdit.courseCode
            ? [batchToEdit.courseCode]
            : (batchToEdit.courses?.map((c) => c.code) || []);
        setCourseCodes(codes);
        setTrainerName(batchToEdit.trainerName || batchToEdit.instructor?.name || "");
        setStartDate(batchToEdit.start_date || batchToEdit.startDate || "");
        setEndDate(batchToEdit.end_date || batchToEdit.endDate || "");
        setScheduleTiming(batchToEdit.timing || batchToEdit.scheduleTiming || "");
        setMode(batchToEdit.mode || "Offline (Classroom)");
        setMaxSeats(batchToEdit.capacity !== undefined ? batchToEdit.capacity : (batchToEdit.maxSeats || 30));
        setEnrolledSeats(batchToEdit.enrolledSeats || 0);
        setClassroomLocation(batchToEdit.classroomLocation || "");
        setStatus(batchToEdit.status || "Upcoming");
      } else {
        const initCourse =
          defaultCourseCode || availableCourses[0]?.code || availableCourses[0]?.courseCode || "";
        const initCodes = initCourse ? [initCourse] : [];
        const generatedCode = initCourse
          ? batchService.generateNextBatchCode(initCodes)
          : "";

        setCourseCodes(initCodes);
        setBatchCode(generatedCode);
        setBatchName("Cohort 2026 - Multidisciplinary Technical Cohort");
        setTrainerName("");
        setStartDate(new Date().toISOString().split("T")[0]);
        setEndDate("");
        setScheduleTiming("09:30 AM - 12:30 PM (Mon - Fri)");
        setMode("Offline (Classroom)");
        setMaxSeats(30);
        setEnrolledSeats(0);
        setClassroomLocation("Main Practical Bay 201");
        setStatus("Upcoming");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [batchToEdit, defaultCourseCode]);

  const handleCourseCodesChange = (selectedCodes: string[]) => {
    setCourseCodes(selectedCodes);
    if (!isEdit && selectedCodes.length > 0) {
      setBatchCode(batchService.generateNextBatchCode(selectedCodes));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!batchCode.trim()) newErrors.batchCode = "Batch code is required";
    if (!batchName.trim()) newErrors.batchName = "Batch title is required";
    if (courseCodes.length === 0)
      newErrors.courseCode = "Select at least one course for this batch";
    if (!trainerName.trim()) newErrors.trainerName = "Trainer name is required";
    if (!scheduleTiming.trim())
      newErrors.scheduleTiming = "Schedule timing is required";
    if (!maxSeats || maxSeats <= 0)
      newErrors.maxSeats = "Max seats must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmedSave = () => {
    setIsSubmitting(true);
    try {
      const matchedCourses = courseCodes
        .map((cCode) => courses.find((c) => (c.code || c.courseCode) === cCode))
        .filter(Boolean) as Course[];
      const courseNames = matchedCourses.map((c) => c.name || c.courseName || "").filter(Boolean);
      const primaryCourse = matchedCourses[0];

      if (isEdit && batchToEdit) {
        const updated = batchService.updateBatch(batchToEdit.id, {
          name: batchName,
          code: batchCode.toUpperCase().trim(),
          batchCode: batchCode.toUpperCase().trim(),
          batchName,
          courseCodes,
          courseCode: primaryCourse?.code || primaryCourse?.courseCode || courseCodes[0] || "",
          courseNames,
          courseName: primaryCourse?.name || primaryCourse?.courseName || courseNames[0] || "",
          trainerName,
          startDate,
          endDate,
          start_date: startDate,
          end_date: endDate,
          timing: scheduleTiming,
          scheduleTiming,
          mode,
          capacity: Number(maxSeats),
          maxSeats: Number(maxSeats),
          enrolledSeats: Number(enrolledSeats),
          classroomLocation,
          status,
        });
        if (updated) {
          setIsConfirmModalOpen(false);
          if (onSuccess) onSuccess(updated);
          router.push("/batches");
        }
      } else {
        const created = batchService.createBatch({
          name: batchName,
          code: batchCode.toUpperCase().trim(),
          batchCode: batchCode.toUpperCase().trim(),
          batchName,
          courseCodes,
          courseCode: primaryCourse?.code || primaryCourse?.courseCode || courseCodes[0] || "",
          courseNames,
          courseName: primaryCourse?.name || primaryCourse?.courseName || courseNames[0] || "",
          trainerName,
          startDate: startDate || new Date().toISOString().split("T")[0],
          endDate,
          start_date: startDate || new Date().toISOString().split("T")[0],
          end_date: endDate,
          timing: scheduleTiming,
          scheduleTiming,
          mode,
          capacity: Number(maxSeats),
          maxSeats: Number(maxSeats),
          enrolledSeats: 0,
          classroomLocation,
          status,
        });
        setIsConfirmModalOpen(false);
        if (onSuccess) onSuccess(created);
        router.push("/batches");
      }
    } catch (err) {
      console.error("Failed to save batch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-4xl">
        {/* 1. Basic Info */}
        <BatchBasicInfoSection
          courses={courses}
          courseCodes={courseCodes}
          batchCode={batchCode}
          batchName={batchName}
          trainerName={trainerName}
          status={status}
          onCourseCodesChange={handleCourseCodesChange}
          onBatchCodeChange={setBatchCode}
          onBatchNameChange={setBatchName}
          onTrainerNameChange={setTrainerName}
          onStatusChange={setStatus}
          errors={errors}
        />

        {/* 2. Schedule & Capacity */}
        <BatchScheduleSection
          scheduleTiming={scheduleTiming}
          mode={mode}
          startDate={startDate}
          endDate={endDate}
          maxSeats={maxSeats}
          classroomLocation={classroomLocation}
          onScheduleTimingChange={setScheduleTiming}
          onModeChange={setMode}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onMaxSeatsChange={setMaxSeats}
          onClassroomLocationChange={setClassroomLocation}
          errors={errors}
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/batches")}
            disabled={isSubmitting}
          >
            Cancel & Return
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            }
          >
            {isEdit ? "Update Batch Cohort" : "Schedule Batch"}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal on Save */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={isEdit ? "Save Batch Cohort Updates?" : "Confirm New Academic Batch"}
        message={
          isEdit
            ? `Are you sure you want to update batch "${batchName}" (${batchCode}) linked with ${courseCodes.length} course(s) and ${maxSeats} max seats?`
            : `Are you sure you want to schedule new batch "${batchName}" (${batchCode}) with ${courseCodes.length} linked course(s) led by ${trainerName}?`
        }
        confirmLabel={isEdit ? "Yes, Save Changes" : "Yes, Schedule Batch"}
        cancelLabel="Review Schedule"
        variant="primary"
        isLoading={isSubmitting}
        onConfirm={handleConfirmedSave}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
}

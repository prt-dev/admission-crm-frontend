"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Course, CourseCategory, CourseStatus } from "@/types/course";
import { courseService } from "@/services/courseService";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CourseBasicInfoSection from "./CourseBasicInfoSection";
import CourseCurriculumSection from "./CourseCurriculumSection";

interface CourseFormProps {
  courseToEdit?: Course | null;
  onSuccess?: (course: Course) => void;
}

export default function CourseForm({
  courseToEdit,
  onSuccess,
}: CourseFormProps) {
  const router = useRouter();
  const isEdit = Boolean(courseToEdit);

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState<CourseCategory>("IT & Software");
  const [duration, setDuration] = useState("");
  const [totalFee, setTotalFee] = useState<number>(45000);
  const [eligibility, setEligibility] = useState("");
  const [skillIndiaSector, setSkillIndiaSector] = useState("");
  const [skillIndiaQpCode, setSkillIndiaQpCode] = useState("");
  const [status, setStatus] = useState<CourseStatus>("Active");
  const [description, setDescription] = useState("");
  const [syllabusInput, setSyllabusInput] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (courseToEdit) {
      setCourseCode(courseToEdit.courseCode);
      setCourseName(courseToEdit.courseName);
      setCategory(courseToEdit.category);
      setDuration(courseToEdit.duration);
      setTotalFee(courseToEdit.totalFee);
      setEligibility(courseToEdit.eligibility);
      setSkillIndiaSector(courseToEdit.skillIndiaSector || "");
      setSkillIndiaQpCode(courseToEdit.skillIndiaQpCode || "");
      setStatus(courseToEdit.status);
      setDescription(courseToEdit.description || "");
      setSyllabusInput((courseToEdit.syllabusHighlights || []).join("\n"));
    } else {
      setCourseCode("CRS-NEW-" + Math.floor(100 + Math.random() * 900));
      setCourseName("");
      setCategory("IT & Software");
      setDuration("6 Months (360 Hours)");
      setTotalFee(45000);
      setEligibility("12th Pass / Graduate");
      setSkillIndiaSector("IT-ITeS Sector Skill Council");
      setSkillIndiaQpCode("SSC/Q0501");
      setStatus("Active");
      setDescription("");
      setSyllabusInput("");
    }
  }, [courseToEdit]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!courseCode.trim()) newErrors.courseCode = "Course code is required";
    if (!courseName.trim()) newErrors.courseName = "Course title is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!totalFee || totalFee <= 0) newErrors.totalFee = "Valid total fee is required";

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
      const syllabusHighlights = syllabusInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      if (isEdit && courseToEdit) {
        const updated = courseService.updateCourse(courseToEdit.id, {
          courseCode: courseCode.toUpperCase().trim(),
          courseName,
          category,
          duration,
          totalFee: Number(totalFee),
          eligibility,
          skillIndiaSector,
          skillIndiaQpCode,
          status,
          description,
          syllabusHighlights,
        });
        if (updated) {
          setIsConfirmModalOpen(false);
          if (onSuccess) onSuccess(updated);
          router.push("/courses");
        }
      } else {
        const created = courseService.createCourse({
          courseCode: courseCode.toUpperCase().trim(),
          courseName,
          category,
          duration,
          totalFee: Number(totalFee),
          eligibility: eligibility || "12th Pass / Graduate",
          skillIndiaSector: skillIndiaSector || "National Skill Development Corporation (NSDC)",
          skillIndiaQpCode,
          status,
          description,
          syllabusHighlights,
        });
        setIsConfirmModalOpen(false);
        if (onSuccess) onSuccess(created);
        router.push("/courses");
      }
    } catch (err) {
      console.error("Failed to save course:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-4xl">
        {/* 1. Basic Info */}
        <CourseBasicInfoSection
          courseCode={courseCode}
          courseName={courseName}
          category={category}
          duration={duration}
          totalFee={totalFee}
          status={status}
          onCourseCodeChange={setCourseCode}
          onCourseNameChange={setCourseName}
          onCategoryChange={setCategory}
          onDurationChange={setDuration}
          onTotalFeeChange={setTotalFee}
          onStatusChange={setStatus}
          errors={errors}
        />

        {/* 2. Curriculum & Syllabus */}
        <CourseCurriculumSection
          eligibility={eligibility}
          skillIndiaSector={skillIndiaSector}
          skillIndiaQpCode={skillIndiaQpCode}
          description={description}
          syllabusInput={syllabusInput}
          onEligibilityChange={setEligibility}
          onSkillIndiaSectorChange={setSkillIndiaSector}
          onSkillIndiaQpCodeChange={setSkillIndiaQpCode}
          onDescriptionChange={setDescription}
          onSyllabusInputChange={setSyllabusInput}
          errors={errors}
        />

        {/* Actions */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/courses")}
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
            {isEdit ? "Update Course" : "Save Course Program"}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal on Save */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={isEdit ? "Save Course Program Changes?" : "Confirm New Course Program"}
        message={
          isEdit
            ? `Are you sure you want to update course "${courseName}" (${courseCode}) with a fee of ₹${totalFee.toLocaleString()}?`
            : `Are you sure you want to create new course "${courseName}" (${courseCode}) in category "${category}"?`
        }
        confirmLabel={isEdit ? "Yes, Save Changes" : "Yes, Create Course"}
        cancelLabel="Review Details"
        variant="primary"
        isLoading={isSubmitting}
        onConfirm={handleConfirmedSave}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
}

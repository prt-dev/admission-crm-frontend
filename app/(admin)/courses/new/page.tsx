"use client";

import React from "react";
import { Breadcrumb } from "@/components/ui";
import CourseForm from "@/components/forms/courses/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Courses & Programs", href: "/courses" },
            { label: "New Course", active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Create New Academic Course
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Define syllabus, fees, duration, and Skill India qualification criteria.
        </p>
      </div>

      {/* Form Component */}
      <CourseForm />
    </div>
  );
}

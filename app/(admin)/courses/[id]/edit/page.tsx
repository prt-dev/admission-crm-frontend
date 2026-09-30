"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Button } from "@/components/ui";
import { Course } from "@/types/course";
import { courseService } from "@/services/courseService";
import CourseForm from "@/components/forms/courses/CourseForm";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const courses = courseService.getCourses();
      const found = courses.find((c) => c.id === id || c.courseCode === id);
      if (found) {
        setCourse(found);
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

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Course Program Not Found
        </h2>
        <p className="text-xs text-gray-500">
          The requested course record could not be found.
        </p>
        <Button onClick={() => router.push("/courses")} variant="primary" size="sm">
          Return to Courses Catalog
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
            { label: "Courses & Programs", href: "/courses" },
            { label: `Edit ${course.courseCode}`, active: true },
          ]}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Edit Course: {course.courseName} ({course.courseCode})
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Update course fees, eligibility guidelines, description, and syllabus modules.
        </p>
      </div>

      {/* Form Component */}
      <CourseForm courseToEdit={course} />
    </div>
  );
}

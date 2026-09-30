import { Course } from "@/types/course";
import { initialCourses } from "@/data/courseData";

const STORAGE_KEY = "crm_courses_v1";
export const CRM_COURSE_CHANGED_EVENT = "crm_course_changed";

const isBrowser = typeof window !== "undefined";

function triggerCourseEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_COURSE_CHANGED_EVENT, { detail: { type: "courses" } })
    );
  }
}

export const courseService = {
  getCourses: function (): Course[] {
    if (!isBrowser) return initialCourses;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCourses));
        return initialCourses;
      }
      return JSON.parse(stored);
    } catch {
      return initialCourses;
    }
  },

  getCourseByCode: function (courseCode: string): Course | undefined {
    const courses = this.getCourses();
    return courses.find(
      (c) => c.courseCode.toLowerCase() === courseCode.toLowerCase()
    );
  },

  getCourseById: function (id: string): Course | undefined {
    const courses = this.getCourses();
    return courses.find((c) => c.id === id || c.courseCode === id);
  },

  createCourse: function (
    courseData: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
      courseCode: courseData.courseCode.toUpperCase().trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newCourse, ...courses];
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      triggerCourseEvent();
    }
    return newCourse;
  },

  updateCourse: function (id: string, updates: Partial<Course>): Course | null {
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === id || c.courseCode === id);
    if (index === -1) return null;

    const updatedCourse: Course = {
      ...courses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    courses[index] = updatedCourse;
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      triggerCourseEvent();
    }
    return updatedCourse;
  },

  deleteCourse: function (id: string): boolean {
    const courses = this.getCourses();
    const filtered = courses.filter((c) => c.id !== id && c.courseCode !== id);
    if (filtered.length === courses.length) return false;

    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      triggerCourseEvent();
    }
    return true;
  },

  subscribe: function (callback: () => void): () => void {
    if (!isBrowser) return () => {};
    const handler = () => callback();
    window.addEventListener(CRM_COURSE_CHANGED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CRM_COURSE_CHANGED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

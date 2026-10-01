import {
  Course,
  CourseFilterState,
  CreateCourseDTO,
  UpdateCourseDTO,
} from "@/types/course";
import { initialCourses } from "@/data/courseData";
import { apiCourseService } from "./apiCourseService";
import { courseCache } from "./courseCache";

export const CRM_COURSE_CHANGED_EVENT = "crm_course_changed";

const isBrowser = typeof window !== "undefined";

function triggerCourseEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_COURSE_CHANGED_EVENT, { detail: { type: "courses" } })
    );
  }
}

/**
 * Normalizes a course object from backend/cache to ensure consistent keys across the frontend.
 */
export function normalizeCourse(raw: any): Course {
  if (!raw) return raw;
  const code = raw.code || raw.courseCode || "";
  const name = raw.name || raw.courseName || "";
  const fee = raw.fee !== undefined ? Number(raw.fee) : raw.totalFee !== undefined ? Number(raw.totalFee) : 0;
  const duration = raw.duration || "";
  const description = raw.description || "";
  const status = raw.status !== undefined ? raw.status : 1;

  return {
    ...raw,
    id: raw.id,
    name,
    code,
    fee,
    duration,
    description,
    status,
    // Aliases for seamless UI compatibility
    courseCode: code,
    courseName: name,
    totalFee: fee,
    category: raw.category || "OVERVIEW OF ELEVATOR INDUSTRY",
    eligibility: raw.eligibility || "10th / 12th / ITI Pass",
    skillIndiaSector: raw.skillIndiaSector || "Capital Goods & Elevator Industry",
    skillIndiaQpCode: raw.skillIndiaQpCode,
    classroomLocation: raw.classroomLocation,
    syllabusHighlights: raw.syllabusHighlights,
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || new Date().toISOString(),
  };
}

export const courseService = {
  // ==========================================
  // 1. READ / QUERY OPERATIONS
  // ==========================================

  /**
   * Reads courses with TTL cache verification and backend API fallback
   */
  getCourses: async function (
    filters?: Partial<CourseFilterState>,
    forceRefresh: boolean = false
  ): Promise<Course[]> {
    let courses: Course[] | null = null;

    if (!forceRefresh) {
      courses = courseCache.getValidCache();
    } else {
      courseCache.clearCache();
    }

    if (!courses) {
      try {
        const response = await apiCourseService.getAll({
          search: filters?.searchQuery,
          category: filters?.category !== "All Categories" && filters?.category !== "all" ? filters?.category : undefined,
          status: filters?.status !== "All Status" && filters?.status !== "all" ? filters?.status : undefined,
        });

        const items = (response.data as any)?.items ?? response.data;

        if (response.success && Array.isArray(items) && items.length > 0) {
          courses = items.map(normalizeCourse);
          courseCache.setCache(courses);
        } else {
          courses = initialCourses.map(normalizeCourse);
          courseCache.setCache(courses);
        }
      } catch (apiError) {
        console.warn("apiCourseService.getAll failed in courseService, falling back to local cache/seed:", apiError);
        courses = (courseCache.getValidCache() || initialCourses).map(normalizeCourse);
      }
    } else {
      courses = courses.map(normalizeCourse);
    }

    return this.applyFilters(courses, filters);
  },

  getCourseByCode: async function (courseCode: string): Promise<Course | undefined> {
    const courses = await this.getCourses();
    const clean = (courseCode || "").trim().toLowerCase();
    return courses.find(
      (c) => (c.code || c.courseCode || "").toLowerCase() === clean
    );
  },

  getCourseById: async function (id: string | number): Promise<Course | undefined> {
    const courses = await this.getCourses();
    return courses.find(
      (c) => String(c.id) === String(id) || (c.code || c.courseCode) === id
    );
  },

  // ==========================================
  // 2. CREATE OPERATIONS
  // ==========================================
  createCourse: function (
    courseData: Omit<Course, "id" | "createdAt" | "updatedAt"> | CreateCourseDTO
  ): Course {
    const courses = (courseCache.getValidCache() || initialCourses).map(normalizeCourse);
    const code = courseData.code || courseData.courseCode || `CRS-${Date.now()}`;
    const name = courseData.name || courseData.courseName || "Untitled Course";

    const newCourse = normalizeCourse({
      ...courseData,
      id: `crs-${Date.now()}`,
      name,
      code: code.toUpperCase().trim(),
      courseCode: code.toUpperCase().trim(),
      courseName: name,
      category: courseData.category || "OVERVIEW OF ELEVATOR INDUSTRY",
      duration: courseData.duration || "6 Months (360 Hours)",
      fee: courseData.fee !== undefined ? Number(courseData.fee) : Number(courseData.totalFee) || 0,
      totalFee: courseData.fee !== undefined ? Number(courseData.fee) : Number(courseData.totalFee) || 0,
      eligibility: courseData.eligibility || "10th / 12th / ITI Pass",
      skillIndiaSector: courseData.skillIndiaSector || "Capital Goods & Elevator Industry",
      skillIndiaQpCode: courseData.skillIndiaQpCode,
      status: courseData.status || 1,
      classroomLocation: courseData.classroomLocation,
      description: courseData.description || "",
      syllabusHighlights: courseData.syllabusHighlights,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [newCourse, ...courses];
    courseCache.setCache(updated);
    triggerCourseEvent();

    // Async backend sync in try/catch
    if (isBrowser) {
      apiCourseService
        .create(courseData)
        .then((res) => {
          if (res.success && res.data) {
            const normalizedSaved = normalizeCourse(res.data);
            const freshList = (courseCache.getValidCache() || updated).map((c) =>
              c.id === newCourse.id ? normalizedSaved : c
            );
            courseCache.setCache(freshList);
            triggerCourseEvent();
          }
        })
        .catch((err) => {
          console.warn("Async backend createCourse call failed, retaining local course:", err);
        });
    }

    return newCourse;
  },

  // ==========================================
  // 3. UPDATE OPERATIONS
  // ==========================================
  updateCourse: function (id: string | number, updates: Partial<Course> | UpdateCourseDTO): Course | null {
    const courses = (courseCache.getValidCache() || initialCourses).map(normalizeCourse);
    const index = courses.findIndex(
      (c) => String(c.id) === String(id) || c.code === id || c.courseCode === id
    );
    if (index === -1) return null;

    const updatedCourse = normalizeCourse({
      ...courses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    courses[index] = updatedCourse;
    courseCache.setCache(courses);
    triggerCourseEvent();

    // Async backend update in try/catch
    if (isBrowser) {
      apiCourseService
        .update(id, updates)
        .catch((err) => {
          console.warn(`Async backend updateCourse(${id}) failed:`, err);
        });
    }

    return updatedCourse;
  },

  updateCourseStatus: function (id: string | number, status: string | number): Course | null {
    if (isBrowser) {
      apiCourseService.updateStatus(id, status).catch((err) => {
        console.warn(`Async backend updateCourseStatus(${id}) failed:`, err);
      });
    }
    return this.updateCourse(id, { status: status as any });
  },

  // ==========================================
  // 4. DELETE OPERATIONS
  // ==========================================
  deleteCourse: function (id: string | number): boolean {
    const courses = (courseCache.getValidCache() || initialCourses).map(normalizeCourse);
    const filtered = courses.filter(
      (c) => String(c.id) !== String(id) && c.code !== id && c.courseCode !== id
    );
    if (filtered.length === courses.length) return false;

    courseCache.setCache(filtered);
    triggerCourseEvent();

    // Async backend delete with try/catch
    if (isBrowser) {
      apiCourseService.delete(id).catch((err) => {
        console.warn(`Async backend deleteCourse(${id}) failed:`, err);
      });
    }

    return true;
  },

  // ==========================================
  // 5. HELPER FILTERING
  // ==========================================
  applyFilters: function (
    courses: Course[],
    filters?: Partial<CourseFilterState>
  ): Course[] {
    if (!filters) return courses;

    return courses.filter((c) => {
      const courseName = c.name || c.courseName || "";
      const courseCode = c.code || c.courseCode || "";
      const description = c.description || "";

      const matchSearch =
        !filters.searchQuery ||
        courseName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        courseCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchCategory =
        !filters.category ||
        filters.category === "All Categories" ||
        filters.category === "all" ||
        c.category === filters.category;

      const matchStatus =
        !filters.status ||
        filters.status === "All Status" ||
        filters.status === "all" ||
        String(c.status) === String(filters.status) ||
        (filters.status === "Active" && (c.status === 1 || c.status === "Active")) ||
        (filters.status === "Inactive" && (c.status === 2 || c.status === "Inactive"));

      return matchSearch && matchCategory && matchStatus;
    });
  },

  // Direct Cache & API References
  cache: courseCache,
  api: apiCourseService,

  // ==========================================
  // 6. REACTIVE SUBSCRIPTION
  // ==========================================
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

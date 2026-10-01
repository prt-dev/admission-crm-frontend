import { apiClient, ApiResponse } from "./apiClient";
import {
  Course,
  CreateCourseDTO,
  UpdateCourseDTO,
  CourseQueryParams,
} from "@/types/course";

/**
 * Format course data into the exact schema expected by Laravel `StoreCourseRequest` / `UpdateCourseRequest`.
 */
function formatCoursePayload(data: Partial<CreateCourseDTO | Course>) {
  const payload: Record<string, any> = {};

  if (data.name !== undefined || data.courseName !== undefined) {
    payload.name = data.name || data.courseName;
  }
  if (data.code !== undefined || data.courseCode !== undefined) {
    payload.code = data.code || data.courseCode;
  }
  if (data.description !== undefined) {
    payload.description = data.description;
  }
  if (data.duration !== undefined) {
    payload.duration = data.duration;
  }
  if (data.fee !== undefined || data.totalFee !== undefined) {
    payload.fee = data.fee !== undefined ? Number(data.fee) : Number(data.totalFee);
  }
  if (data.status !== undefined) {
    if (typeof data.status === "string") {
      payload.status = data.status === "Active" ? 1 : 2;
    } else {
      payload.status = Number(data.status);
    }
  }
  if (data.created_by !== undefined) {
    payload.created_by = data.created_by;
  }

  return payload;
}

/**
 * REST API Service for Courses Module
 * Mapped to backend routes defined in `routes/api.php` under `CourseController`.
 */
export const apiCourseService = {
  /**
   * Fetch all courses with query filters and pagination
   * GET /api/courses
   * Backend Controller: CourseController@index
   */
  getAll: async function (
    params?: CourseQueryParams
  ): Promise<ApiResponse<Course[]>> {
    return apiClient.get<Course[]>("courses", params);
  },

  /**
   * Fetch a single course by ID
   * GET /api/courses/{id}
   * Backend Controller: CourseController@show
   */
  getById: async function (
    id: string | number
  ): Promise<ApiResponse<Course>> {
    return apiClient.get<Course>(`courses/${id}`);
  },

  /**
   * Create a new course record
   * POST /api/courses
   * Backend Controller: CourseController@store
   */
  create: async function (
    data: CreateCourseDTO | Partial<Course>
  ): Promise<ApiResponse<Course>> {
    const payload = formatCoursePayload(data);
    return apiClient.post<Course>("courses", payload);
  },

  /**
   * Fully update a course record
   * PUT /api/courses/{id}
   * Backend Controller: CourseController@update
   */
  update: async function (
    id: string | number,
    data: UpdateCourseDTO | Partial<Course>
  ): Promise<ApiResponse<Course>> {
    const payload = formatCoursePayload(data);
    return apiClient.put<Course>(`courses/${id}`, payload);
  },

  /**
   * Partially update attributes of a course
   * PATCH /api/courses/{id}
   */
  patch: async function (
    id: string | number,
    data: Partial<Course>
  ): Promise<ApiResponse<Course>> {
    const payload = formatCoursePayload(data);
    return apiClient.patch<Course>(`courses/${id}`, payload);
  },

  /**
   * Delete a course record
   * DELETE /api/courses/{id}
   * Backend Controller: CourseController@destroy
   */
  delete: async function (
    id: string | number
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`courses/${id}`);
  },

  /**
   * Update the status of a course (1=Active, 2=Inactive)
   * PATCH /api/courses/{id}/status
   * Backend Controller: CourseController@updateStatus
   */
  updateStatus: async function (
    id: string | number,
    status: number | string
  ): Promise<ApiResponse<Course>> {
    const numericStatus =
      typeof status === "string" ? (status === "Active" ? 1 : 2) : Number(status);
    return apiClient.patch<Course>(`courses/${id}/status`, { status: numericStatus });
  },
};

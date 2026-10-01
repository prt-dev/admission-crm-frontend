import { apiClient, ApiResponse } from "./apiClient";
import {
  AcademicSession,
  AcademicSessionStatus,
  AcademicSessionMetrics,
  CreateAcademicSessionDTO,
  UpdateAcademicSessionDTO,
  AcademicSessionQueryParams,
} from "@/types/session";

/**
 * REST API Service for AcademicSession Model
 * Directly mapped to backend routes defined in `routes/api.php` under `AcademicSessionController`.
 */
export const apiSessionService = {
  /**
   * Fetch all academic sessions with query filters and pagination
   * GET /api/sessions
   * Backend Controller: AcademicSessionController@index
   */
  getAll: async function (
    params?: AcademicSessionQueryParams
  ): Promise<ApiResponse<AcademicSession[]>> {
    return apiClient.get<AcademicSession[]>("sessions", params);
  },

  /**
   * Fetch a single academic session by its ID
   * GET /api/sessions/{id}
   * Backend Controller: AcademicSessionController@show
   */
  getById: async function (
    id: string | number
  ): Promise<ApiResponse<AcademicSession>> {
    return apiClient.get<AcademicSession>(`sessions/${id}`);
  },

  /**
   * Fetch the current active academic session
   * GET /api/sessions/current
   * Backend Controller: AcademicSessionController@current
   */
  getCurrent: async function (): Promise<ApiResponse<AcademicSession>> {
    return apiClient.get<AcademicSession>("sessions/current");
  },

  /**
   * Create a new academic session record
   * POST /api/sessions
   * Backend Controller: AcademicSessionController@store
   */
  create: async function (
    data: CreateAcademicSessionDTO | Partial<AcademicSession>
  ): Promise<ApiResponse<AcademicSession>> {
    return apiClient.post<AcademicSession>("sessions", data);
  },

  /**
   * Fully update an academic session record
   * PUT /api/sessions/{id}
   * Backend Controller: AcademicSessionController@update
   */
  update: async function (
    id: string | number,
    data: UpdateAcademicSessionDTO | Partial<AcademicSession>
  ): Promise<ApiResponse<AcademicSession>> {
    return apiClient.put<AcademicSession>(`sessions/${id}`, data);
  },

  /**
   * Partially update attributes of an academic session
   * PATCH /api/sessions/{id}
   */
  patch: async function (
    id: string | number,
    data: Partial<AcademicSession>
  ): Promise<ApiResponse<AcademicSession>> {
    return apiClient.patch<AcademicSession>(`sessions/${id}`, data);
  },

  /**
   * Delete an academic session record
   * DELETE /api/sessions/{id}
   * Backend Controller: AcademicSessionController@destroy
   */
  delete: async function (
    id: string | number
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`sessions/${id}`);
  },

  /**
   * Update the status of an academic session (1=Upcoming, 2=Active, 3=Completed, 4=Archived)
   * PATCH /api/sessions/{id}/status
   * Backend Controller: AcademicSessionController@updateStatus
   */
  updateStatus: async function (
    id: string | number,
    status: AcademicSessionStatus
  ): Promise<ApiResponse<AcademicSession>> {
    return apiClient.patch<AcademicSession>(`sessions/${id}/status`, { status });
  },

  /**
   * Set an academic session as the current active session
   * POST /api/sessions/{id}/set-current
   * Backend Controller: AcademicSessionController@setCurrent
   */
  setCurrent: async function (
    id: string | number
  ): Promise<ApiResponse<AcademicSession>> {
    return apiClient.post<AcademicSession>(`sessions/${id}/set-current`);
  },

  /**
   * Fetch batches associated with an academic session
   * GET /api/sessions/{id}/batches
   * Backend Controller: AcademicSessionController@batches
   */
  getBatches: async function <T = any>(
    id: string | number,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<ApiResponse<T[]>> {
    return apiClient.get<T[]>(`sessions/${id}/batches`, params);
  },

  /**
   * Fetch aggregate metrics and capacity statistics across academic sessions
   * GET /api/sessions/metrics
   */
  getMetrics: async function (): Promise<ApiResponse<AcademicSessionMetrics>> {
    return apiClient.get<AcademicSessionMetrics>("sessions/metrics");
  },
};

// Aliases for naming flexibility
export const apiAcademicSessionService = apiSessionService;

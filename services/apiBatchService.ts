import { apiClient, ApiResponse } from "./apiClient";
import {
  Batch,
  CreateBatchDTO,
  UpdateBatchDTO,
  BatchQueryParams,
} from "@/types/batch";

/**
 * Format batch data into the exact schema expected by Laravel `StoreBatchRequest` / `UpdateBatchRequest`.
 */
function formatBatchPayload(data: Partial<CreateBatchDTO | Batch>) {
  const payload: Record<string, any> = {};

  if (data.name !== undefined || data.batchName !== undefined) {
    payload.name = data.name || data.batchName;
  }
  if (data.code !== undefined || data.batchCode !== undefined) {
    payload.code = data.code || data.batchCode;
  }
  if (data.academic_session_id !== undefined) {
    payload.academic_session_id = data.academic_session_id;
  }
  if (data.course_ids !== undefined) {
    payload.course_ids = data.course_ids;
  }
  if (data.start_date !== undefined || data.startDate !== undefined) {
    payload.start_date = data.start_date || data.startDate;
  }
  if (data.end_date !== undefined || data.endDate !== undefined) {
    payload.end_date = data.end_date || data.endDate;
  }
  if (data.timing !== undefined || data.scheduleTiming !== undefined) {
    payload.timing = data.timing || data.scheduleTiming;
  }
  if (data.capacity !== undefined || data.maxSeats !== undefined) {
    payload.capacity = data.capacity !== undefined ? Number(data.capacity) : Number(data.maxSeats);
  }
  if (data.status !== undefined) {
    if (typeof data.status === "string") {
      switch (data.status) {
        case "Upcoming":
          payload.status = 1;
          break;
        case "Ongoing":
          payload.status = 2;
          break;
        case "Completed":
          payload.status = 3;
          break;
        case "Cancelled":
        case "Full":
          payload.status = 4;
          break;
        default:
          payload.status = 1;
      }
    } else {
      payload.status = Number(data.status);
    }
  }
  if (data.instructor_id !== undefined) {
    payload.instructor_id = data.instructor_id;
  }
  if (data.created_by !== undefined) {
    payload.created_by = data.created_by;
  }

  return payload;
}

/**
 * REST API Service for Batches Module
 * Mapped to backend routes defined in `routes/api.php` under `BatchController`.
 */
export const apiBatchService = {
  /**
   * Fetch all batches with query filters and pagination
   * GET /api/batches
   * Backend Controller: BatchController@index
   */
  getAll: async function (
    params?: BatchQueryParams
  ): Promise<ApiResponse<Batch[]>> {
    return apiClient.get<Batch[]>("batches", params);
  },

  /**
   * Fetch a single batch by ID
   * GET /api/batches/{id}
   * Backend Controller: BatchController@show
   */
  getById: async function (
    id: string | number
  ): Promise<ApiResponse<Batch>> {
    return apiClient.get<Batch>(`batches/${id}`);
  },

  /**
   * Fetch batches for an academic session
   * GET /api/sessions/{sessionId}/batches
   * Backend Controller: AcademicSessionController@batches
   */
  getBySession: async function (
    sessionId: string | number
  ): Promise<ApiResponse<Batch[]>> {
    return apiClient.get<Batch[]>(`sessions/${sessionId}/batches`);
  },

  /**
   * Create a new batch record
   * POST /api/batches
   * Backend Controller: BatchController@store
   */
  create: async function (
    data: CreateBatchDTO | Partial<Batch>
  ): Promise<ApiResponse<Batch>> {
    const payload = formatBatchPayload(data);
    return apiClient.post<Batch>("batches", payload);
  },

  /**
   * Fully update a batch record
   * PUT /api/batches/{id}
   * Backend Controller: BatchController@update
   */
  update: async function (
    id: string | number,
    data: UpdateBatchDTO | Partial<Batch>
  ): Promise<ApiResponse<Batch>> {
    const payload = formatBatchPayload(data);
    return apiClient.put<Batch>(`batches/${id}`, payload);
  },

  /**
   * Partially update attributes of a batch
   * PATCH /api/batches/{id}
   */
  patch: async function (
    id: string | number,
    data: Partial<Batch>
  ): Promise<ApiResponse<Batch>> {
    const payload = formatBatchPayload(data);
    return apiClient.patch<Batch>(`batches/${id}`, payload);
  },

  /**
   * Delete a batch record
   * DELETE /api/batches/{id}
   * Backend Controller: BatchController@destroy
   */
  delete: async function (
    id: string | number
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`batches/${id}`);
  },

  /**
   * Update the status of a batch (1=Upcoming, 2=Ongoing, 3=Completed, 4=Cancelled)
   * PATCH /api/batches/{id}/status
   * Backend Controller: BatchController@updateStatus
   */
  updateStatus: async function (
    id: string | number,
    status: number | string
  ): Promise<ApiResponse<Batch>> {
    let numericStatus = typeof status === "number" ? status : 1;
    if (typeof status === "string") {
      switch (status) {
        case "Upcoming":
          numericStatus = 1;
          break;
        case "Ongoing":
          numericStatus = 2;
          break;
        case "Completed":
          numericStatus = 3;
          break;
        case "Cancelled":
        case "Full":
          numericStatus = 4;
          break;
        default:
          numericStatus = Number(status) || 1;
      }
    }
    return apiClient.patch<Batch>(`batches/${id}/status`, { status: numericStatus });
  },
};

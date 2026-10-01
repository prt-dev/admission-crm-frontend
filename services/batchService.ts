import {
  Batch,
  BatchFilterState,
  CreateBatchDTO,
  UpdateBatchDTO,
} from "@/types/batch";
import { initialBatches } from "@/data/batchData";
import { apiBatchService } from "./apiBatchService";
import { batchCache } from "./batchCache";

export const CRM_BATCH_CHANGED_EVENT = "crm_batch_changed";

const isBrowser = typeof window !== "undefined";

function triggerBatchEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_BATCH_CHANGED_EVENT, { detail: { type: "batches" } })
    );
  }
}

/**
 * Normalizes a batch object from backend/cache to ensure consistent keys across the frontend.
 */
export function normalizeBatch(raw: any): Batch {
  if (!raw) return raw;
  const code = raw.code || raw.batchCode || "";
  const name = raw.name || raw.batchName || "";
  const capacity = raw.capacity !== undefined ? Number(raw.capacity) : raw.maxSeats !== undefined ? Number(raw.maxSeats) : 30;
  const status = raw.status !== undefined ? raw.status : 1;
  const timing = raw.timing || raw.scheduleTiming || "";
  const startDate = raw.start_date || raw.startDate || "";
  const endDate = raw.end_date || raw.endDate || "";

  const courseCodes: string[] =
    raw.courseCodes ||
    (raw.courses?.map((c: any) => c.code || c.courseCode)) ||
    (raw.courseCode ? [raw.courseCode] : []);

  const courseNames: string[] =
    raw.courseNames ||
    (raw.courses?.map((c: any) => c.name || c.courseName)) ||
    (raw.courseName ? [raw.courseName] : []);

  const courseCode = raw.courseCode || courseCodes[0] || "";
  const courseName = raw.courseName || courseNames[0] || "";

  const trainerName =
    raw.trainerName ||
    raw.instructor?.name ||
    "Faculty Instructor";

  return {
    ...raw,
    id: raw.id,
    name,
    code,
    capacity,
    timing,
    start_date: startDate,
    end_date: endDate,
    status,
    academic_session_id: raw.academic_session_id,
    // Aliases for seamless UI compatibility
    batchCode: code,
    batchName: name,
    maxSeats: capacity,
    enrolledSeats: raw.enrolledSeats !== undefined ? Number(raw.enrolledSeats) : 0,
    scheduleTiming: timing,
    startDate,
    endDate,
    courseCodes,
    courseNames,
    courseCode,
    courseName,
    trainerName,
    mode: raw.mode || "Offline (Classroom)",
    classroomLocation: raw.classroomLocation || "Lab 302 / Smart Classroom",
    academicSessionCode: raw.academicSessionCode || raw.academic_session?.code,
    academicSessionName: raw.academicSessionName || raw.academic_session?.name,
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || new Date().toISOString(),
  };
}

export const batchService = {
  // ==========================================
  // 1. READ / QUERY OPERATIONS
  // ==========================================

  /**
   * Reads batches with TTL cache verification and backend API fallback
   */
  getBatches: async function (
    filters?: Partial<BatchFilterState>,
    forceRefresh: boolean = false
  ): Promise<Batch[]> {
    let batches: Batch[] | null = null;

    if (!forceRefresh) {
      batches = batchCache.getValidCache();
    } else {
      batchCache.clearCache();
    }

    if (!batches) {
      try {
        const response = await apiBatchService.getAll({
          search: filters?.searchQuery,
          course_code: filters?.courseCode !== "All Courses" && filters?.courseCode !== "all" ? filters?.courseCode : undefined,
          mode: filters?.mode !== "All Modes" && filters?.mode !== "all" ? filters?.mode : undefined,
          status: filters?.status !== "All Status" && filters?.status !== "all" ? filters?.status : undefined,
        });

        const items = (response.data as any)?.items ?? response.data;

        if (response.success && Array.isArray(items) && items.length > 0) {
          batches = items.map(normalizeBatch);
          batchCache.setCache(batches);
        } else {
          batches = initialBatches.map(normalizeBatch);
          batchCache.setCache(batches);
        }
      } catch (apiError) {
        console.warn("apiBatchService.getAll failed in batchService, falling back to local cache/seed:", apiError);
        batches = (batchCache.getValidCache() || initialBatches).map(normalizeBatch);
      }
    } else {
      batches = batches.map(normalizeBatch);
    }

    return this.applyFilters(batches, filters);
  },

  getBatchByCode: async function (batchCode: string): Promise<Batch | undefined> {
    const batches = await this.getBatches();
    const clean = (batchCode || "").trim().toLowerCase();
    return batches.find(
      (b) => (b.code || b.batchCode || "").toLowerCase() === clean
    );
  },

  getBatchById: async function (id: string | number): Promise<Batch | undefined> {
    const batches = await this.getBatches();
    return batches.find(
      (b) => String(b.id) === String(id) || (b.code || b.batchCode) === id
    );
  },

  getBatchesByCourse: async function (courseCode: string): Promise<Batch[]> {
    const batches = await this.getBatches();
    const cleanCode = (courseCode || "").trim().toLowerCase();
    return batches.filter((b) => {
      if (
        b.courseCodes &&
        b.courseCodes.some((c) => c.toLowerCase() === cleanCode)
      ) {
        return true;
      }
      if (b.courseCode && b.courseCode.toLowerCase() === cleanCode) {
        return true;
      }
      if (b.courses && b.courses.some((c) => c.code.toLowerCase() === cleanCode)) {
        return true;
      }
      return false;
    });
  },

  getBatchesBySession: async function (sessionIdOrCode: string | number): Promise<Batch[]> {
    const batches = await this.getBatches();
    const cleanParam = String(sessionIdOrCode || "").trim().toLowerCase();
    const yearMatch = cleanParam.match(/\b(20\d\d)\b/);
    const startYear = yearMatch ? yearMatch[1] : "";

    return batches.filter((b) => {
      if (b.academic_session_id && String(b.academic_session_id) === cleanParam) {
        return true;
      }
      if (b.academicSessionCode && b.academicSessionCode.toLowerCase() === cleanParam) {
        return true;
      }
      if (b.academic_session?.code && b.academic_session.code.toLowerCase() === cleanParam) {
        return true;
      }
      if (startYear && b.start_date && b.start_date.startsWith(startYear)) {
        return true;
      }
      if (startYear && b.startDate && b.startDate.startsWith(startYear)) {
        return true;
      }
      return false;
    });
  },

  generateNextBatchCode: function (courseInput?: string[] | string): string {
    const currentYear = new Date().getFullYear();
    const batches = (batchCache.getValidCache() || initialBatches).map(normalizeBatch);
    let primaryCode = "";
    if (Array.isArray(courseInput) && courseInput.length > 0) {
      primaryCode = courseInput[0];
    } else if (typeof courseInput === "string" && courseInput) {
      primaryCode = courseInput;
    }
    const cleanPrefix = primaryCode ? primaryCode.replace("CRS-", "").split("-")[0] : "GEN";
    const pattern = `BAT-${currentYear}-${cleanPrefix || "GEN"}`;
    const matching = batches.filter((b) => (b.code || b.batchCode || "").startsWith(pattern));
    const nextSeq = (matching.length + 1).toString().padStart(2, "0");
    return `${pattern}${nextSeq}`;
  },

  // ==========================================
  // 2. CREATE OPERATIONS
  // ==========================================
  createBatch: function (
    batchData: Omit<Batch, "id" | "createdAt" | "updatedAt"> | CreateBatchDTO
  ): Batch {
    const batches = (batchCache.getValidCache() || initialBatches).map(normalizeBatch);
    const selectedCourseCodes = batchData.courseCodes?.length
      ? batchData.courseCodes
      : batchData.courseCode
      ? [batchData.courseCode]
      : [];

    const code = batchData.code || batchData.batchCode || this.generateNextBatchCode(selectedCourseCodes);
    const name = batchData.name || batchData.batchName || "New Training Batch";

    const newBatch = normalizeBatch({
      ...batchData,
      id: `bat-${Date.now()}`,
      name,
      code,
      batchName: name,
      batchCode: code,
      courseCodes: selectedCourseCodes,
      courseCode: batchData.courseCode || selectedCourseCodes[0] || "",
      courseNames: batchData.courseNames || [],
      courseName: batchData.courseName || "",
      trainerName: batchData.trainerName || "Faculty Instructor",
      start_date: batchData.start_date || batchData.startDate || new Date().toISOString().split("T")[0],
      end_date: batchData.end_date || batchData.endDate || new Date().toISOString().split("T")[0],
      startDate: batchData.start_date || batchData.startDate || new Date().toISOString().split("T")[0],
      endDate: batchData.end_date || batchData.endDate || new Date().toISOString().split("T")[0],
      timing: batchData.timing || batchData.scheduleTiming || "09:30 AM - 01:30 PM",
      scheduleTiming: batchData.timing || batchData.scheduleTiming || "09:30 AM - 01:30 PM",
      mode: batchData.mode || "Offline (Classroom)",
      capacity: batchData.capacity !== undefined ? Number(batchData.capacity) : (batchData.maxSeats || 30),
      maxSeats: batchData.capacity !== undefined ? Number(batchData.capacity) : (batchData.maxSeats || 30),
      enrolledSeats: batchData.enrolledSeats || 0,
      classroomLocation: batchData.classroomLocation || "Smart Bay 101",
      status: batchData.status || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [newBatch, ...batches];
    batchCache.setCache(updated);
    triggerBatchEvent();

    // Async backend sync in try/catch
    if (isBrowser) {
      apiBatchService
        .create(batchData)
        .then((res) => {
          if (res.success && res.data) {
            const normalizedSaved = normalizeBatch(res.data);
            const freshList = (batchCache.getValidCache() || updated).map((b) =>
              b.id === newBatch.id ? normalizedSaved : b
            );
            batchCache.setCache(freshList);
            triggerBatchEvent();
          }
        })
        .catch((err) => {
          console.warn("Async backend createBatch call failed, retaining local batch:", err);
        });
    }

    return newBatch;
  },

  // ==========================================
  // 3. UPDATE OPERATIONS
  // ==========================================
  updateBatch: function (id: string | number, updates: Partial<Batch> | UpdateBatchDTO): Batch | null {
    const batches = (batchCache.getValidCache() || initialBatches).map(normalizeBatch);
    const index = batches.findIndex(
      (b) => String(b.id) === String(id) || b.code === id || b.batchCode === id
    );
    if (index === -1) return null;

    const existing = batches[index];
    const selectedCourseCodes =
      updates.courseCodes !== undefined
        ? updates.courseCodes
        : existing.courseCodes || (existing.courseCode ? [existing.courseCode] : []);

    const updatedBatch = normalizeBatch({
      ...existing,
      ...updates,
      courseCodes: selectedCourseCodes,
      courseCode:
        updates.courseCode ||
        selectedCourseCodes[0] ||
        existing.courseCode ||
        "",
      courseNames:
        updates.courseNames ||
        existing.courseNames ||
        [],
      courseName:
        updates.courseName ||
        existing.courseName ||
        "",
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    batches[index] = updatedBatch;
    batchCache.setCache(batches);
    triggerBatchEvent();

    // Async backend update in try/catch
    if (isBrowser) {
      apiBatchService
        .update(id, updates)
        .catch((err) => {
          console.warn(`Async backend updateBatch(${id}) failed:`, err);
        });
    }

    return updatedBatch;
  },

  updateBatchStatus: function (id: string | number, status: string | number): Batch | null {
    if (isBrowser) {
      apiBatchService.updateStatus(id, status).catch((err) => {
        console.warn(`Async backend updateBatchStatus(${id}) failed:`, err);
      });
    }
    return this.updateBatch(id, { status: status as any });
  },

  // ==========================================
  // 4. DELETE OPERATIONS
  // ==========================================
  deleteBatch: function (id: string | number): boolean {
    const batches = (batchCache.getValidCache() || initialBatches).map(normalizeBatch);
    const filtered = batches.filter(
      (b) => String(b.id) !== String(id) && b.code !== id && b.batchCode !== id
    );
    if (filtered.length === batches.length) return false;

    batchCache.setCache(filtered);
    triggerBatchEvent();

    // Async backend delete with try/catch
    if (isBrowser) {
      apiBatchService.delete(id).catch((err) => {
        console.warn(`Async backend deleteBatch(${id}) failed:`, err);
      });
    }

    return true;
  },

  // ==========================================
  // 5. HELPER FILTERING
  // ==========================================
  applyFilters: function (
    batches: Batch[],
    filters?: Partial<BatchFilterState>
  ): Batch[] {
    if (!filters) return batches;

    return batches.filter((b) => {
      const batchName = b.name || b.batchName || "";
      const batchCode = b.code || b.batchCode || "";
      const trainerName = b.trainerName || "";

      const matchSearch =
        !filters.searchQuery ||
        batchName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        batchCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        trainerName.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchCourse =
        !filters.courseCode ||
        filters.courseCode === "All Courses" ||
        filters.courseCode === "all" ||
        b.courseCode === filters.courseCode ||
        (b.courseCodes && b.courseCodes.includes(filters.courseCode));

      const matchMode =
        !filters.mode ||
        filters.mode === "All Modes" ||
        filters.mode === "all" ||
        b.mode === filters.mode;

      const matchStatus =
        !filters.status ||
        filters.status === "All Status" ||
        filters.status === "all" ||
        String(b.status) === String(filters.status) ||
        (filters.status === "Upcoming" && (b.status === 1 || b.status === "Upcoming")) ||
        (filters.status === "Ongoing" && (b.status === 2 || b.status === "Ongoing")) ||
        (filters.status === "Completed" && (b.status === 3 || b.status === "Completed")) ||
        ((filters.status === "Cancelled" || filters.status === "Full") && (b.status === 4 || b.status === "Cancelled" || b.status === "Full"));

      return matchSearch && matchCourse && matchMode && matchStatus;
    });
  },

  // Direct Cache & API References
  cache: batchCache,
  api: apiBatchService,

  // ==========================================
  // 6. REACTIVE SUBSCRIPTION
  // ==========================================
  subscribe: function (callback: () => void): () => void {
    if (!isBrowser) return () => {};
    const handler = () => callback();
    window.addEventListener(CRM_BATCH_CHANGED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CRM_BATCH_CHANGED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

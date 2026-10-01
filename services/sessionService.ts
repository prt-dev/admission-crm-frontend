import {
  AcademicSession,
  AcademicSessionStatus,
  AcademicSessionMetrics,
  AcademicSessionFilterState,
  ACADEMIC_SESSION_STATUS,
  CreateAcademicSessionDTO,
  UpdateAcademicSessionDTO,
} from "@/types/session";

import {
  initialAcademicSessions,
  calculateAcademicSessionMetrics,
} from "@/data/sessionData";
import { initialBatches } from "@/data/batchData";

import { batchService } from "./batchService";
import { batchCache } from "./batchCache";
import { apiSessionService } from "./apiSessionService";
import { sessionCache } from "./sessionCache";

export const CRM_ACADEMIC_SESSION_CHANGED_EVENT = "crm_academic_session_changed";

const isBrowser = typeof window !== "undefined";

function triggerAcademicSessionEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_ACADEMIC_SESSION_CHANGED_EVENT, {
        detail: { type: "academic_sessions" },
      })
    );
  }
}

export const sessionService = {
  // ==========================================
  // 1. READ / QUERY OPERATIONS
  // ==========================================

  /**
   * Reads academic sessions with TTL cache verification and backend API fallback
   * 1. If valid cache exists in sessionCache and not forceRefresh, returns cached data immediately.
   * 2. If expired or missing, calls apiSessionService.getAll() inside try/catch and re-caches fresh data.
   */
  getSessions: async function (
    filters?: Partial<AcademicSessionFilterState>,
    forceRefresh: boolean = false
  ): Promise<AcademicSession[]> {
    let sessions: AcademicSession[] | null = null;

    if (!forceRefresh) {
      sessions = sessionCache.getValidCache();
    } else {
      sessionCache.clearCache();
    }

    if (!sessions) {
      try {
        const response = await apiSessionService.getAll({
          search: filters?.searchQuery,
          status: filters?.status !== "all" ? filters?.status : undefined,
          year: filters?.year !== "all" ? filters?.year : undefined,
        });

        const items = (response.data as any)?.items ?? response.data;

        if (response.success && Array.isArray(items) && items.length > 0) {
          sessions = items;
          sessionCache.setCache(sessions);
        } else {
          sessions = initialAcademicSessions;
          sessionCache.setCache(sessions);
        }
      } catch (apiError) {
        console.warn("apiSessionService.getAll failed in sessionService, falling back to local cache/seed:", apiError);
        sessions = sessionCache.getValidCache() || initialAcademicSessions;
      }
    }

    return this.applyFilters(sessions, filters);
  },

  getCurrentSession: async function (): Promise<AcademicSession | undefined> {
    const sessions = await this.getSessions();
    return sessions.find((s) => s.is_current || s.isCurrent) || sessions[0];
  },

  getSessionById: async function (id: string | number): Promise<AcademicSession | undefined> {
    const sessions = await this.getSessions();
    return sessions.find(
      (s) =>
        String(s.id) === String(id) ||
        s.code === id ||
        s.sessionCode === id
    );
  },

  getSessionByCode: async function (code: string): Promise<AcademicSession | undefined> {
    const sessions = await this.getSessions();
    const clean = code.trim().toLowerCase();
    return sessions.find(
      (s) =>
        (s.code && s.code.toLowerCase() === clean) ||
        (s.sessionCode && s.sessionCode.toLowerCase() === clean)
    );
  },

  getMetrics: function (
    providedSessions?: AcademicSession[],
    providedBatches?: import("@/types/batch").Batch[]
  ): AcademicSessionMetrics {
    const sessions = providedSessions || sessionCache.getValidCache() || initialAcademicSessions;
    const batches = providedBatches || batchCache.getValidCache() || initialBatches;
    return calculateAcademicSessionMetrics(sessions, batches);
  },

  generateNextSessionCode: function (startYear: number): string {
    const nextYearSuffix = (startYear + 1).toString().slice(2);
    return `SESS-${startYear}-${nextYearSuffix}`;
  },

  // ==========================================
  // 2. CREATE OPERATIONS
  // ==========================================
  createSession: function (
    sessionData: Partial<AcademicSession>
  ): AcademicSession {
    const sessions = sessionCache.getValidCache() || initialAcademicSessions;
    const startDate = sessionData.start_date || sessionData.startDate || "2026-04-01";
    const startYear = parseInt(startDate.slice(0, 4), 10) || 2026;
    const code =
      sessionData.code ||
      sessionData.sessionCode ||
      this.generateNextSessionCode(startYear);
    const name =
      sessionData.name ||
      sessionData.sessionName ||
      `${startYear}-${startYear + 1}`;
    const is_current = Boolean(sessionData.is_current ?? sessionData.isCurrent);
    const status: AcademicSessionStatus =
      sessionData.status !== undefined
        ? (Number(sessionData.status) as AcademicSessionStatus)
        : is_current
          ? ACADEMIC_SESSION_STATUS.ACTIVE
          : ACADEMIC_SESSION_STATUS.UPCOMING;

    // If marked as current, unset previous active current session
    let updatedSessions = [...sessions];
    if (is_current) {
      updatedSessions = updatedSessions.map((s) => ({
        ...s,
        is_current: false,
        isCurrent: false,
      }));
    }

    const newSession: AcademicSession = {
      id: Date.now(),
      name: name.trim(),
      code: code.toUpperCase().trim(),
      start_date: startDate,
      end_date: sessionData.end_date || sessionData.endDate || `${startYear + 1}-03-31`,
      is_current,
      status,
      description: sessionData.description || null,
      created_by: sessionData.created_by || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      runningBatchesCount: 0,
      totalEnrolledStudents: 0,
      totalCapacitySeats: 0,
      sessionName: name.trim(),
      sessionCode: code.toUpperCase().trim(),
      startDate,
      endDate: sessionData.end_date || sessionData.endDate || `${startYear + 1}-03-31`,
      isCurrent: is_current,
    };

    const finalSessions = [newSession, ...updatedSessions];
    sessionCache.setCache(finalSessions);
    triggerAcademicSessionEvent();

    // Fire asynchronous backend sync with try/catch
    if (isBrowser) {
      apiSessionService
        .create(sessionData as CreateAcademicSessionDTO)
        .then((res) => {
          if (res.success && res.data) {
            // Replace temporary client ID with server-generated ID
            const freshList = (sessionCache.getValidCache() || finalSessions).map((s) =>
              String(s.id) === String(newSession.id) ? res.data : s
            );
            sessionCache.setCache(freshList);
            triggerAcademicSessionEvent();
          }
        })
        .catch((err) => {
          console.warn("Async backend createSession call failed, retaining local session:", err);
        });
    }

    return newSession;
  },

  // ==========================================
  // 3. UPDATE / EDIT OPERATIONS
  // ==========================================
  updateSession: function (
    id: string | number,
    updates: Partial<AcademicSession>
  ): AcademicSession | null {
    const sessions = sessionCache.getValidCache() || initialAcademicSessions;
    const index = sessions.findIndex(
      (s) =>
        String(s.id) === String(id) ||
        s.code === id ||
        s.sessionCode === id
    );
    if (index === -1) return null;

    const isCurrentUpdating = Boolean(
      updates.is_current !== undefined ? updates.is_current : updates.isCurrent
    );

    let updatedList = [...sessions];

    if (isCurrentUpdating) {
      updatedList = updatedList.map((s) => ({
        ...s,
        is_current: String(s.id) === String(id) || s.code === id || s.sessionCode === id,
        isCurrent: String(s.id) === String(id) || s.code === id || s.sessionCode === id,
      }));
    }

    const currentItem = updatedList[index];
    const name = updates.name ?? updates.sessionName ?? currentItem.name;
    const code = updates.code ?? updates.sessionCode ?? currentItem.code;
    const start_date = updates.start_date ?? updates.startDate ?? currentItem.start_date;
    const end_date = updates.end_date ?? updates.endDate ?? currentItem.end_date;
    const is_current =
      updates.is_current !== undefined
        ? updates.is_current
        : updates.isCurrent !== undefined
          ? updates.isCurrent
          : currentItem.is_current;
    const status =
      updates.status !== undefined
        ? (Number(updates.status) as AcademicSessionStatus)
        : currentItem.status;

    const updatedSession: AcademicSession = {
      ...currentItem,
      ...updates,
      name,
      code,
      start_date,
      end_date,
      is_current,
      status,
      description: updates.description !== undefined ? updates.description : currentItem.description,
      updated_at: new Date().toISOString(),
      // Sync aliases
      sessionName: name,
      sessionCode: code,
      startDate: start_date,
      endDate: end_date,
      isCurrent: is_current,
    };

    updatedList[index] = updatedSession;
    sessionCache.setCache(updatedList);
    triggerAcademicSessionEvent();

    // Async backend update in try/catch
    if (isBrowser) {
      apiSessionService
        .update(id, updates as UpdateAcademicSessionDTO)
        .catch((err) => {
          console.warn(`Async backend updateSession(${id}) failed:`, err);
        });
    }

    return updatedSession;
  },

  updateSessionStatus: function (
    id: string | number,
    status: AcademicSessionStatus
  ): AcademicSession | null {
    if (isBrowser) {
      apiSessionService.updateStatus(id, status).catch((err) => {
        console.warn(`Async backend updateSessionStatus(${id}) failed:`, err);
      });
    }
    return this.updateSession(id, { status });
  },

  setAsCurrentSession: function (id: string | number): AcademicSession | null {
    if (isBrowser) {
      apiSessionService.setCurrent(id).catch((err) => {
        console.warn(`Async backend setAsCurrentSession(${id}) failed:`, err);
      });
    }
    return this.updateSession(id, {
      is_current: true,
      status: ACADEMIC_SESSION_STATUS.ACTIVE,
    });
  },

  // ==========================================
  // 4. DELETE OPERATIONS
  // ==========================================
  deleteSession: function (id: string | number): boolean {
    const sessions = sessionCache.getValidCache() || initialAcademicSessions;
    const filtered = sessions.filter(
      (s) =>
        String(s.id) !== String(id) &&
        s.code !== id &&
        s.sessionCode !== id
    );
    if (filtered.length === sessions.length) return false;

    sessionCache.setCache(filtered);
    triggerAcademicSessionEvent();

    // Async backend delete with try/catch
    if (isBrowser) {
      apiSessionService.delete(id).catch((err) => {
        console.warn(`Async backend deleteSession(${id}) failed:`, err);
      });
    }

    return true;
  },

  // ==========================================
  // 5. HELPER FILTERING
  // ==========================================
  applyFilters: function (
    sessions: AcademicSession[],
    filters?: Partial<AcademicSessionFilterState>
  ): AcademicSession[] {
    if (!filters) return sessions;

    return sessions.filter((s) => {
      const sessionName = s.name || s.sessionName || "";
      const sessionCode = s.code || s.sessionCode || "";
      const sessionDesc = s.description || "";

      const matchSearch =
        !filters.searchQuery ||
        sessionName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        sessionCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        sessionDesc.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchStatus =
        !filters.status ||
        filters.status === "all" ||
        String(s.status) === String(filters.status) ||
        (filters.status === "Active" && s.status === 2) ||
        (filters.status === "Upcoming" && s.status === 1) ||
        (filters.status === "Completed" && s.status === 3) ||
        (filters.status === "Archived" && s.status === 4);

      return matchSearch && matchStatus;
    });
  },

  // Direct Cache & API References
  cache: sessionCache,
  api: apiSessionService,

  // ==========================================
  // 6. REACTIVE SUBSCRIPTION
  // ==========================================
  subscribe: function (callback: () => void): () => void {
    if (!isBrowser) return () => { };
    const handler = () => callback();
    window.addEventListener(CRM_ACADEMIC_SESSION_CHANGED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CRM_ACADEMIC_SESSION_CHANGED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

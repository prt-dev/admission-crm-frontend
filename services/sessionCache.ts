import { AcademicSession, SessionCacheEnvelope } from "@/types/session";

export const SESSION_STORAGE_KEY = "crm_academic_sessions_v3";

// Default TTL: 5 minutes in milliseconds
export const DEFAULT_SESSION_CACHE_TTL_MS = 5 * 60 * 1000;

const isBrowser = typeof window !== "undefined";

/**
 * Dedicated cache manager for Academic Session data with TTL expiration
 */
export const sessionCache = {
  storageKey: SESSION_STORAGE_KEY,
  ttlMs: DEFAULT_SESSION_CACHE_TTL_MS,

  /**
   * Explicitly remove the session cache from localStorage
   */
  clearCache: function (): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear session cache from localStorage:", error);
    }
  },

  /**
   * Invalidate cache (alias for clearCache)
   */
  invalidate: function (): void {
    this.clearCache();
  },

  /**
   * Save academic sessions list to localStorage with the current timestamp
   */
  setCache: function (data: AcademicSession[]): void {
    if (!isBrowser) return;
    try {
      const envelope: SessionCacheEnvelope = {
        data,
        cachedAt: Date.now(),
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(envelope));
    } catch (error) {
      console.error("Failed to write session cache to localStorage:", error);
    }
  },

  /**
   * Retrieve valid cached data.
   * If cache is expired based on TTL, it clears localStorage and returns null.
   */
  getValidCache: function (ttlMs: number = DEFAULT_SESSION_CACHE_TTL_MS): AcademicSession[] | null {
    if (!isBrowser) return null;
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;

      // Backward compatibility: check if stored as raw array or envelope
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        // Migrate legacy array to envelope format with current timestamp
        this.setCache(parsed);
        return parsed;
      }

      const envelope = parsed as SessionCacheEnvelope;
      if (!envelope || !Array.isArray(envelope.data) || typeof envelope.cachedAt !== "number") {
        this.clearCache();
        return null;
      }

      const age = Date.now() - envelope.cachedAt;

      // If cache exceeded TTL, evict it
      if (age > ttlMs) {
        this.clearCache();
        return null;
      }

      return envelope.data;
    } catch (error) {
      console.warn("Corrupted session cache detected. Clearing cache:", error);
      this.clearCache();
      return null;
    }
  },

  /**
   * Check if valid unexpired cache is present
   */
  isCacheValid: function (ttlMs: number = DEFAULT_SESSION_CACHE_TTL_MS): boolean {
    return this.getValidCache(ttlMs) !== null;
  },

  /**
   * Get the age of the current cache in milliseconds (or -1 if missing)
   */
  getCacheAge: function (): number {
    if (!isBrowser) return -1;
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return -1;
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.cachedAt === "number") {
        return Date.now() - parsed.cachedAt;
      }
      return -1;
    } catch {
      return -1;
    }
  },
};

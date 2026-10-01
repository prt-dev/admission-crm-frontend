import { Batch, BatchCacheEnvelope } from "@/types/batch";

export const BATCH_STORAGE_KEY = "crm_batches_v4";

// Default TTL: 5 minutes in milliseconds
export const DEFAULT_BATCH_CACHE_TTL_MS = 5 * 60 * 1000;

const isBrowser = typeof window !== "undefined";

/**
 * Dedicated cache manager for Batches data with TTL expiration
 */
export const batchCache = {
  storageKey: BATCH_STORAGE_KEY,
  ttlMs: DEFAULT_BATCH_CACHE_TTL_MS,

  /**
   * Explicitly remove the batch cache from localStorage
   */
  clearCache: function (): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(BATCH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear batch cache from localStorage:", error);
    }
  },

  /**
   * Invalidate cache (alias for clearCache)
   */
  invalidate: function (): void {
    this.clearCache();
  },

  /**
   * Save batches list to localStorage with the current timestamp
   */
  setCache: function (data: Batch[]): void {
    if (!isBrowser) return;
    try {
      const envelope: BatchCacheEnvelope = {
        data,
        cachedAt: Date.now(),
      };
      localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(envelope));
    } catch (error) {
      console.error("Failed to write batch cache to localStorage:", error);
    }
  },

  /**
   * Retrieve valid cached data.
   * If cache is expired based on TTL, it clears localStorage and returns null.
   */
  getValidCache: function (ttlMs: number = DEFAULT_BATCH_CACHE_TTL_MS): Batch[] | null {
    if (!isBrowser) return null;
    try {
      const stored = localStorage.getItem(BATCH_STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        this.setCache(parsed);
        return parsed;
      }

      const envelope = parsed as BatchCacheEnvelope;
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
      console.warn("Corrupted batch cache detected. Clearing cache:", error);
      this.clearCache();
      return null;
    }
  },

  /**
   * Check if valid unexpired cache is present
   */
  isCacheValid: function (ttlMs: number = DEFAULT_BATCH_CACHE_TTL_MS): boolean {
    return this.getValidCache(ttlMs) !== null;
  },

  /**
   * Get the age of the current cache in milliseconds (or -1 if missing)
   */
  getCacheAge: function (): number {
    if (!isBrowser) return -1;
    try {
      const stored = localStorage.getItem(BATCH_STORAGE_KEY);
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

import { Batch } from "@/types/batch";
import { initialBatches } from "@/data/batchData";
import { courseService } from "./courseService";

const STORAGE_KEY = "crm_batches_v1";
export const CRM_BATCH_CHANGED_EVENT = "crm_batch_changed";

const isBrowser = typeof window !== "undefined";

function triggerBatchEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_BATCH_CHANGED_EVENT, { detail: { type: "batches" } })
    );
  }
}

export const batchService = {
  getBatches: function (): Batch[] {
    if (!isBrowser) return initialBatches;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBatches));
        return initialBatches;
      }
      return JSON.parse(stored);
    } catch {
      return initialBatches;
    }
  },

  getBatchByCode: function (batchCode: string): Batch | undefined {
    const batches = this.getBatches();
    return batches.find(
      (b) => b.batchCode.toLowerCase() === batchCode.toLowerCase()
    );
  },

  getBatchById: function (id: string): Batch | undefined {
    const batches = this.getBatches();
    return batches.find((b) => b.id === id || b.batchCode === id);
  },

  getBatchesByCourse: function (courseCode: string): Batch[] {
    const batches = this.getBatches();
    return batches.filter(
      (b) => b.courseCode.toLowerCase() === courseCode.toLowerCase()
    );
  },

  generateNextBatchCode: function (courseCode: string): string {
    const currentYear = new Date().getFullYear();
    const batches = this.getBatches();
    const cleanPrefix = courseCode.replace("CRS-", "").split("-")[0] || "GEN";
    const pattern = `BAT-${currentYear}-${cleanPrefix}`;
    const matching = batches.filter((b) => b.batchCode.startsWith(pattern));
    const nextSeq = (matching.length + 1).toString().padStart(2, "0");
    return `${pattern}${nextSeq}`;
  },

  createBatch: function (
    batchData: Omit<Batch, "id" | "createdAt" | "updatedAt">
  ): Batch {
    const batches = this.getBatches();
    const course = courseService.getCourseByCode(batchData.courseCode);

    const newBatch: Batch = {
      ...batchData,
      id: `bat-${Date.now()}`,
      batchCode:
        batchData.batchCode || this.generateNextBatchCode(batchData.courseCode),
      courseName: course?.courseName || batchData.courseName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newBatch, ...batches];
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      triggerBatchEvent();
    }
    return newBatch;
  },

  updateBatch: function (id: string, updates: Partial<Batch>): Batch | null {
    const batches = this.getBatches();
    const index = batches.findIndex((b) => b.id === id || b.batchCode === id);
    if (index === -1) return null;

    const updatedBatch: Batch = {
      ...batches[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    batches[index] = updatedBatch;
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
      triggerBatchEvent();
    }
    return updatedBatch;
  },

  deleteBatch: function (id: string): boolean {
    const batches = this.getBatches();
    const filtered = batches.filter((b) => b.id !== id && b.batchCode !== id);
    if (filtered.length === batches.length) return false;

    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      triggerBatchEvent();
    }
    return true;
  },

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

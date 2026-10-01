import { Admission } from "@/types/admission";
import { initialAdmissions } from "@/data/admissionData";
import { initialCourses } from "@/data/courseData";
import { initialBatches } from "@/data/batchData";
import { courseService } from "./courseService";
import { batchService } from "./batchService";
import { courseCache } from "./courseCache";
import { batchCache } from "./batchCache";

const STORAGE_KEY = "crm_admissions_v3";
export const CRM_ADMISSION_CHANGED_EVENT = "crm_admission_changed";

const isBrowser = typeof window !== "undefined";

function triggerAdmissionEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_ADMISSION_CHANGED_EVENT, {
        detail: { type: "admissions" },
      })
    );
  }
}

export const admissionService = {
  getAdmissions: function (): Admission[] {
    if (!isBrowser) return initialAdmissions;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAdmissions));
        return initialAdmissions;
      }
      return JSON.parse(stored);
    } catch {
      return initialAdmissions;
    }
  },

  getAdmissionById: function (id: string): Admission | undefined {
    const admissions = this.getAdmissions();
    return admissions.find((a) => a.id === id || a.studentId === id);
  },

  generateNextStudentId: function (): string {
    const currentYear = new Date().getFullYear();
    const admissions = this.getAdmissions();
    const base = 1001 + admissions.length;
    return `STU-${currentYear}-${base}`;
  },

  generateNextRegistrationId: function (): string {
    const currentYear = new Date().getFullYear();
    const admissions = this.getAdmissions();
    const base = 2001 + admissions.length;
    return `REG-${currentYear}-${base}`;
  },

  generateNextSkillIndiaId: function (): string {
    const currentYear = new Date().getFullYear();
    const admissions = this.getAdmissions();
    const base = 4401 + admissions.length;
    return `SIP-IND-${currentYear}-${base}`;
  },

  getAutoBatchForCourse: function (courseCode: string): string {
    const batches = batchCache.getValidCache() || initialBatches;
    const cleanCode = (courseCode || "").trim().toLowerCase();
    const matchingBatches = batches.filter(
      (b) =>
        (b.code || b.batchCode || "").toLowerCase() === cleanCode ||
        (b.courseCode && b.courseCode.toLowerCase() === cleanCode) ||
        (b.courseCodes && b.courseCodes.some((c) => c.toLowerCase() === cleanCode))
    );

    if (matchingBatches.length === 0) {
      return batchService.generateNextBatchCode(courseCode);
    }
    const available = matchingBatches.find(
      (b) =>
        (b.status === 1 || b.status === 2 || b.status === "Upcoming" || b.status === "Ongoing") &&
        (b.enrolledSeats || 0) < (b.capacity || b.maxSeats || 30)
    );
    if (available) return (available.code || available.batchCode || "");
    return (matchingBatches[0].code || matchingBatches[0].batchCode || "");
  },

  createAdmission: function (
    admissionData: Omit<Admission, "id" | "createdAt" | "updatedAt">
  ): Admission {
    const admissions = this.getAdmissions();
    const courses = courseCache.getValidCache() || initialCourses;
    const batches = batchCache.getValidCache() || initialBatches;

    const course = courses.find(
      (c) => (c.code || c.courseCode || "").toLowerCase() === (admissionData.courseCode || "").toLowerCase()
    );
    const batch = batches.find(
      (b) => (b.code || b.batchCode || "").toLowerCase() === (admissionData.batchCode || "").toLowerCase()
    );

    const newAdmission: Admission = {
      ...admissionData,
      id: `adm-${Date.now()}`,
      studentId: admissionData.studentId || this.generateNextStudentId(),
      registrationId:
        admissionData.registrationId || this.generateNextRegistrationId(),
      skillIndiaRegId:
        admissionData.skillIndiaRegId || this.generateNextSkillIndiaId(),
      courseName: course?.name || course?.courseName || admissionData.courseName,
      batchName: batch?.name || batch?.batchName || admissionData.batchName,
      totalFee: admissionData.totalFee || course?.fee || course?.totalFee || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newAdmission, ...admissions];
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (batch) {
        batchService.updateBatch(batch.id, {
          enrolledSeats: (batch.enrolledSeats || 0) + 1,
        });
      }
      triggerAdmissionEvent();
    }
    return newAdmission;
  },

  updateAdmission: function (
    id: string,
    updates: Partial<Admission>
  ): Admission | null {
    const admissions = this.getAdmissions();
    const index = admissions.findIndex((a) => a.id === id || a.studentId === id);
    if (index === -1) return null;

    let courseName = updates.courseName || admissions[index].courseName;
    if (updates.courseCode && updates.courseCode !== admissions[index].courseCode) {
      const courses = courseCache.getValidCache() || initialCourses;
      const course = courses.find((c) => (c.code || c.courseCode || "").toLowerCase() === (updates.courseCode || "").toLowerCase());
      if (course) courseName = course.name || course.courseName || courseName;
    }

    let batchName = updates.batchName || admissions[index].batchName;
    if (updates.batchCode && updates.batchCode !== admissions[index].batchCode) {
      const batches = batchCache.getValidCache() || initialBatches;
      const batch = batches.find((b) => (b.code || b.batchCode || "").toLowerCase() === (updates.batchCode || "").toLowerCase());
      if (batch) batchName = batch.name || batch.batchName || batchName;
    }

    const updatedAdmission: Admission = {
      ...admissions[index],
      ...updates,
      courseName,
      batchName,
      updatedAt: new Date().toISOString(),
    };

    admissions[index] = updatedAdmission;
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admissions));
      triggerAdmissionEvent();
    }
    return updatedAdmission;
  },

  deleteAdmission: function (id: string): boolean {
    const admissions = this.getAdmissions();
    const target = admissions.find((a) => a.id === id || a.studentId === id);
    const filtered = admissions.filter((a) => a.id !== id && a.studentId !== id);
    if (filtered.length === admissions.length) return false;

    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      if (target?.batchCode) {
        const batches = batchCache.getValidCache() || initialBatches;
        const batch = batches.find((b) => (b.code || b.batchCode || "").toLowerCase() === (target.batchCode || "").toLowerCase());
        if (batch && (batch.enrolledSeats || 0) > 0) {
          batchService.updateBatch(batch.id, {
            enrolledSeats: (batch.enrolledSeats || 1) - 1,
          });
        }
      }
      triggerAdmissionEvent();
    }
    return true;
  },

  getStats: function () {
    const admissions = this.getAdmissions();
    const courses = courseCache.getValidCache() || initialCourses;
    const batches = batchCache.getValidCache() || initialBatches;

    const total = admissions.length;
    const active = admissions.filter((a) => a.status === "Active").length;
    const certified = admissions.filter((a) => a.status === "Certified").length;
    const inactive = admissions.filter((a) => a.status === "Inactive").length;
    const totalCollected = admissions.reduce(
      (acc, a) => acc + (a.amountPaid || 0),
      0
    );
    const totalExpected = admissions.reduce(
      (acc, a) => acc + (a.totalFee || 0),
      0
    );

    return {
      totalAdmissions: total,
      activeAdmissions: active,
      certifiedAdmissions: certified,
      inactiveAdmissions: inactive,
      // Backward compatibility fields
      confirmedAdmissions: active,
      pendingAdmissions: inactive,
      totalCourses: courses.length,
      activeBatches: batches.filter(
        (b) => b.status === 2 || b.status === 1 || b.status === "Ongoing" || b.status === "Upcoming"
      ).length,
      totalFeeCollected: totalCollected,
      totalFeeExpected: totalExpected,
      feeCollectionRate:
        totalExpected > 0
          ? Math.round((totalCollected / totalExpected) * 100)
          : 0,
    };
  },

  subscribeToChanges: function (callback: () => void): () => void {
    if (!isBrowser) return () => {};
    const handler = () => callback();
    window.addEventListener(CRM_ADMISSION_CHANGED_EVENT, handler);
    window.addEventListener("crm_course_changed", handler);
    window.addEventListener("crm_batch_changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CRM_ADMISSION_CHANGED_EVENT, handler);
      window.removeEventListener("crm_course_changed", handler);
      window.removeEventListener("crm_batch_changed", handler);
      window.removeEventListener("storage", handler);
    };
  },
};

// Re-export courseService & batchService for full backward compatibility
export { courseService } from "./courseService";
export { batchService } from "./batchService";

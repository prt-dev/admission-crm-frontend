import { Admission } from "@/types/admission";
import { initialAdmissions } from "@/data/admissionData";
import { courseService } from "./courseService";
import { batchService } from "./batchService";

const STORAGE_KEY = "crm_admissions_v1";
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
    const list = this.getAdmissions();
    return list.find((a) => a.id === id || a.studentId === id);
  },

  // Auto generation helpers
  generateNextStudentId: function (): string {
    const currentYear = new Date().getFullYear();
    const admissions = this.getAdmissions();
    const prefix = `STU-${currentYear}-`;
    const matching = admissions.filter((a) => a.studentId?.startsWith(prefix));
    const nextSeq = (matching.length + 1).toString().padStart(4, "0");
    return `${prefix}${nextSeq}`;
  },

  generateNextRegistrationId: function (): string {
    const currentYear = new Date().getFullYear();
    const admissions = this.getAdmissions();
    const base = 7890 + admissions.length;
    return `REG-${currentYear}-${base}`;
  },

  generateNextSkillIndiaId: function (): string {
    const currentYear = new Date().getFullYear();
    const admissions = this.getAdmissions();
    const base = 4401 + admissions.length;
    return `SIP-IND-${currentYear}-${base}`;
  },

  getAutoBatchForCourse: function (courseCode: string): string {
    const batches = batchService.getBatchesByCourse(courseCode);
    if (batches.length === 0) {
      return batchService.generateNextBatchCode(courseCode);
    }
    const available = batches.find(
      (b) =>
        (b.status === "Upcoming" || b.status === "Ongoing") &&
        b.enrolledSeats < b.maxSeats
    );
    if (available) return available.batchCode;
    return batches[0].batchCode;
  },

  createAdmission: function (
    admissionData: Omit<Admission, "id" | "createdAt" | "updatedAt">
  ): Admission {
    const admissions = this.getAdmissions();
    const course = courseService.getCourseByCode(admissionData.courseCode);
    const batch = batchService.getBatchByCode(admissionData.batchCode);

    const newAdmission: Admission = {
      ...admissionData,
      id: `adm-${Date.now()}`,
      studentId: admissionData.studentId || this.generateNextStudentId(),
      registrationId:
        admissionData.registrationId || this.generateNextRegistrationId(),
      skillIndiaRegId:
        admissionData.skillIndiaRegId || this.generateNextSkillIndiaId(),
      courseName: course?.courseName || admissionData.courseName,
      batchName: batch?.batchName || admissionData.batchName,
      totalFee: admissionData.totalFee || course?.totalFee || 0,
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
      const course = courseService.getCourseByCode(updates.courseCode);
      if (course) courseName = course.courseName;
    }

    let batchName = updates.batchName || admissions[index].batchName;
    if (updates.batchCode && updates.batchCode !== admissions[index].batchCode) {
      const batch = batchService.getBatchByCode(updates.batchCode);
      if (batch) batchName = batch.batchName;
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
        const batch = batchService.getBatchByCode(target.batchCode);
        if (batch && batch.enrolledSeats > 0) {
          batchService.updateBatch(batch.id, {
            enrolledSeats: batch.enrolledSeats - 1,
          });
        }
      }
      triggerAdmissionEvent();
    }
    return true;
  },

  getStats: function () {
    const admissions = this.getAdmissions();
    const courses = courseService.getCourses();
    const batches = batchService.getBatches();

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
        (b) => b.status === "Ongoing" || b.status === "Upcoming"
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

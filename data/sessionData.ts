import { AcademicSession, AcademicSessionMetrics } from "@/types/session";
import { Batch } from "@/types/batch";

export const initialAcademicSessions: AcademicSession[] = [
  {
    id: 1,
    name: "2026-2027",
    code: "SESS-2026-27",
    start_date: "2026-04-01",
    end_date: "2027-03-31",
    is_current: true,
    status: 2, // 2 = Active/Ongoing
    description: "Primary ongoing academic cycle for NLETA Skill India Mission technician, engineer and operator qualification programs.",
    created_by: 1,
    created_at: "2026-01-15T10:00:00.000Z",
    updated_at: "2026-03-25T10:00:00.000Z",
    runningBatchesCount: 6,
    totalEnrolledStudents: 132,
    totalCapacitySeats: 165,
    // Backwards-compatible aliases
    sessionCode: "SESS-2026-27",
    sessionName: "Academic Session 2026-2027",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    isCurrent: true,
  },
  {
    id: 2,
    name: "2025-2026",
    code: "SESS-2025-26",
    start_date: "2025-04-01",
    end_date: "2026-03-31",
    is_current: false,
    status: 3, // 3 = Completed
    description: "Concluded annual training cycle. All candidate assessments, skill qualification packs, and certification verifications finalized.",
    created_by: 1,
    created_at: "2025-01-10T10:00:00.000Z",
    updated_at: "2026-03-31T18:00:00.000Z",
    runningBatchesCount: 8,
    totalEnrolledStudents: 195,
    totalCapacitySeats: 210,
    // Backwards-compatible aliases
    sessionCode: "SESS-2025-26",
    sessionName: "Academic Session 2025-2026",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    isCurrent: false,
  },
  {
    id: 3,
    name: "2027-2028",
    code: "SESS-2027-28",
    start_date: "2027-04-01",
    end_date: "2028-03-31",
    is_current: false,
    status: 1, // 1 = Upcoming
    description: "Upcoming academic cycle. Advance batch scheduling, curriculum upgrades, and early inquiry reservations.",
    created_by: 1,
    created_at: "2026-03-01T10:00:00.000Z",
    updated_at: "2026-03-25T10:00:00.000Z",
    runningBatchesCount: 2,
    totalEnrolledStudents: 0,
    totalCapacitySeats: 60,
    // Backwards-compatible aliases
    sessionCode: "SESS-2027-28",
    sessionName: "Academic Session 2027-2028",
    startDate: "2027-04-01",
    endDate: "2028-03-31",
    isCurrent: false,
  },
];

// Backwards compatibility alias
export const initialSessions = initialAcademicSessions;

/**
 * Calculate metrics helper for Academic Sessions
 */
export function calculateAcademicSessionMetrics(
  sessions: AcademicSession[],
  batches: Batch[]
): AcademicSessionMetrics {
  const totalAcademicSessions = sessions.length;
  const currentSession = sessions.find((s) => s.is_current || s.isCurrent) || sessions[0];

  const activeSessionName = currentSession
    ? (currentSession.name.includes("Session") ? currentSession.name : `Academic Session ${currentSession.name}`)
    : "Academic Session 2026-2027";
  const activeSessionCode = currentSession?.code || currentSession?.sessionCode || "SESS-2026-27";

  // Compute batches running under the current active session
  const currentBatches = batches.filter(
    (b) =>
      !b.academicSessionCode ||
      b.academicSessionCode === activeSessionCode ||
      b.academicSessionCode === "AS-2026-27" ||
      (b.startDate && b.startDate.startsWith("2026"))
  );

  const totalRunningBatches = currentBatches.length;
  const totalEnrolledStudents = currentBatches.reduce(
    (sum, b) => sum + (b.enrolledSeats || 0),
    0
  );
  const overallCapacitySeats = currentBatches.reduce(
    (sum, b) => sum + (b.maxSeats || 0),
    0
  );

  const occupancyPercentage =
    overallCapacitySeats > 0
      ? Math.round((totalEnrolledStudents / overallCapacitySeats) * 100)
      : 0;

  const upcomingSessionsCount = sessions.filter(
    (s) => s.status === 1 || String(s.status) === "Upcoming"
  ).length;

  return {
    totalAcademicSessions,
    activeSessionName,
    activeSessionCode,
    totalRunningBatches,
    totalEnrolledStudents,
    overallCapacitySeats,
    occupancyPercentage,
    upcomingSessionsCount,
  };
}

export const calculateSessionMetrics = calculateAcademicSessionMetrics;

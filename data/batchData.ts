import { Batch } from "@/types/batch";

/**
 * Batches referenced directly from:
 * C:\xampp\htdocs\prateek-work\courses-and-batches.txt (NLETA SKILL INDIA MISSION)
 * - Lift Operator
 * - NI Tech.
 * - NI Engg.
 * - EI Tech.
 * - Ei Engg.
 * - Sales Engg.
 */
const rawBatches = [
  // 1. Lift Operator
  {
    id: "bat-lo-01",
    batchCode: "BAT-2026-LO01",
    batchName: "Lift Operator & Safety Cohort",
    courseCodes: ["CRS-NLETA-LO01", "CRS-SAF-3.1.1"],
    courseCode: "CRS-NLETA-LO01",
    courseNames: [
      "Lift Operator & Safe Attendant Qualification",
      "Safety Rules & Fundamental Standards in Lift Operations",
    ],
    courseName: "Lift Operator & Safe Attendant Qualification",
    academicSessionCode: "AS-2026-27",
    academicSessionName: "Academic Session 2026-2027",
    trainerName: "Vikram Kapoor",
    startDate: "2026-04-10",
    endDate: "2026-07-10",
    scheduleTiming: "09:30 AM - 12:30 PM (Mon - Fri)",
    mode: "Offline (Classroom)",
    maxSeats: 30,
    enrolledSeats: 28,
    classroomLocation: "Lift Safety Simulator Room 101",
    status: "Ongoing",
    createdAt: "2026-03-01T14:00:00.000Z",
    updatedAt: "2026-03-22T14:00:00.000Z",
  },

  // 2. NI Tech.
  {
    id: "bat-nit-01",
    batchCode: "BAT-2026-NIT01",
    batchName: "NI Tech. Installation Cohort",
    courseCodes: ["CRS-NLETA-NIT02", "CRS-SAF-3.1.2"],
    courseCode: "CRS-NLETA-NIT02",
    courseNames: [
      "Training for New Installations (NI) - Technician",
      "Safe Working in Elevator Shaft Pit, Top of Car & Machine Room",
    ],
    courseName: "Training for New Installations (NI) - Technician",
    academicSessionCode: "AS-2026-27",
    academicSessionName: "Academic Session 2026-2027",
    trainerName: "Er. Amit Verma",
    startDate: "2026-04-01",
    endDate: "2026-09-30",
    scheduleTiming: "09:00 AM - 01:00 PM (Mon - Fri)",
    mode: "Offline (Classroom)",
    maxSeats: 30,
    enrolledSeats: 24,
    classroomLocation: "Mechanical Shaft Bay 1 & Rigging Lab",
    status: "Ongoing",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-03-15T09:00:00.000Z",
  },

  // 3. NI Engg.
  {
    id: "bat-nie-01",
    batchCode: "BAT-2026-NIE01",
    batchName: "NI Engg. Advanced Cohort",
    courseCodes: ["CRS-NLETA-NIE03", "CRS-SAF-3.1.7"],
    courseCode: "CRS-NLETA-NIE03",
    courseNames: [
      "Training for New Installations (NI) - Engineer",
      "Electrical Safety & Control Circuit Testing in Elevators",
    ],
    courseName: "Training for New Installations (NI) - Engineer",
    academicSessionCode: "AS-2026-27",
    academicSessionName: "Academic Session 2026-2027",
    trainerName: "Prof. Rajesh Sharma",
    startDate: "2026-04-15",
    endDate: "2026-10-15",
    scheduleTiming: "02:00 PM - 06:00 PM (Mon - Fri)",
    mode: "Hybrid",
    maxSeats: 25,
    enrolledSeats: 20,
    classroomLocation: "PLC Automation & Controller Bay 302",
    status: "Ongoing",
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-03-16T10:00:00.000Z",
  },

  // 4. EI Tech.
  {
    id: "bat-eit-01",
    batchCode: "BAT-2026-EIT01",
    batchName: "EI Tech. Maintenance Cohort",
    courseCodes: ["CRS-NLETA-EIT04", "CRS-SAF-3.1.5"],
    courseCode: "CRS-NLETA-EIT04",
    courseNames: [
      "Training for Existing Installations (EI) - Maintenance Technician",
      "Lockout-Tagout (LOTO) & Electrical Isolation Protocol",
    ],
    courseName: "Training for Existing Installations (EI) - Maintenance Technician",
    academicSessionCode: "AS-2026-27",
    academicSessionName: "Academic Session 2026-2027",
    trainerName: "Er. Amit Verma",
    startDate: "2026-05-01",
    endDate: "2026-09-30",
    scheduleTiming: "09:00 AM - 01:00 PM (Mon - Fri)",
    mode: "Offline (Classroom)",
    maxSeats: 25,
    enrolledSeats: 18,
    classroomLocation: "Live Lift Shaft & Pit Simulator A",
    status: "Upcoming",
    createdAt: "2026-02-20T11:00:00.000Z",
    updatedAt: "2026-03-18T11:00:00.000Z",
  },

  // 5. Ei Engg.
  {
    id: "bat-eie-01",
    batchCode: "BAT-2026-EIE01",
    batchName: "Ei Engg. Diagnostics Cohort",
    courseCodes: ["CRS-NLETA-EIE05", "CRS-SAF-3.1.6"],
    courseCode: "CRS-NLETA-EIE05",
    courseNames: [
      "Training for Existing Installations (EI) - Service Engineer",
      "Passenger Rescue & Emergency Evacuation Operations",
    ],
    courseName: "Training for Existing Installations (EI) - Service Engineer",
    academicSessionCode: "AS-2026-27",
    academicSessionName: "Academic Session 2026-2027",
    trainerName: "Prof. Suresh Nair",
    startDate: "2026-05-15",
    endDate: "2026-11-15",
    scheduleTiming: "02:00 PM - 06:00 PM (Mon - Fri)",
    mode: "Hybrid",
    maxSeats: 20,
    enrolledSeats: 12,
    classroomLocation: "Electrical Diagnostics & CBM Lab 201",
    status: "Upcoming",
    createdAt: "2026-02-25T12:00:00.000Z",
    updatedAt: "2026-03-20T12:00:00.000Z",
  },

  // 6. Sales Engg.
  {
    id: "bat-sls-01",
    batchCode: "BAT-2026-SLS01",
    batchName: "Sales Engg. Weekend Cohort",
    courseCodes: ["CRS-NLETA-SLS06", "CRS-NLETA-OVW01"],
    courseCode: "CRS-NLETA-SLS06",
    courseNames: [
      "Elevator Technical Sales & Application Engineer",
      "Indian Elevator Industry Overview & Market Dynamics",
    ],
    courseName: "Elevator Technical Sales & Application Engineer",
    academicSessionCode: "AS-2026-27",
    academicSessionName: "Academic Session 2026-2027",
    trainerName: "Dr. Ananya Mukherjee",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    scheduleTiming: "10:00 AM - 04:00 PM (Sat - Sun)",
    mode: "Online (Live)",
    maxSeats: 35,
    enrolledSeats: 30,
    classroomLocation: "Executive Virtual Auditorium (Zoom Pro)",
    status: "Upcoming",
    createdAt: "2026-03-05T09:00:00.000Z",
    updatedAt: "2026-03-24T09:00:00.000Z",
  },
];

export const initialBatches: Batch[] = rawBatches.map((b: any) => ({
  ...b,
  name: b.batchName,
  code: b.batchCode,
  capacity: b.maxSeats,
  start_date: b.startDate,
  end_date: b.endDate,
  timing: b.scheduleTiming,
  status: b.status || "Upcoming",
}));


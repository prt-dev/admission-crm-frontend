"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Admission, AdmissionStatus, PaymentStatus } from "@/types/admission";
import { Course } from "@/types/course";
import { Batch } from "@/types/batch";
import { admissionService } from "@/services/admissionService";
import { courseService } from "@/services/courseService";
import { batchService } from "@/services/batchService";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import RegistrationSection from "./RegistrationSection";
import PersonalDetailsSection from "./PersonalDetailsSection";
import AcademicAllocationSection from "./AcademicAllocationSection";
import FeeDetailsSection from "./FeeDetailsSection";

interface AdmissionFormProps {
  admissionToEdit?: Admission | null;
  onSuccess?: (admission: Admission) => void;
}

export default function AdmissionForm({
  admissionToEdit,
  onSuccess,
}: AdmissionFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(admissionToEdit);

  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Form Fields
  const [studentId, setStudentId] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [qualification, setQualification] = useState<string>("BCA / B.Sc (IT/CS)");
  const [courseCode, setCourseCode] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [skillIndiaRegId, setSkillIndiaRegId] = useState("");

  const [admissionDate, setAdmissionDate] = useState("");
  const [status, setStatus] = useState<AdmissionStatus>("Active");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Paid");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [totalFee, setTotalFee] = useState<number>(0);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [guardianName, setGuardianName] = useState("");
  const [guardianMobile, setGuardianMobile] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([courseService.getCourses(), batchService.getBatches()]).then(
      ([availableCourses, availableBatches]) => {
        if (!isMounted) return;
        setCourses(availableCourses);
        setBatches(availableBatches);

        if (admissionToEdit) {
          setStudentId(admissionToEdit.studentId || "");
          setRegistrationId(admissionToEdit.registrationId || "");
          setStudentName(admissionToEdit.studentName || "");
          setMobile(admissionToEdit.mobile || "");
          setEmail(admissionToEdit.email || "");
          setAadhaar(admissionToEdit.aadhaar || "");
          setQualification(admissionToEdit.qualification || "BCA / B.Sc (IT/CS)");
          setCourseCode(admissionToEdit.courseCode || "");
          setBatchCode(admissionToEdit.batchCode || "");
          setSkillIndiaRegId(admissionToEdit.skillIndiaRegId || "");
          setAdmissionDate(admissionToEdit.admissionDate || new Date().toISOString().split("T")[0]);
          setStatus(admissionToEdit.status || "Active");
          setPaymentStatus(admissionToEdit.paymentStatus || "Paid");
          setAmountPaid(admissionToEdit.amountPaid || 0);
          setTotalFee(admissionToEdit.totalFee || 0);
          setGender(admissionToEdit.gender || "Male");
          setGuardianName(admissionToEdit.guardianName || "");
          setGuardianMobile(admissionToEdit.guardianMobile || "");
          setAddress(admissionToEdit.address || "");
          setNotes(admissionToEdit.notes || "");
        } else {
          const newStudentId = admissionService.generateNextStudentId();
          const newRegId = admissionService.generateNextRegistrationId();
          const newSkillId = admissionService.generateNextSkillIndiaId();
          const initialCourse = availableCourses[0]?.code || availableCourses[0]?.courseCode || "";
          const initialBatch = initialCourse ? admissionService.getAutoBatchForCourse(initialCourse) : "";
          const matchedCourse = availableCourses.find((c) => (c.code || c.courseCode) === initialCourse);

          setStudentId(newStudentId);
          setRegistrationId(newRegId);
          setStudentName("");
          setMobile("");
          setEmail("");
          setAadhaar("");
          setQualification("BCA / B.Sc (IT/CS)");
          setCourseCode(initialCourse);
          setBatchCode(initialBatch);
          setSkillIndiaRegId(newSkillId);
          setAdmissionDate(new Date().toISOString().split("T")[0]);
          setStatus("Active");
          setPaymentStatus("Paid");
          setTotalFee(matchedCourse?.fee !== undefined ? Number(matchedCourse.fee) : (matchedCourse?.totalFee || 45000));
          setAmountPaid(matchedCourse?.fee !== undefined ? Number(matchedCourse.fee) : (matchedCourse?.totalFee || 45000));
          setGender("Male");
          setGuardianName("");
          setGuardianMobile("");
          setAddress("");
          setNotes("");
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [admissionToEdit]);

  const handleCourseChange = (selectedCourseCode: string) => {
    setCourseCode(selectedCourseCode);
    const selectedCourse = courses.find((c) => (c.code || c.courseCode) === selectedCourseCode);
    if (selectedCourse) {
      const fee = selectedCourse.fee !== undefined ? Number(selectedCourse.fee) : (selectedCourse.totalFee || 0);
      setTotalFee(fee);
      if (!isEditMode) {
        setAmountPaid(fee);
      }
    }
    const autoBatch = admissionService.getAutoBatchForCourse(selectedCourseCode);
    setBatchCode(autoBatch);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!registrationId.trim()) newErrors.registrationId = "Registration ID is required";
    if (!studentName.trim()) newErrors.studentName = "Student full name is required";

    const cleanMobile = mobile.replace(/\D/g, "");
    if (!cleanMobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (cleanMobile.length < 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const cleanAadhaar = aadhaar.replace(/\D/g, "");
    if (!cleanAadhaar) {
      newErrors.aadhaar = "Aadhaar number is mandatory";
    } else if (cleanAadhaar.length !== 12) {
      newErrors.aadhaar = "Aadhaar must be 12 digits";
    }

    if (!qualification.trim()) newErrors.qualification = "Qualification is required";
    if (!courseCode.trim()) newErrors.courseCode = "Course selection is mandatory";
    if (!batchCode.trim()) newErrors.batchCode = "Batch allocation is mandatory";
    if (!skillIndiaRegId.trim()) newErrors.skillIndiaRegId = "Skill India Reg. ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmedSave = () => {
    setIsSubmitting(true);
    try {
      const selectedCourse = courses.find((c) => c.courseCode === courseCode);
      const selectedBatch = batches.find((b) => b.batchCode === batchCode);

      if (isEditMode && admissionToEdit) {
        const updated = admissionService.updateAdmission(admissionToEdit.id, {
          studentId,
          registrationId,
          studentName,
          mobile,
          email,
          aadhaar,
          qualification,
          courseCode,
          courseName: selectedCourse?.courseName || admissionToEdit.courseName,
          batchCode,
          batchName: selectedBatch?.batchName || admissionToEdit.batchName,
          skillIndiaRegId,
          admissionDate,
          status,
          paymentStatus,
          amountPaid: Number(amountPaid),
          totalFee: Number(totalFee),
          gender,
          guardianName,
          guardianMobile,
          address,
          notes,
        });
        if (updated) {
          setIsConfirmModalOpen(false);
          if (onSuccess) onSuccess(updated);
          router.push("/admissions");
        }
      } else {
        const created = admissionService.createAdmission({
          studentId,
          registrationId,
          studentName,
          mobile,
          email,
          aadhaar,
          qualification,
          courseCode,
          courseName: selectedCourse?.courseName,
          batchCode,
          batchName: selectedBatch?.batchName,
          skillIndiaRegId,
          admissionDate: admissionDate || new Date().toISOString().split("T")[0],
          status,
          paymentStatus,
          amountPaid: Number(amountPaid),
          totalFee: Number(totalFee),
          gender,
          guardianName,
          guardianMobile,
          address,
          notes,
        });
        setIsConfirmModalOpen(false);
        if (onSuccess) onSuccess(created);
        router.push("/admissions");
      }
    } catch (err) {
      console.error("Failed to save admission:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-5xl">
        {/* 1. Registration Section */}
        <RegistrationSection
          studentId={studentId}
          registrationId={registrationId}
          skillIndiaRegId={skillIndiaRegId}
          onRegistrationIdChange={setRegistrationId}
          onSkillIndiaRegIdChange={setSkillIndiaRegId}
          errors={errors}
        />

        {/* 2. Personal Details Section */}
        <PersonalDetailsSection
          studentName={studentName}
          mobile={mobile}
          email={email}
          aadhaar={aadhaar}
          qualification={qualification}
          gender={gender}
          guardianName={guardianName}
          guardianMobile={guardianMobile}
          address={address}
          onStudentNameChange={setStudentName}
          onMobileChange={setMobile}
          onEmailChange={setEmail}
          onAadhaarChange={setAadhaar}
          onQualificationChange={setQualification}
          onGenderChange={setGender}
          onGuardianNameChange={setGuardianName}
          onGuardianMobileChange={setGuardianMobile}
          onAddressChange={setAddress}
          errors={errors}
        />

        {/* 3. Academic & Batch Allocation Section */}
        <AcademicAllocationSection
          courses={courses}
          batches={batches}
          courseCode={courseCode}
          batchCode={batchCode}
          onCourseChange={handleCourseChange}
          onBatchChange={setBatchCode}
          errors={errors}
        />

        {/* 4. Fee & Status Section */}
        <FeeDetailsSection
          admissionDate={admissionDate}
          status={status}
          paymentStatus={paymentStatus}
          totalFee={totalFee}
          amountPaid={amountPaid}
          notes={notes}
          onAdmissionDateChange={setAdmissionDate}
          onStatusChange={setStatus}
          onPaymentStatusChange={setPaymentStatus}
          onTotalFeeChange={setTotalFee}
          onAmountPaidChange={setAmountPaid}
          onNotesChange={setNotes}
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admissions")}
            disabled={isSubmitting}
          >
            Cancel & Return
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              }
            >
              {isEditMode ? "Save Changes" : "Submit & Register Student"}
            </Button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal on Save */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={isEditMode ? "Save Admission Updates?" : "Confirm Student Admission"}
        message={
          isEditMode
            ? `Are you sure you want to update details for student "${studentName}" (${studentId})?`
            : `Are you sure you want to finalize admission for candidate "${studentName}" (Aadhaar: ${aadhaar}) in Course ${courseCode} and Batch ${batchCode}?`
        }
        confirmLabel={isEditMode ? "Yes, Save Changes" : "Yes, Confirm Admission"}
        cancelLabel="Review Again"
        variant="primary"
        isLoading={isSubmitting}
        onConfirm={handleConfirmedSave}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
}

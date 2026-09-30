"use client";

import React from "react";
import { QualificationType } from "@/types/admission";

const QUALIFICATIONS: QualificationType[] = [
  "10th Pass",
  "12th Pass (Science)",
  "12th Pass (Commerce)",
  "12th Pass (Arts)",
  "Diploma (Polytechnic)",
  "B.Tech / B.E.",
  "BCA / B.Sc (IT/CS)",
  "B.Com / BBA",
  "B.A.",
  "MCA / M.Tech / M.Sc",
  "Post Graduate",
  "Other",
];

interface PersonalDetailsSectionProps {
  studentName: string;
  mobile: string;
  email: string;
  aadhaar: string;
  qualification: string;
  gender: "Male" | "Female" | "Other";
  guardianName?: string;
  guardianMobile?: string;
  address?: string;
  onStudentNameChange: (val: string) => void;
  onMobileChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onAadhaarChange: (val: string) => void;
  onQualificationChange: (val: string) => void;
  onGenderChange: (val: "Male" | "Female" | "Other") => void;
  onGuardianNameChange: (val: string) => void;
  onGuardianMobileChange: (val: string) => void;
  onAddressChange: (val: string) => void;
  errors?: Record<string, string>;
}

export default function PersonalDetailsSection({
  studentName,
  mobile,
  email,
  aadhaar,
  qualification,
  gender,
  guardianName = "",
  guardianMobile = "",
  address = "",
  onStudentNameChange,
  onMobileChange,
  onEmailChange,
  onAadhaarChange,
  onQualificationChange,
  onGenderChange,
  onGuardianNameChange,
  onGuardianMobileChange,
  onAddressChange,
  errors = {},
}: PersonalDetailsSectionProps) {
  const handleAadhaarFormat = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    onAadhaarChange(formatted);
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          2
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Candidate Personal Profile & KYC
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Aadhaar verification details, contact information, and educational qualifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Student Name (Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Student Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => onStudentNameChange(e.target.value)}
            placeholder="Legal name as stated on Aadhaar card"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.studentName ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.studentName && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.studentName}</p>
          )}
        </div>

        {/* Mobile (Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-medium text-gray-400">+91</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => onMobileChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className={`w-full rounded-xl border pl-12 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                errors.mobile ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
              }`}
            />
          </div>
          {errors.mobile && <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>}
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="student@example.com"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.email ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
        </div>

        {/* Aadhaar (Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Aadhaar Number (12 Digits) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={aadhaar}
            onChange={(e) => handleAadhaarFormat(e.target.value)}
            placeholder="XXXX XXXX XXXX"
            className={`w-full rounded-xl border font-mono px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.aadhaar ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          />
          {errors.aadhaar && <p className="text-[11px] text-rose-500 mt-1">{errors.aadhaar}</p>}
        </div>

        {/* Qualification (Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Highest Qualification <span className="text-rose-500">*</span>
          </label>
          <select
            value={qualification}
            onChange={(e) => onQualificationChange(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.qualification ? "border-rose-400" : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {QUALIFICATIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          {errors.qualification && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.qualification}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => onGenderChange(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Guardian Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Parent / Guardian Name
          </label>
          <input
            type="text"
            value={guardianName}
            onChange={(e) => onGuardianNameChange(e.target.value)}
            placeholder="Father / Mother / Guardian"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* Guardian Mobile */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Guardian Contact Number
          </label>
          <input
            type="tel"
            value={guardianMobile}
            onChange={(e) => onGuardianMobileChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Emergency contact"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Permanent Address / Residential City
        </label>
        <textarea
          rows={2}
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="House/Street, Locality, City, State, PIN Code"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
        />
      </div>
    </div>
  );
}

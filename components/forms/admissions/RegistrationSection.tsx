"use client";

import React from "react";

interface RegistrationSectionProps {
  studentId: string;
  registrationId: string;
  skillIndiaRegId: string;
  onRegistrationIdChange: (val: string) => void;
  onSkillIndiaRegIdChange: (val: string) => void;
  errors?: Record<string, string>;
}

export default function RegistrationSection({
  studentId,
  registrationId,
  skillIndiaRegId,
  onRegistrationIdChange,
  onSkillIndiaRegIdChange,
  errors = {},
}: RegistrationSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          1
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Registration & Official Identifiers
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            System generated identifier and Skill India Portal registration credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Student ID (Auto - Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Student ID <span className="text-brand-600 font-bold">(Auto)</span> <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={studentId}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-100 dark:bg-gray-800/80 px-3.5 py-2.5 text-xs font-mono font-bold text-brand-700 dark:text-brand-300 cursor-not-allowed focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-[10px] uppercase font-bold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded">
              Auto Generated
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Unique student record key</p>
        </div>

        {/* Registration ID (Text - Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Registration ID <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={registrationId}
            onChange={(e) => onRegistrationIdChange(e.target.value)}
            placeholder="e.g. REG-2026-7890"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.registrationId
                ? "border-rose-400 focus:border-rose-500"
                : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
            }`}
          />
          {errors.registrationId ? (
            <p className="text-[11px] text-rose-500 mt-1">{errors.registrationId}</p>
          ) : (
            <p className="text-[10px] text-gray-400 mt-1">Institutional registration roll</p>
          )}
        </div>

        {/* Skill India Reg. ID (Text - Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Skill India Reg. ID <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={skillIndiaRegId}
            onChange={(e) => onSkillIndiaRegIdChange(e.target.value)}
            placeholder="e.g. SIP-IND-2026-4401"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.skillIndiaRegId
                ? "border-rose-400 focus:border-rose-500"
                : "border-gray-200 dark:border-gray-700 focus:border-brand-500"
            }`}
          />
          {errors.skillIndiaRegId ? (
            <p className="text-[11px] text-rose-500 mt-1">{errors.skillIndiaRegId}</p>
          ) : (
            <p className="text-[10px] text-gray-400 mt-1">National Skill Development Portal ID</p>
          )}
        </div>
      </div>
    </div>
  );
}

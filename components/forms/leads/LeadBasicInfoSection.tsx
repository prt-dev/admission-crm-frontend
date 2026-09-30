"use client";

import React from "react";
import { LeadStatus } from "@/types/lead";

const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Follow-up",
  "Qualified",
  "Converted",
  "Closed",
];

const LEAD_SOURCES = [
  "Website Inquiry",
  "Walk-in",
  "Phone Call",
  "Direct Referral",
  "Social Media",
  "Google Ads",
  "Email Campaign",
  "Education Fair",
  "Other",
];

interface LeadBasicInfoSectionProps {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source?: string;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onStatusChange: (val: LeadStatus) => void;
  onSourceChange: (val: string) => void;
  errors?: Record<string, string>;
}

export default function LeadBasicInfoSection({
  name,
  email,
  phone,
  status,
  source = "Website Inquiry",
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onStatusChange,
  onSourceChange,
  errors = {},
}: LeadBasicInfoSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          1
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Lead Contact Information
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Primary applicant name, phone number, email address, and lead pipeline status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Rohan Sharma"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="e.g. 9876543210 (10 digits)"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 transition-all ${
              errors.phone
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-[11px] text-rose-500">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="e.g. rohan.sharma@example.com"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-rose-400 focus:ring-rose-500/20"
                : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-rose-500">{errors.email}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Pipeline Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          >
            {LEAD_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Source */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Lead Source
          </label>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          >
            {LEAD_SOURCES.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

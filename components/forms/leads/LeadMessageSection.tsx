"use client";

import React from "react";

interface LeadMessageSectionProps {
  message: string;
  onMessageChange: (val: string) => void;
  errors?: Record<string, string>;
}

export default function LeadMessageSection({
  message,
  onMessageChange,
  errors = {},
}: LeadMessageSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          2
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Inquiry & Message
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Student or applicant inquiry message, requirements, or discussion remarks.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Inquiry Message / Notes <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="e.g. Inquiring about Full Stack Web Development weekend batches, course fees, and placement opportunities..."
          className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 transition-all ${
            errors.message
              ? "border-rose-400 focus:ring-rose-500/20"
              : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20"
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-[11px] text-rose-500">{errors.message}</p>
        )}
      </div>
    </div>
  );
}

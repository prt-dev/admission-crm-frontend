"use client";

import React from "react";
import { AdmissionStatus, PaymentStatus } from "@/types/admission";

interface FeeDetailsSectionProps {
  admissionDate: string;
  status: AdmissionStatus;
  paymentStatus: PaymentStatus;
  totalFee: number;
  amountPaid: number;
  notes?: string;
  onAdmissionDateChange: (val: string) => void;
  onStatusChange: (val: AdmissionStatus) => void;
  onPaymentStatusChange: (val: PaymentStatus) => void;
  onTotalFeeChange: (val: number) => void;
  onAmountPaidChange: (val: number) => void;
  onNotesChange: (val: string) => void;
}

export default function FeeDetailsSection({
  admissionDate,
  status,
  paymentStatus,
  totalFee,
  amountPaid,
  notes = "",
  onAdmissionDateChange,
  onStatusChange,
  onPaymentStatusChange,
  onTotalFeeChange,
  onAmountPaidChange,
  onNotesChange,
}: FeeDetailsSectionProps) {
  const balanceDue = (totalFee || 0) - (amountPaid || 0);

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          4
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Admission Status, Fees & Remarks
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Fee payments, KYC review approval, and verification notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {/* Admission Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Admission Date
          </label>
          <input
            type="date"
            value={admissionDate}
            onChange={(e) => onAdmissionDateChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* Admission Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Admission Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Certified">Certified</option>
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value as any)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          >
            <option value="Paid">Paid (Full)</option>
            <option value="Partial">Partial Payment</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Total Fee */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Total Program Fee (₹)
          </label>
          <input
            type="number"
            value={totalFee}
            onChange={(e) => onTotalFeeChange(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Amount Paid & Balance preview */}
        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Amount Received (₹)
            </label>
            <span
              className={`text-xs font-bold ${
                balanceDue > 0 ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              Balance: ₹{balanceDue.toLocaleString()}
            </span>
          </div>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => onAmountPaidChange(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* Remarks / Verification Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Verification Remarks & Internal Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Aadhaar KYC verified, fee cheque clearance notes, batch timing preferences..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

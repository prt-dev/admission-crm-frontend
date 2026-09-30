"use client";

import React from "react";
import { StudentFeeBreakdownProps } from "@/types/student";

export default function StudentFeeBreakdown({ admission }: StudentFeeBreakdownProps) {
  const balanceDue = (admission.totalFee || 0) - (admission.amountPaid || 0);

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Fee Structure & Receipts
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Payment records, installments, and receipts for admission ID {admission.studentId}.
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
            admission.paymentStatus === "Paid"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200"
          }`}
        >
          {admission.paymentStatus === "Paid" ? "All Dues Cleared" : `${admission.paymentStatus} Payment`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Program Fee */}
        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Total Program Fee</p>
          <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
            ₹{(admission.totalFee || 0).toLocaleString()}
          </p>
        </div>

        {/* Amount Paid */}
        <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/20">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Amount Paid (Received)</p>
          <p className="text-base font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            ₹{(admission.amountPaid || 0).toLocaleString()}
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Outstanding Balance</p>
          <p
            className={`text-base font-bold mt-1 ${
              balanceDue > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {balanceDue > 0 ? `₹${balanceDue.toLocaleString()}` : "₹0 (Cleared)"}
          </p>
        </div>
      </div>

      {/* Transaction History / Receipts */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
          Payment Transactions & Invoice Receipts
        </h4>
        <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 text-xs gap-2">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                Admission Fee & Tuition Installment #01
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Paid on {admission.admissionDate || "2026-03-15"} • UPI / Bank Transfer Reference #NLETA-TXN-9842
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                +₹{(admission.amountPaid || 0).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
              >
                Download Receipt 📄
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

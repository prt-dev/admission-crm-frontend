"use client";

import React, { useState } from "react";
import { Admission, AdmissionStatus } from "@/types/admission";
import { admissionService } from "@/services/admissionService";
import Button from "@/components/ui/Button";

interface AdmissionDetailDrawerProps {
  admission: Admission | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (admission: Admission) => void;
  onDelete: (admission: Admission) => void;
  onUpdated: (admission: Admission) => void;
}

export default function AdmissionDetailDrawer({
  admission,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdated,
}: AdmissionDetailDrawerProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  if (!isOpen || !admission) return null;

  const handleStatusChange = (newStatus: AdmissionStatus) => {
    setIsUpdatingStatus(true);
    const updated = admissionService.updateAdmission(admission.id, { status: newStatus });
    if (updated) {
      onUpdated(updated);
    }
    setIsUpdatingStatus(false);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Pending Verification":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const balanceDue = (admission.totalFee || 0) - (admission.amountPaid || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-lg shadow-md shadow-brand-500/20">
                {admission.studentName.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {admission.studentName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                    {admission.studentId}
                  </span>
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      admission.status
                    )}`}
                  >
                    {admission.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Summary Card */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gradient-to-br from-brand-50/60 to-brand-100/30 dark:from-brand-950/40 dark:to-brand-900/10 border border-brand-200/50 dark:border-brand-800/40">
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Registration ID</p>
                <p className="text-xs font-bold font-mono text-gray-900 dark:text-white mt-0.5">
                  {admission.registrationId}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Skill India Reg. ID</p>
                <p className="text-xs font-bold font-mono text-brand-700 dark:text-brand-300 mt-0.5">
                  {admission.skillIndiaRegId}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Course Code</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {admission.courseCode}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Assigned Batch</p>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                  {admission.batchCode}
                </p>
              </div>
            </div>

            {/* Candidate Credentials */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Candidate Profile & KYC
              </h4>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40 px-4">
                <div className="py-2.5 flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Mobile Phone</span>
                  <span className="font-semibold text-gray-900 dark:text-white font-mono">
                    +91 {admission.mobile}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Email Address</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {admission.email || <span className="text-gray-400 italic">Not Provided</span>}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Aadhaar UID</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {admission.aadhaar}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Qualification</span>
                  <span className="font-semibold text-brand-600 dark:text-brand-400">
                    {admission.qualification}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Admission Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {admission.admissionDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic & Batch Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Course & Batch Details
              </h4>
              <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {admission.courseCode}
                    </span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                      {admission.courseName || "Full Stack Web Development"}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Batch Code:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {admission.batchCode}
                  </span>
                </div>
                {admission.batchName && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Batch Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {admission.batchName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Fee & Payment Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Fee & Payment Status
              </h4>
              <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total Course Fee</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    ₹{admission.totalFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Amount Paid</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{admission.amountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Balance Due</span>
                  <span
                    className={`text-xs font-bold ${
                      balanceDue > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {balanceDue > 0 ? `₹${balanceDue.toLocaleString()}` : "Fully Cleared"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Changer */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Update Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(["Confirmed", "Pending Verification", "Under Review", "Completed", "Cancelled"] as AdmissionStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                        admission.status === st
                          ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Notes */}
            {admission.notes && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Remarks / Verification Log
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  {admission.notes}
                </p>
              </div>
            )}
          </div>

          {/* Drawer Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete(admission)}
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Delete
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                }
              >
                Print Receipt
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onEdit(admission)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                Edit Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

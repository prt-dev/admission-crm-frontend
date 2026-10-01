"use client";

import React, { useState, useEffect } from "react";
import {
  AcademicSession,
  AcademicSessionStatus,
  AcademicSessionModalProps,
  ACADEMIC_SESSION_STATUS,
} from "@/types/session";

export default function AcademicSessionModal({
  isOpen,
  onClose,
  onSaveSession,
  initialSession,
}: AcademicSessionModalProps) {
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const [status, setStatus] = useState<AcademicSessionStatus>(ACADEMIC_SESSION_STATUS.ACTIVE);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (initialSession) {
      setName(initialSession.name || initialSession.sessionName || "");
      setCode(initialSession.code || initialSession.sessionCode || "");
      setStartDate(initialSession.start_date || initialSession.startDate || "");
      setEndDate(initialSession.end_date || initialSession.endDate || "");
      setIsCurrent(Boolean(initialSession.is_current ?? initialSession.isCurrent));
      setStatus(
        initialSession.status !== undefined
          ? (Number(initialSession.status) as AcademicSessionStatus)
          : ACADEMIC_SESSION_STATUS.ACTIVE
      );
      setDescription(initialSession.description || "");
    } else {
      const currentYear = new Date().getFullYear();
      setName(`${currentYear}-${currentYear + 1}`);
      setCode(`SESS-${currentYear}-${(currentYear + 1).toString().slice(2)}`);
      setStartDate(`${currentYear}-04-01`);
      setEndDate(`${currentYear + 1}-03-31`);
      setIsCurrent(false);
      setStatus(ACADEMIC_SESSION_STATUS.UPCOMING);
      setDescription("");
    }
  }, [initialSession, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<AcademicSession> = {
      id: initialSession?.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      start_date: startDate,
      end_date: endDate,
      is_current: isCurrent,
      status: Number(status) as AcademicSessionStatus,
      description: description.trim() || null,
      // Synced aliases
      sessionName: name.trim(),
      sessionCode: code.trim().toUpperCase(),
      startDate,
      endDate,
      isCurrent,
    };

    onSaveSession(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                🎓
              </span>
              {initialSession ? "Edit Academic Session" : "Create Academic Session"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Institutional academic year & cycle configuration (Laravel table: <code className="font-mono text-[10px] text-brand-600">academic_sessions</code>)
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Session Name (<code className="text-brand-600 font-mono">name</code>) *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. 2026-2027 or Session 2026"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Session Code (<code className="text-brand-600 font-mono">code</code> - Unique) *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="e.g. SESS-2026-27"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Status (<code className="text-brand-600 font-mono">status</code>) *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value) as AcademicSessionStatus)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={ACADEMIC_SESSION_STATUS.ACTIVE}>2 - Active / Ongoing</option>
                <option value={ACADEMIC_SESSION_STATUS.UPCOMING}>1 - Upcoming (Planning)</option>
                <option value={ACADEMIC_SESSION_STATUS.COMPLETED}>3 - Completed / Concluded</option>
                <option value={ACADEMIC_SESSION_STATUS.ARCHIVED}>4 - Archived / Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Start Date (<code className="text-brand-600 font-mono">start_date</code>) *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                End Date (<code className="text-brand-600 font-mono">end_date</code>) *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Current Session Toggle */}
          <div className="rounded-2xl border border-brand-200/60 bg-brand-50/40 p-4 dark:border-brand-900/40 dark:bg-brand-950/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded-sm border-gray-300 text-brand-600 focus:ring-brand-500 mt-0.5 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Set as Active Current Academic Session (<code className="text-brand-600 font-mono text-[11px]">is_current: true</code>)
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  New student admissions, cohort schedules, and training batches will automatically align to this session.
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description / Objectives (<code className="text-brand-600 font-mono">description</code> - Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Annual academic cycle for NLETA technician, engineer and operator qualification programs."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs font-medium text-gray-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {initialSession ? "Save Changes" : "Create Academic Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

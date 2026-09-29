"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface WelcomeBannerProps {
  pendingVerificationsCount?: number;
  sessionTitle?: string;
}

export default function WelcomeBanner({
  pendingVerificationsCount = 18,
  sessionTitle = "Academic Session 2026-2027",
}: WelcomeBannerProps) {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 p-6 sm:p-8 text-white shadow-lg">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            ✨ {sessionTitle}
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.fullName || user?.username || "Administrator"}!
          </h1>
          <p className="mt-1 text-sm text-brand-100 max-w-xl">
            Here is your admission CRM operations overview for today. You have{" "}
            <strong className="text-white">{pendingVerificationsCount} pending candidate verifications</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-brand-600 shadow hover:bg-brand-50 transition-colors"
          >
            <span>View All Applications</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Decorative background glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-12 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />
    </div>
  );
}

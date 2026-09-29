"use client";

import React from "react";
import ThemeToggle from "@/components/header/ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
}

export default function Header({
  onToggleMobileSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95 sm:px-6">
      {/* Left side: Sidebar toggles & search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-lg">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden cursor-pointer"
          aria-label="Open mobile menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleSidebarCollapse}
          className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`h-5 w-5 transition-transform ${isSidebarCollapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Search bar */}
        <div className="relative w-full max-w-xs sm:max-w-sm hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search leads, students, courses..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-12 text-xs text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-gray-900"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-2 hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-800 md:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Quick actions, notifications, theme toggle, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Application Button */}
        <button
          type="button"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Lead</span>
        </button>

        {/* Theme switch */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

        {/* User menu */}
        <UserDropdown />
      </div>
    </header>
  );
}

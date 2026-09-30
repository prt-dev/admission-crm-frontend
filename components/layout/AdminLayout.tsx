"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { APP_CONFIG } from "@/config/appConfig";

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutInner({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If viewing auth routes (signin / signup / login), protect them in guest mode (no auth pages open if logged in)
  const isAuthRoute =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname.startsWith("/signin?") ||
    pathname.startsWith("/signup?");

  if (isAuthRoute) {
    return (
      <AuthGuard mode="guest">
        <main className="min-h-screen w-full">{children}</main>
      </AuthGuard>
    );
  }

  // All CRM pages protected with auth mode (no crm pages open if not authenticated)
  return (
    <AuthGuard mode="auth">
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Responsive Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top Header */}
          <Header
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Dashboard Footer */}
          <footer className="border-t border-gray-200/60 bg-white/50 px-6 py-4 text-center text-xs text-gray-500 dark:border-gray-800/60 dark:bg-gray-900/50 dark:text-gray-400">
            <p>© {new Date().getFullYear()} {APP_CONFIG.name} — {APP_CONFIG.portalTitle}. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}

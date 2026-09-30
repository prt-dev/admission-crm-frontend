"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LogoSpinner from "@/components/loader/LogoSpinner";

export interface AuthGuardProps {
  children: React.ReactNode;
  /**
   * "auth" = requires authenticated user (for CRM pages). Redirects unauthenticated users to /signin.
   * "guest" = requires unauthenticated guest (for /signin, /signup). Redirects logged in users to / (or target redirect).
   */
  mode?: "auth" | "guest";
  allowedRoles?: string[];
}

export default function AuthGuard({
  children,
  mode = "auth",
  allowedRoles,
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (mode === "auth") {
      // Unauthenticated users cannot view CRM pages -> redirect to signin
      if (!isAuthenticated) {
        const currentPath = pathname || "/";
        const redirectUrl = `/signin?redirect=${encodeURIComponent(currentPath)}`;
        router.push(redirectUrl);
      }
    } else if (mode === "guest") {
      // Authenticated users cannot view login/register pages -> redirect to dashboard
      if (isAuthenticated) {
        const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const targetRedirect = searchParams?.get("redirect") || "/";
        router.push(targetRedirect);
      }
    }
  }, [isLoading, isAuthenticated, mode, pathname, router]);

  // 1. Initial loading state (verifying session storage)
  if (isLoading) {
    return (
      <LogoSpinner
        fullscreen
        label="Verifying Session..."
        sublabel="Connecting to secure workspace"
      />
    );
  }

  // 2. Auth mode: hide content while redirecting unauthenticated users
  if (mode === "auth" && !isAuthenticated) {
    return (
      <LogoSpinner
        fullscreen
        label="Access Restricted"
        sublabel="Redirecting to sign in..."
      />
    );
  }

  // 3. Guest mode: hide auth forms while redirecting authenticated users to dashboard
  if (mode === "guest" && isAuthenticated) {
    return (
      <LogoSpinner
        fullscreen
        label="Welcome Back"
        sublabel="Redirecting to dashboard..."
      />
    );
  }

  // 4. Role authorization check for auth mode
  if (mode === "auth" && allowedRoles && allowedRoles.length > 0 && user) {
    const hasRole = allowedRoles.includes(user.role);
    if (!hasRole) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 text-center">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-xl dark:border-red-800/80 dark:bg-gray-800 max-w-md">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Access Restricted</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your role (<strong>{user.role}</strong>) is not authorized to access this resource.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-600 cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}


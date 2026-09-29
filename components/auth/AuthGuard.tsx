"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LogoSpinner from "@/components/loader/LogoSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({
  children,
  allowedRoles,
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `/signin?redirect=${encodeURIComponent(pathname || "/dashboard")}`;
      router.push(redirectUrl);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return <LogoSpinner fullscreen label="Checking Authorization..." sublabel="Securing session" />;
  }

  if (!isAuthenticated) {
    return <LogoSpinner fullscreen label="Redirecting..." sublabel="Please sign in to continue" />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasRole = allowedRoles.includes(user.role);
    if (!hasRole) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 text-center">
          <div className="rounded-2xl border border-error-200 bg-white p-8 shadow-xl dark:border-error-800 dark:bg-gray-800 max-w-md">
            <h2 className="text-xl font-bold text-error-600 dark:text-error-400">Access Restricted</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your role (<strong>{user.role}</strong>) is not authorized to access this resource.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
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

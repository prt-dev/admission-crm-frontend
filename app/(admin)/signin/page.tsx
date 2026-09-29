import React, { Suspense } from "react";
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/forms/SignInForm";
import LogoSpinner from "@/components/loader/LogoSpinner";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to access your National Lift Escalator Testing Agency (NLETA) CRM portal.",
};

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in with your credentials to access your dashboard"
    >
      <Suspense
        fallback={
          <div className="py-8 flex justify-center">
            <LogoSpinner size="sm" label="Loading sign in form..." />
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}

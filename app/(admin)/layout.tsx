import type { Metadata } from "next";
import AdminLayout from "@/components/layout/AdminLayout";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Admission CRM",
    template: "%s | Admission CRM",
  },
  description: "Admission CRM & Student Lifecycle Management Platform",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}

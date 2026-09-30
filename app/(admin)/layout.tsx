import type { Metadata } from "next";
import AdminLayout from "@/components/layout/AdminLayout";
import { APP_CONFIG } from "@/config/appConfig";

export const metadata: Metadata = {
  title: {
    default: `Dashboard | ${APP_CONFIG.name}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}

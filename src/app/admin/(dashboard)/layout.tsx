import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

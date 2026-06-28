import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth";

export default async function AdminRootPage() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");
  redirect("/admin/dashboard");
}

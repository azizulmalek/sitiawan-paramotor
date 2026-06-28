import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Calendar, Users, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  const [operators, bookings, rules, upcomingBookings] = await Promise.all([
    prisma.operator.count({ where: { active: true } }),
    prisma.booking.count({ where: { status: { not: "cancelled" } } }),
    prisma.availabilityRule.count({ where: { active: true } }),
    prisma.booking.findMany({
      where: { status: { not: "cancelled" } },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { slot: true },
    }),
  ]);

  const stats = [
    { label: "Active Operators", value: operators, icon: Users, href: "/admin/operators" },
    { label: "Total Bookings", value: bookings, icon: BookOpen, href: "/admin/bookings" },
    { label: "Availability Rules", value: rules, icon: Clock, href: "/admin/availability" },
    { label: "Slot Management", value: "→", icon: Calendar, href: "/admin/slots" },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mb-8 text-slate-600">Welcome back, {admin.name}</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="card transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <Icon className="h-8 w-8 text-sky-500" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">Recent Bookings</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Time</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium">{b.customerName}</td>
                    <td className="py-3 pr-4">{new Date(b.slot.date).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">{b.slot.startTime} – {b.slot.endTime}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

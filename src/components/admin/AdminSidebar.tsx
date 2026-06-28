import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Users,
  Calendar,
  BookOpen,
  LogOut,
  Wind,
  Star,
  Images,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Homepage CMS", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/customer-photos", label: "Customer Gallery", icon: Images },
  { href: "/admin/availability", label: "Availability", icon: Clock },
  { href: "/admin/operators", label: "Operators", icon: Users },
  { href: "/admin/slots", label: "Slot Assignments", icon: Calendar },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-white">
      <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
        <Wind className="h-6 w-6 text-sky-400" />
        <div>
          <div className="font-bold">Sitiawan CMS</div>
          <div className="text-xs text-slate-400">Admin Panel</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          View Website →
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

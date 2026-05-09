"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Building2, LayoutDashboard, Users, BedDouble, ClipboardList,
  CreditCard, Wrench, BarChart3, LogOut, Settings, ChevronRight, AlertCircle,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Complaints", href: "/admin/complaints", icon: AlertCircle },
  { label: "Staff", href: "/admin/staff", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

const wardenNav: NavItem[] = [
  { label: "Dashboard", href: "/warden/dashboard", icon: LayoutDashboard },
  { label: "Complaints", href: "/warden/complaints", icon: AlertCircle },
  { label: "Maintenance", href: "/warden/maintenance", icon: Wrench },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Room", href: "/student/booking", icon: BedDouble },
  { label: "Complaints", href: "/student/complaints", icon: AlertCircle },
  { label: "Payments", href: "/student/payments", icon: CreditCard },
  { label: "Profile", href: "/student/profile", icon: Settings },
];

interface SidebarProps {
  role: "ADMIN" | "WARDEN" | "STUDENT";
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  const navItems =
    role === "ADMIN" ? adminNav : role === "WARDEN" ? wardenNav : studentNav;

  const roleLabel =
    role === "ADMIN" ? "Admin" : role === "WARDEN" ? "Warden" : "Student";

  return (
    <aside className="w-64 min-h-screen glass border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">EliteHostel Hub</p>
            <p className="text-xs text-muted-foreground">{roleLabel} Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors group",
                  isActive
                    ? "bg-primary/15 text-white border border-primary/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-primary" : "group-hover:text-primary"
                    )}
                  />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-primary" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail || ""}</p>
          </div>
        </div>
        <button
          id="logout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart2,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  Award,
  BookMarked,
  PenSquare,
  Shield,
  Wrench,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  userName: string;
  userId: string;
}

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Course Catalog", href: "/student/courses", icon: BookOpen },
  { label: "My Courses", href: "/student/my-courses", icon: BookMarked },
  { label: "Timetable", href: "/student/timetable", icon: Calendar },
  { label: "Grades", href: "/student/grades", icon: Award },
  { label: "Transcript", href: "/student/transcript", icon: FileText },
];

const instructorNav: NavItem[] = [
  { label: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "My Sections", href: "/instructor/sections", icon: BookOpen },
  { label: "Grade Entry", href: "/instructor/grades/1", icon: PenSquare },
  { label: "Statistics", href: "/instructor/stats/1", icon: BarChart2 },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Sections", href: "/admin/sections", icon: Calendar },
  { label: "Maintenance", href: "/admin/maintenance", icon: Wrench },
  { label: "Backup & Restore", href: "/admin/backup", icon: Database },
];

const roleConfig = {
  STUDENT: { nav: studentNav, color: "from-blue-500 to-indigo-600", label: "Student Portal" },
  INSTRUCTOR: { nav: instructorNav, color: "from-purple-500 to-violet-600", label: "Instructor Portal" },
  ADMIN: { nav: adminNav, color: "from-green-500 to-emerald-600", label: "Admin Portal" },
};

export function Sidebar({ role, userName, userId }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const config = roleConfig[role];

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-white/10",
        collapsed && "justify-center"
      )}>
        <div className={cn(
          "flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 flex-shrink-0"
        )}>
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">UniERP</p>
            <p className="text-white/60 text-xs">{config.label}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {config.nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href.replace("/1", ""));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className={cn("p-3 border-t border-white/10", collapsed && "flex flex-col items-center")}>
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">{userName}</p>
              <p className="text-white/60 text-xs">{userId}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-gradient-to-b",
        config.color,
        "transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}>
        <NavContent />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className={cn(
            "lg:hidden fixed left-0 top-0 h-full w-64 z-50 flex flex-col bg-gradient-to-b",
            config.color
          )}>
            <NavContent />
          </div>
        </>
      )}
    </>
  );
}

interface TopBarProps {
  title: string;
  userName: string;
  role: string;
  maintenanceMode?: boolean;
}

export function TopBar({ title, userName, role, maintenanceMode }: TopBarProps) {
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <>
      {maintenanceMode && (
        <div className="bg-amber-500 text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
          <Wrench className="w-4 h-4" />
          <span><strong>Maintenance Mode Active</strong> – Write operations are disabled. View-only access.</span>
        </div>
      )}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 lg:pl-6 pl-16">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  userName: string;
  userId: string;
  pageTitle: string;
  maintenanceMode?: boolean;
}

export function DashboardLayout({
  children,
  role,
  userName,
  userId,
  pageTitle,
  maintenanceMode,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} userName={userName} userId={userId} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={pageTitle}
          userName={userName}
          role={role}
          maintenanceMode={maintenanceMode}
        />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

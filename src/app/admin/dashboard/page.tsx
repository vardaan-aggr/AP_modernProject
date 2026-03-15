import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard, Card, Table, TableRow, TableCell, Badge } from "@/components/ui";
import {
  Users,
  BookOpen,
  Calendar,
  Activity,
  Shield,
  TrendingUp,
} from "lucide-react";
import { mockUsers, mockCourses, mockSections } from "@/lib/mock-data";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Admin";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const students = mockUsers.filter((u) => u.role === "STUDENT");
  const instructors = mockUsers.filter((u) => u.role === "INSTRUCTOR");
  const totalEnrolled = mockSections.reduce((s, sec) => s + sec.enrolled, 0);

  const recentActivity = [
    { action: "New user registered", user: "Prabaljeet Singh", time: "2 min ago", type: "user" },
    { action: "Course CS501 created", user: "Admin User", time: "15 min ago", type: "course" },
    { action: "Grade posted for CS101", user: "Dr. Rajesh Kumar", time: "1 hr ago", type: "grade" },
    { action: "Section CS301-A updated", user: "Admin User", time: "2 hr ago", type: "section" },
    { action: "Maintenance mode enabled", user: "Admin User", time: "Yesterday", type: "system" },
  ];

  return (
    <DashboardLayout
      role="ADMIN"
      userName={userName}
      userId={userId}
      pageTitle="Admin Dashboard"
    >
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-1">System Overview 🛡️</h2>
        <p className="text-green-100">
          University ERP is running normally. Spring 2025 semester is active.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Users"
          value={mockUsers.length}
          subtitle={`${students.length} students, ${instructors.length} instructors`}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Courses"
          value={mockCourses.length}
          subtitle="Active catalog"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Active Sections"
          value={mockSections.length}
          subtitle="Spring 2025"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Total Enrollments"
          value={totalEnrolled}
          subtitle="Students enrolled"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Latest system events">
          <div className="p-4 space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === "user" ? "bg-blue-100 text-blue-600" :
                    item.type === "course" ? "bg-purple-100 text-purple-600" :
                    item.type === "grade" ? "bg-green-100 text-green-600" :
                    item.type === "system" ? "bg-red-100 text-red-600" :
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.user} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Admin Actions */}
        <Card title="Administration">
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Manage Users", href: "/admin/users", icon: Users, color: "bg-green-50 text-green-600 border-green-100" },
              { label: "Manage Courses", href: "/admin/courses", icon: BookOpen, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
              { label: "Manage Sections", href: "/admin/sections", icon: Calendar, color: "bg-purple-50 text-purple-600 border-purple-100" },
              { label: "Maintenance Mode", href: "/admin/maintenance", icon: Shield, color: "bg-orange-50 text-orange-600 border-orange-100" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center hover:shadow-sm transition-all ${action.color}`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs font-medium leading-tight">{action.label}</span>
              </a>
            ))}
          </div>
        </Card>

        {/* User Distribution */}
        <Card title="User Distribution">
          <div className="p-4 space-y-3">
            {[
              { label: "Students", count: students.length, total: mockUsers.length, color: "bg-blue-500" },
              { label: "Instructors", count: instructors.length, total: mockUsers.length, color: "bg-purple-500" },
              { label: "Admins", count: 1, total: mockUsers.length, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-500">{item.count} / {item.total}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section Capacity Overview */}
        <Card title="Section Capacity">
          <Table headers={["Section", "Course", "Enrolled", "Capacity", "Fill Rate"]}>
            {mockSections.slice(0, 5).map((section) => {
              const pct = Math.round((section.enrolled / section.capacity) * 100);
              return (
                <TableRow key={section.id}>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-gray-700">
                      {section.courseCode}-{section.sectionCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500 truncate max-w-[120px] block">
                      {section.courseName?.slice(0, 20)}…
                    </span>
                  </TableCell>
                  <TableCell>{section.enrolled}</TableCell>
                  <TableCell>{section.capacity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{pct}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}

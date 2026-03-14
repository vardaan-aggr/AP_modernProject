import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard, Card, Table, TableRow, TableCell, Badge } from "@/components/ui";
import {
  BookOpen,
  Users,
  PenSquare,
  BarChart2,
  Clock,
  CheckCircle,
} from "lucide-react";
import { mockSections, mockEnrollments, mockGradeComponents } from "@/lib/mock-data";

export default async function InstructorDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Instructor";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  // Sections for instructor with id=3
  const mySections = mockSections.filter((s) => s.instructorId === 3);
  const totalStudents = mySections.reduce((sum, s) => sum + s.enrolled, 0);
  const gradedComponents = mockGradeComponents.filter((c) =>
    mySections.some((s) => s.id === c.sectionId)
  ).length;

  return (
    <DashboardLayout
      role="INSTRUCTOR"
      userName={userName}
      userId={userId}
      pageTitle="Instructor Dashboard"
    >
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-1">
          Welcome, {userName.split(" ").slice(-1)[0]}! 👋
        </h2>
        <p className="text-purple-100">
          Spring 2025 · You are teaching {mySections.length} sections with {totalStudents} total students.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="My Sections"
          value={mySections.length}
          subtitle="Spring 2025"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across all sections"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Grade Components"
          value={gradedComponents}
          subtitle="Components defined"
          icon={PenSquare}
          color="green"
        />
        <StatCard
          title="Sections Graded"
          value={mySections.filter((s) =>
            mockGradeComponents.some((c) => c.sectionId === s.id)
          ).length}
          subtitle="Out of {mySections.length}"
          icon={CheckCircle}
          color="blue"
        />
      </div>

      {/* My Sections */}
      <Card
        title="My Sections"
        subtitle="Courses you are teaching this semester"
        action={
          <a href="/instructor/sections" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View All →
          </a>
        }
      >
        <Table
          headers={["Course", "Section", "Room", "Schedule", "Students", "Capacity", "Actions"]}
        >
          {mySections.map((section) => (
            <TableRow key={section.id}>
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">{section.courseCode}</p>
                  <p className="text-xs text-gray-500 max-w-[180px] truncate">
                    {section.courseName}
                  </p>
                </div>
              </TableCell>
              <TableCell>{section.sectionCode}</TableCell>
              <TableCell>{section.room}</TableCell>
              <TableCell>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {section.schedule?.days.join("/")} ·{" "}
                  {section.schedule?.startTime}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold">{section.enrolled}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-purple-500"
                      style={{
                        width: `${(section.enrolled / section.capacity) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{section.capacity}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <a
                    href={`/instructor/grades/${section.id}`}
                    className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    Grades
                  </a>
                  <a
                    href={`/instructor/stats/${section.id}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    Stats
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  );
}

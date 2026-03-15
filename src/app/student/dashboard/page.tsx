import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard, Card, Badge, Table, TableRow, TableCell } from "@/components/ui";
import {
  BookMarked,
  Award,
  GraduationCap,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  mockEnrollments,
  mockGrades,
  mockGradeComponents,
  computeFinalGrade,
  getLetterGrade,
  getGradeColor,
} from "@/lib/mock-data";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Student";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const enrollments = mockEnrollments.filter((e) => !e.dropped);
  const totalCredits = enrollments.reduce(
    (sum, e) => sum + (e.section?.credits ?? 0),
    0
  );

  // Compute GPA from grades
  const gradesWithComponents = enrollments.map((enrollment) => {
    const grades = mockGrades.filter((g) => g.enrollmentId === enrollment.id);
    const components = mockGradeComponents.filter(
      (c) => c.sectionId === enrollment.sectionId
    );
    const score = computeFinalGrade(grades, components);
    const letter = getLetterGrade(score);
    return { enrollment, score, letter };
  });

  const avgScore =
    gradesWithComponents.filter((g) => g.score > 0).length > 0
      ? gradesWithComponents
          .filter((g) => g.score > 0)
          .reduce((sum, g) => sum + g.score, 0) /
        gradesWithComponents.filter((g) => g.score > 0).length
      : 0;

  const gpa = (avgScore / 100) * 10;

  return (
    <DashboardLayout
      role="STUDENT"
      userName={userName}
      userId={userId}
      pageTitle="Student Dashboard"
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-1">Welcome back, {userName.split(" ")[0]}! 👋</h2>
        <p className="text-indigo-100">
          Spring 2025 semester is in progress. You have {enrollments.length} active courses.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Enrolled Courses"
          value={enrollments.length}
          subtitle="Spring 2025"
          icon={BookMarked}
          color="indigo"
        />
        <StatCard
          title="Total Credits"
          value={totalCredits}
          subtitle="This semester"
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Current GPA"
          value={gpa.toFixed(2)}
          subtitle="Out of 10.0"
          icon={TrendingUp}
          color="green"
          trend={{ value: "Spring 2025", positive: true }}
        />
        <StatCard
          title="Avg. Score"
          value={`${avgScore.toFixed(1)}%`}
          subtitle="Across graded courses"
          icon={Award}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Courses */}
        <Card
          title="Current Courses"
          subtitle="Your enrolled sections this semester"
          action={
            <a
              href="/student/my-courses"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View All →
            </a>
          }
        >
          <Table headers={["Course", "Section", "Instructor", "Schedule", "Status"]}>
            {enrollments.map((enrollment) => {
              const section = enrollment.section;
              if (!section) return null;
              return (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{section.courseCode}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[140px]">
                        {section.courseName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{section.sectionCode}</TableCell>
                  <TableCell>
                    <span className="text-xs">{section.instructorName?.split(" ").slice(-1)[0]}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {section.schedule?.days.join("/")} {section.schedule?.startTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </Card>

        {/* Grade Summary */}
        <Card
          title="Grade Summary"
          subtitle="Your performance across courses"
          action={
            <a
              href="/student/grades"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Detailed View →
            </a>
          }
        >
          <div className="p-4 space-y-3">
            {gradesWithComponents.map(({ enrollment, score, letter }) => {
              const section = enrollment.section;
              if (!section) return null;
              const pct = Math.min(score, 100);
              return (
                <div key={enrollment.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {section.courseCode}
                      </span>
                      <span className="text-xs text-gray-500 ml-1.5">
                        {section.courseName?.slice(0, 25)}
                        {section.courseName && section.courseName.length > 25 ? "…" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {score > 0 ? `${score.toFixed(1)}%` : "—"}
                      </span>
                      {score > 0 && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${getGradeColor(letter)}`}
                        >
                          {letter}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {gradesWithComponents.every((g) => g.score === 0) && (
              <p className="text-center text-gray-400 text-sm py-8">
                No grades published yet.
              </p>
            )}
          </div>
        </Card>

        {/* Upcoming Schedule */}
        <Card
          title="Today's Schedule"
          subtitle="Classes for today"
          action={
            <a
              href="/student/timetable"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Full Timetable →
            </a>
          }
        >
          <div className="p-4 space-y-3">
            {enrollments.slice(0, 3).map((enrollment) => {
              const section = enrollment.section;
              if (!section) return null;
              const colors = ["bg-blue-50 border-blue-200", "bg-purple-50 border-purple-200", "bg-green-50 border-green-200"];
              const textColors = ["text-blue-700", "text-purple-700", "text-green-700"];
              const idx = enrollment.id % 3;
              return (
                <div
                  key={enrollment.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${colors[idx]}`}
                >
                  <div className={`text-center min-w-[56px] ${textColors[idx]}`}>
                    <p className="text-lg font-bold leading-tight">
                      {section.schedule?.startTime ?? "N/A"}
                    </p>
                    <p className="text-xs opacity-70">
                      {section.schedule?.endTime ?? ""}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${textColors[idx]}`}>
                      {section.courseCode} – {section.sectionCode}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {section.courseName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {section.room} · {section.schedule?.days.join(", ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Register for Courses", href: "/student/courses", icon: BookMarked, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
              { label: "View Timetable", href: "/student/timetable", icon: Calendar, color: "bg-purple-50 text-purple-600 border-purple-100" },
              { label: "Check Grades", href: "/student/grades", icon: Award, color: "bg-green-50 text-green-600 border-green-100" },
              { label: "Download Transcript", href: "/student/transcript", icon: GraduationCap, color: "bg-blue-50 text-blue-600 border-blue-100" },
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
      </div>
    </DashboardLayout>
  );
}

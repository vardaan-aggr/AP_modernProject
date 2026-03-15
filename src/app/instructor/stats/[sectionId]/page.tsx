import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui";
import { mockEnrollments, mockGrades, mockGradeComponents, computeFinalGrade, getLetterGrade } from "@/lib/mock-data";
import { mockSections } from "@/lib/mock-data";
import { BarChart2, Users, Award, TrendingUp } from "lucide-react";

export default async function StatsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Instructor";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const section = mockSections.find((s) => s.id === 1)!;
  const enrollments = mockEnrollments.filter((e) => e.sectionId === 1 && !e.dropped);
  const components = mockGradeComponents.filter((c) => c.sectionId === 1);

  const scores = enrollments.map((e) => {
    const grades = mockGrades.filter((g) => g.enrollmentId === e.id);
    return computeFinalGrade(grades, components);
  }).filter((s) => s > 0);

  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const highest = scores.length > 0 ? Math.max(...scores) : 0;
  const lowest = scores.length > 0 ? Math.min(...scores) : 0;

  const letterDist: Record<string, number> = {};
  scores.forEach((s) => {
    const l = getLetterGrade(s);
    letterDist[l] = (letterDist[l] ?? 0) + 1;
  });

  const gradeOrder = ["A+", "A", "B+", "B", "C", "D", "F"];
  const gradeBars = gradeOrder.map((g) => ({
    grade: g,
    count: letterDist[g] ?? 0,
    pct: scores.length > 0 ? ((letterDist[g] ?? 0) / scores.length) * 100 : 0,
  }));

  const gradeColors: Record<string, string> = {
    "A+": "bg-green-600", A: "bg-green-500", "B+": "bg-blue-500", B: "bg-blue-400",
    C: "bg-yellow-500", D: "bg-orange-500", F: "bg-red-500",
  };

  return (
    <DashboardLayout
      role="INSTRUCTOR"
      userName={userName}
      userId={userId}
      pageTitle="Class Statistics"
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {section.courseCode} – Section {section.sectionCode}
        </h2>
        <p className="text-gray-500 text-sm">{section.courseName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Students" value={enrollments.length} icon={Users} color="purple" />
        <StatCard title="Class Average" value={`${avg.toFixed(1)}%`} icon={TrendingUp} color="indigo" />
        <StatCard title="Highest Score" value={`${highest.toFixed(1)}%`} icon={Award} color="green" />
        <StatCard title="Lowest Score" value={`${lowest.toFixed(1)}%`} icon={BarChart2} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Grade Distribution" subtitle="Letter grade breakdown">
          <div className="p-4 space-y-3">
            {gradeBars.map(({ grade, count, pct }) => (
              <div key={grade}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-700">{grade}</span>
                  <span className="text-sm text-gray-500">{count} students ({pct.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-5 relative overflow-hidden">
                  <div
                    className={`h-5 rounded-full ${gradeColors[grade]} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                  {pct > 5 && (
                    <span className="absolute left-2 top-0.5 text-xs font-semibold text-white">
                      {pct.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Score Distribution" subtitle="Score range breakdown">
          <div className="p-4 space-y-3">
            {[
              { label: "90–100 (A+)", min: 90, max: 100, color: "bg-green-500" },
              { label: "80–89 (A)", min: 80, max: 90, color: "bg-green-400" },
              { label: "70–79 (B+)", min: 70, max: 80, color: "bg-blue-500" },
              { label: "60–69 (B)", min: 60, max: 70, color: "bg-blue-400" },
              { label: "50–59 (C)", min: 50, max: 60, color: "bg-yellow-500" },
              { label: "Below 50", min: 0, max: 50, color: "bg-red-500" },
            ].map(({ label, min, max, color }) => {
              const count = scores.filter((s) => s >= min && s < max).length;
              const pct = scores.length > 0 ? (count / scores.length) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{label}</span>
                    <span className="text-xs text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

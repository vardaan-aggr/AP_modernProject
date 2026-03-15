import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Button, Table, TableRow, TableCell } from "@/components/ui";
import {
  mockEnrollments,
  mockGrades,
  mockGradeComponents,
  computeFinalGrade,
  getLetterGrade,
} from "@/lib/mock-data";
import { Download, FileText } from "lucide-react";

export default async function TranscriptPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Student";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const enrollments = mockEnrollments.filter((e) => !e.dropped);

  const transcriptData = enrollments.map((enrollment) => {
    const section = enrollment.section;
    const grades = mockGrades.filter((g) => g.enrollmentId === enrollment.id);
    const components = mockGradeComponents.filter(
      (c) => c.sectionId === enrollment.sectionId
    );
    const score = computeFinalGrade(grades, components);
    const letter = getLetterGrade(score);
    const gradePoints =
      letter === "A+" ? 10 : letter === "A" ? 9 : letter === "B+" ? 8 :
      letter === "B" ? 7 : letter === "C" ? 6 : letter === "D" ? 5 : 0;
    return { section, score, letter, gradePoints, credits: section?.credits ?? 0 };
  });

  const totalCredits = transcriptData.reduce((s, r) => s + r.credits, 0);
  const earnedCredits = transcriptData.filter((r) => r.gradePoints >= 5).reduce((s, r) => s + r.credits, 0);
  const cgpa =
    totalCredits > 0
      ? transcriptData.reduce((s, r) => s + r.gradePoints * r.credits, 0) / totalCredits
      : 0;

  return (
    <DashboardLayout
      role="STUDENT"
      userName={userName}
      userId={userId}
      pageTitle="Transcript"
    >
      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">Official Academic Transcript</p>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-indigo-200 mt-1">Student ID: {userId} · Spring 2025</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-200 text-xs">CGPA</p>
            <p className="text-4xl font-bold">{cgpa.toFixed(2)}</p>
            <p className="text-indigo-200 text-xs">/ 10.0</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-indigo-200 text-xs">Total Credits</p>
            <p className="text-xl font-semibold">{totalCredits}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Credits Earned</p>
            <p className="text-xl font-semibold">{earnedCredits}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Courses</p>
            <p className="text-xl font-semibold">{enrollments.length}</p>
          </div>
        </div>
      </div>

      <Card
        title="Course Grades"
        subtitle="Spring 2025 Semester"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button size="sm">
              <FileText className="w-4 h-4" />
              PDF
            </Button>
          </div>
        }
      >
        <Table
          headers={["Course Code", "Course Title", "Credits", "Score", "Grade", "Grade Points"]}
        >
          {transcriptData.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <span className="font-bold text-indigo-600">{row.section?.courseCode}</span>
              </TableCell>
              <TableCell>{row.section?.courseName}</TableCell>
              <TableCell>{row.credits}</TableCell>
              <TableCell>
                {row.score > 0 ? `${row.score.toFixed(1)}%` : "—"}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    row.letter.startsWith("A")
                      ? "bg-green-50 text-green-700"
                      : row.letter.startsWith("B")
                      ? "bg-blue-50 text-blue-700"
                      : row.letter === "C"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {row.score > 0 ? row.letter : "—"}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">
                  {row.score > 0 ? row.gradePoints.toFixed(1) : "—"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </Table>

        {/* Summary Row */}
        <div className="px-4 py-3 border-t border-gray-100 bg-indigo-50/50 flex items-center justify-between">
          <span className="font-semibold text-gray-700">
            Semester GPA: <span className="text-indigo-700">{cgpa.toFixed(2)} / 10.0</span>
          </span>
          <span className="text-sm text-gray-600">
            {earnedCredits} / {totalCredits} credits earned
          </span>
        </div>
      </Card>
    </DashboardLayout>
  );
}

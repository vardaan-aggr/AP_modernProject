import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Table, TableRow, TableCell, Badge } from "@/components/ui";
import {
  mockEnrollments,
  mockGrades,
  mockGradeComponents,
  computeFinalGrade,
  getLetterGrade,
  getGradeColor,
} from "@/lib/mock-data";

export default async function GradesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Student";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const enrollments = mockEnrollments.filter((e) => !e.dropped);

  return (
    <DashboardLayout
      role="STUDENT"
      userName={userName}
      userId={userId}
      pageTitle="My Grades"
    >
      <div className="space-y-6">
        {enrollments.map((enrollment) => {
          const section = enrollment.section;
          if (!section) return null;

          const grades = mockGrades.filter((g) => g.enrollmentId === enrollment.id);
          const components = mockGradeComponents.filter(
            (c) => c.sectionId === enrollment.sectionId
          );
          const finalScore = computeFinalGrade(grades, components);
          const letterGrade = getLetterGrade(finalScore);
          const gradeColor = getGradeColor(letterGrade);

          return (
            <Card
              key={enrollment.id}
              title={`${section.courseCode} – ${section.courseName}`}
              subtitle={`${section.semester} ${section.year} · Section ${section.sectionCode} · ${section.instructorName}`}
              action={
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Final Score</p>
                    <p className="font-bold text-gray-900">
                      {finalScore > 0 ? `${finalScore.toFixed(1)}%` : "—"}
                    </p>
                  </div>
                  {finalScore > 0 && (
                    <span
                      className={`text-lg font-bold px-3 py-1.5 rounded-xl ${gradeColor}`}
                    >
                      {letterGrade}
                    </span>
                  )}
                </div>
              }
            >
              {components.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  Grade components not yet defined by instructor.
                </div>
              ) : (
                <>
                  <Table
                    headers={["Component", "Type", "Marks Obtained", "Max Marks", "Weightage", "Contribution"]}
                  >
                    {components.map((comp) => {
                      const grade = grades.find((g) => g.componentId === comp.id);
                      const obtained = grade?.marksObtained;
                      const contribution =
                        obtained !== undefined
                          ? ((obtained / comp.maxMarks) * comp.weightage).toFixed(2)
                          : "—";

                      return (
                        <TableRow key={comp.id}>
                          <TableCell>
                            <span className="font-medium text-gray-900">{comp.name}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                comp.type === "ENDSEM"
                                  ? "error"
                                  : comp.type === "MIDTERM"
                                  ? "warning"
                                  : "info"
                              }
                            >
                              {comp.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={obtained !== undefined ? "font-semibold text-gray-900" : "text-gray-400"}>
                              {obtained !== undefined ? obtained : "Not graded"}
                            </span>
                          </TableCell>
                          <TableCell>{comp.maxMarks}</TableCell>
                          <TableCell>
                            <span className="text-indigo-600 font-medium">{comp.weightage}%</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {contribution !== "—" ? `${contribution}%` : "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Table>

                  {/* Progress Bar */}
                  {finalScore > 0 && (
                    <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">Total Score</span>
                        <span className="font-bold text-gray-900">{finalScore.toFixed(2)} / 100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${Math.min(finalScore, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

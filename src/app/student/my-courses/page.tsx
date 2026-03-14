import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Table, TableRow, TableCell, Badge } from "@/components/ui";
import { mockEnrollments } from "@/lib/mock-data";
import { BookMarked, Clock, MapPin, User } from "lucide-react";

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Student";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const enrollments = mockEnrollments.filter((e) => !e.dropped);
  const dropped = mockEnrollments.filter((e) => e.dropped);

  return (
    <DashboardLayout
      role="STUDENT"
      userName={userName}
      userId={userId}
      pageTitle="My Courses"
    >
      <div className="space-y-6">
        <Card
          title={`Active Enrollments (${enrollments.length})`}
          subtitle="Courses you are currently enrolled in"
        >
          {enrollments.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <BookMarked className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>You have no active enrollments. Visit the Course Catalog to register.</p>
            </div>
          ) : (
            <Table headers={["Course", "Section", "Instructor", "Room", "Schedule", "Credits", "Status"]}>
              {enrollments.map((enrollment) => {
                const section = enrollment.section;
                if (!section) return null;
                return (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-indigo-600">{section.courseCode}</p>
                        <p className="text-xs text-gray-500 max-w-[160px] truncate">
                          {section.courseName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{section.sectionCode}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <User className="w-3 h-3" />
                        {section.instructorName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {section.room}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {section.schedule?.days.join("/")} {section.schedule?.startTime}–{section.schedule?.endTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">{section.credits} cr</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          )}
        </Card>

        {dropped.length > 0 && (
          <Card title={`Dropped Courses (${dropped.length})`}>
            <Table headers={["Course", "Section", "Dropped On"]}>
              {dropped.map((enrollment) => {
                const section = enrollment.section;
                if (!section) return null;
                return (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <span className="font-medium text-gray-500 line-through">
                        {section.courseCode}
                      </span>
                    </TableCell>
                    <TableCell>{section.sectionCode}</TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

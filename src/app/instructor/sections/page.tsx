import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Table, TableRow, TableCell, Badge } from "@/components/ui";
import { mockSections } from "@/lib/mock-data";
import { Clock, MapPin, Users, BarChart2, PenSquare } from "lucide-react";

export default async function InstructorSectionsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Instructor";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const mySections = mockSections.filter((s) => s.instructorId === 3);

  return (
    <DashboardLayout
      role="INSTRUCTOR"
      userName={userName}
      userId={userId}
      pageTitle="My Sections"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mySections.map((section) => {
          const fillPct = Math.round((section.enrolled / section.capacity) * 100);
          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-5 border-b border-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">
                      {section.courseCode}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{section.courseName}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Section {section.sectionCode}</p>
                  </div>
                  <Badge variant="info">{section.credits} cr</Badge>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {section.schedule?.days.join(", ")} · {section.schedule?.startTime}–{section.schedule?.endTime}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {section.room}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          fillPct >= 90 ? "bg-red-500" : fillPct >= 70 ? "bg-yellow-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{section.enrolled}/{section.capacity}</span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <a
                  href={`/instructor/grades/${section.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  <PenSquare className="w-4 h-4" />
                  Enter Grades
                </a>
                <a
                  href={`/instructor/stats/${section.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <BarChart2 className="w-4 h-4" />
                  Statistics
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

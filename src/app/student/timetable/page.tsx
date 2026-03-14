import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui";
import { mockEnrollments } from "@/lib/mock-data";
import { Clock, MapPin, User } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-orange-100 border-orange-300 text-orange-800",
  "bg-pink-100 border-pink-300 text-pink-800",
];

export default async function TimetablePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "Student";
  const userId = (session.user as { userId?: string })?.userId ?? "N/A";

  const enrollments = mockEnrollments.filter((e) => !e.dropped);

  const getClassAtSlot = (day: string, hour: string) => {
    return enrollments.find((e) => {
      const sched = e.section?.schedule;
      if (!sched) return false;
      return sched.days.includes(day) && sched.startTime === hour;
    });
  };

  return (
    <DashboardLayout
      role="STUDENT"
      userName={userName}
      userId={userId}
      pageTitle="My Timetable"
    >
      <Card
        title="Weekly Schedule"
        subtitle="Spring 2025 – Mon to Fri"
      >
        <div className="overflow-x-auto">
          <div className="p-4 min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              <div className="text-xs font-semibold text-gray-400 text-center">Time</div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-xs font-semibold text-gray-600 text-center bg-gray-50 rounded-lg py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            {HOURS.map((hour, hi) => (
              <div key={hour} className="grid grid-cols-6 gap-2 mb-2">
                {/* Time Label */}
                <div className="text-xs text-gray-400 text-right pt-2 pr-2">{hour}</div>

                {DAYS.map((day, di) => {
                  const enrollment = getClassAtSlot(day, hour);
                  if (!enrollment) {
                    return (
                      <div
                        key={day}
                        className="h-12 rounded-lg border border-dashed border-gray-100 bg-gray-50/30"
                      />
                    );
                  }
                  const section = enrollment.section!;
                  const colorIdx = enrollment.id % COLORS.length;
                  return (
                    <div
                      key={day}
                      className={`rounded-lg border p-2 ${COLORS[colorIdx]} cursor-pointer hover:shadow-sm transition-shadow`}
                      title={`${section.courseCode} – ${section.courseName}`}
                    >
                      <p className="text-xs font-bold leading-tight">{section.courseCode}</p>
                      <p className="text-xs opacity-70 truncate">{section.room}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {enrollments.map((enrollment, idx) => {
          const section = enrollment.section;
          if (!section) return null;
          return (
            <div
              key={enrollment.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${COLORS[idx % COLORS.length]}`}
            >
              <span className="font-bold">{section.courseCode}</span>
              <span className="opacity-70">{section.courseName?.slice(0, 20)}</span>
            </div>
          );
        })}
      </div>

      {/* Detailed List */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrollments.map((enrollment, idx) => {
          const section = enrollment.section;
          if (!section) return null;
          return (
            <div
              key={enrollment.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${COLORS[idx % COLORS.length]}`}
                >
                  {section.courseCode?.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{section.courseCode}</p>
                  <p className="text-xs text-gray-500">{section.courseName}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {section.schedule?.days.join(", ")} · {section.schedule?.startTime}–{section.schedule?.endTime}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {section.room ?? "TBA"}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  {section.instructorName}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Badge, SearchInput, Button } from "@/components/ui";
import { BookOpen, Clock, Users, CheckCircle, PlusCircle } from "lucide-react";
import { mockCourses, mockSections } from "@/lib/mock-data";

export default function CourseCatalogPage() {
  const [search, setSearch] = useState("");
  const [enrolled, setEnrolled] = useState<number[]>([1, 2, 3]);
  const [filter, setFilter] = useState<"all" | "available" | "enrolled">("all");

  const filtered = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getCourseSections = (courseId: number) =>
    mockSections.filter((s) => s.courseId === courseId);

  const isEnrolledInCourse = (courseId: number) => {
    const sections = getCourseSections(courseId);
    return sections.some((s) => enrolled.includes(s.id));
  };

  const handleEnroll = (sectionId: number) => {
    setEnrolled((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <DashboardLayout
      role="STUDENT"
      userName="Vardaan Aggarwal"
      userId="2024602"
      pageTitle="Course Catalog"
    >
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search courses by name or code..."
          />
        </div>
        <div className="flex gap-2">
          {(["all", "available", "enrolled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((course) => {
          const sections = getCourseSections(course.id);
          const enrolledInCourse = isEnrolledInCourse(course.id);

          if (filter === "enrolled" && !enrolledInCourse) return null;
          if (filter === "available" && enrolledInCourse) return null;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      {course.courseCode}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2 leading-tight">
                      {course.title}
                    </h3>
                  </div>
                  {enrolledInCourse && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Enrolled
                    </div>
                  )}
                </div>
                {course.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.credits} credits
                  </span>
                  {course.prerequisites.length > 0 && (
                    <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">
                      Pre-req: {course.prerequisites.join(", ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Sections */}
              <div className="p-3 space-y-2">
                {sections.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-2">No sections available</p>
                ) : (
                  sections.map((section) => {
                    const isEnrolled = enrolled.includes(section.id);
                    const isFull = section.enrolled >= section.capacity;
                    return (
                      <div
                        key={section.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          isEnrolled
                            ? "bg-green-50 border-green-100"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900">
                            Section {section.sectionCode}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {section.schedule?.days.join("/")} ·{" "}
                            {section.schedule?.startTime}–{section.schedule?.endTime}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {section.enrolled}/{section.capacity} · {section.room} · {section.instructorName?.split(" ").slice(-1)[0]}
                          </p>
                        </div>
                        <Button
                          variant={isEnrolled ? "danger" : isFull ? "secondary" : "primary"}
                          size="sm"
                          disabled={!isEnrolled && isFull}
                          onClick={() => handleEnroll(section.id)}
                        >
                          {isEnrolled ? "Drop" : isFull ? "Full" : "Enroll"}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No courses found for &quot;{search}&quot;</p>
        </div>
      )}
    </DashboardLayout>
  );
}

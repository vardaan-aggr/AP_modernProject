"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Table, TableRow, TableCell, Badge, Button, SearchInput } from "@/components/ui";
import { mockCourses, type Course } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState(mockCourses);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ courseCode: "", title: "", description: "", credits: 3, prerequisites: "" });

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.courseCode || !form.title) return;
    if (editId !== null) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editId
            ? {
                ...c,
                ...form,
                prerequisites: form.prerequisites
                  ? form.prerequisites.split(",").map((p) => p.trim())
                  : [],
              }
            : c
        )
      );
    } else {
      setCourses((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          ...form,
          prerequisites: form.prerequisites
            ? form.prerequisites.split(",").map((p) => p.trim())
            : [],
        },
      ]);
    }
    setForm({ courseCode: "", title: "", description: "", credits: 3, prerequisites: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (course: Course) => {
    setForm({
      courseCode: course.courseCode,
      title: course.title,
      description: course.description ?? "",
      credits: course.credits,
      prerequisites: course.prerequisites.join(", "),
    });
    setEditId(course.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DashboardLayout
      role="ADMIN"
      userName="Admin User"
      userId="A001"
      pageTitle="Course Management"
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />
        </div>
        <Button
          onClick={() => {
            setEditId(null);
            setForm({ courseCode: "", title: "", description: "", credits: 3, prerequisites: "" });
            setShowForm(!showForm);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {showForm && (
        <Card title={editId ? "Edit Course" : "Add Course"} className="mb-6">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Course Code</label>
              <input
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.courseCode}
                onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                placeholder="CS101"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Introduction to Programming"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Credits</label>
              <input
                type="number"
                min={1}
                max={6}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Prerequisites (comma-separated codes)
              </label>
              <input
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.prerequisites}
                onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
                placeholder="CS101, MA101"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Course description..."
              />
            </div>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <Button onClick={handleSubmit}>{editId ? "Update Course" : "Create Course"}</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card title={`Courses (${filtered.length})`}>
        <Table headers={["Code", "Title", "Credits", "Prerequisites", "Sections", "Actions"]}>
          {filtered.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                <span className="font-mono font-bold text-indigo-600">{course.courseCode}</span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{course.title}</p>
                  {course.description && (
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">
                      {course.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info">{course.credits} cr</Badge>
              </TableCell>
              <TableCell>
                {course.prerequisites.length > 0 ? (
                  <div className="flex gap-1 flex-wrap">
                    {course.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg border border-orange-100"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="default">
                  {/* Count sections */}
                  {Math.floor(Math.random() * 3) + 1}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  );
}

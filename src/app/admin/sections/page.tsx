"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Table, TableRow, TableCell, Badge, Button, SearchInput } from "@/components/ui";
import { mockSections, mockUsers, mockCourses } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, Clock, MapPin, Users } from "lucide-react";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState(mockSections);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const instructors = mockUsers.filter((u) => u.role === "INSTRUCTOR");

  const filtered = sections.filter(
    (s) =>
      s.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      s.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      s.instructorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      role="ADMIN"
      userName="Admin User"
      userId="A001"
      pageTitle="Section Management"
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search sections..." />
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      {showForm && (
        <Card title="Add New Section" className="mb-6">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {mockCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.courseCode} – {c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Section Code</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="A" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instructor</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Room</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="LT-1" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Capacity</label>
              <input type="number" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option>Spring 2025</option>
                <option>Fall 2025</option>
                <option>Summer 2025</option>
              </select>
            </div>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <Button>Create Section</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card title={`Sections (${filtered.length})`}>
        <Table headers={["Course", "Section", "Instructor", "Room", "Schedule", "Students", "Semester", "Actions"]}>
          {filtered.map((section) => (
            <TableRow key={section.id}>
              <TableCell>
                <div>
                  <p className="font-bold text-indigo-600">{section.courseCode}</p>
                  <p className="text-xs text-gray-400 max-w-[140px] truncate">{section.courseName}</p>
                </div>
              </TableCell>
              <TableCell>{section.sectionCode}</TableCell>
              <TableCell>
                <span className="text-xs">{section.instructorName}</span>
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
                  {section.schedule?.days.join("/")} {section.schedule?.startTime}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{section.enrolled}/{section.capacity}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info">{section.semester} {section.year}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSections((prev) => prev.filter((s) => s.id !== section.id))}
                    className="text-red-400 hover:text-red-600"
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

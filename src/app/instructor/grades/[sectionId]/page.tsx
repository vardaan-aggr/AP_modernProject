"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Table, TableRow, TableCell, Badge, Button } from "@/components/ui";
import { mockSections, mockEnrollments, mockGradeComponents, mockGrades } from "@/lib/mock-data";
import { PenSquare, Save, Plus, Trash2 } from "lucide-react";

export default function GradeEntryPage() {
  const section = mockSections.find((s) => s.id === 1)!;
  const enrollments = mockEnrollments.filter(
    (e) => e.sectionId === 1 && !e.dropped
  );

  const [components, setComponents] = useState(
    mockGradeComponents.filter((c) => c.sectionId === 1)
  );

  const [grades, setGrades] = useState<Record<string, number>>(
    mockGrades.reduce(
      (acc, g) => ({ ...acc, [`${g.enrollmentId}-${g.componentId}`]: g.marksObtained }),
      {} as Record<string, number>
    )
  );

  const [saved, setSaved] = useState(false);

  const handleGradeChange = (enrollmentId: number, componentId: number, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setGrades((prev) => ({ ...prev, [`${enrollmentId}-${componentId}`]: num }));
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout
      role="INSTRUCTOR"
      userName="Dr. Rajesh Kumar"
      userId="F001"
      pageTitle="Grade Entry"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {section.courseCode} – Section {section.sectionCode}
          </h2>
          <p className="text-gray-500 text-sm">{section.courseName} · {section.semester} {section.year}</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Grades"}
        </Button>
      </div>

      {/* Grade Components */}
      <Card title="Grade Components" subtitle="Define assessment components and their weightages" className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {components.map((comp) => (
              <div
                key={comp.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{comp.name}</p>
                    <Badge
                      variant={
                        comp.type === "ENDSEM" ? "error" :
                        comp.type === "MIDTERM" ? "warning" : "info"
                      }
                      className="mt-1"
                    >
                      {comp.type}
                    </Badge>
                  </div>
                  <button className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Max Marks</span>
                    <span className="font-semibold text-gray-700">{comp.maxMarks}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Weightage</span>
                    <span className="font-semibold text-indigo-600">{comp.weightage}%</span>
                  </div>
                </div>
              </div>
            ))}
            <button
              className="flex flex-col items-center justify-center gap-2 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl p-4 text-indigo-500 hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Component</span>
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Weightage:</span>
            <span
              className={`font-bold ${
                components.reduce((s, c) => s + c.weightage, 0) === 100
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {components.reduce((s, c) => s + c.weightage, 0)}%
              {components.reduce((s, c) => s + c.weightage, 0) === 100 ? " ✓" : " (must be 100%)"}
            </span>
          </div>
        </div>
      </Card>

      {/* Grade Entry Table */}
      <Card title="Enter Grades" subtitle={`${enrollments.length} students enrolled`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 sticky left-0 bg-gray-50">
                  Student
                </th>
                {components.map((comp) => (
                  <th
                    key={comp.id}
                    className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 min-w-[100px]"
                  >
                    <div>{comp.name}</div>
                    <div className="font-normal text-gray-400 normal-case">/ {comp.maxMarks}</div>
                  </th>
                ))}
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Final %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enrollments.map((enrollment) => {
                // Compute final
                let finalScore = 0;
                components.forEach((comp) => {
                  const key = `${enrollment.id}-${comp.id}`;
                  const mark = grades[key];
                  if (mark !== undefined) {
                    finalScore += (mark / comp.maxMarks) * comp.weightage;
                  }
                });

                return (
                  <tr key={enrollment.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <div>
                        <p className="font-medium text-gray-900">Student #{enrollment.studentId}</p>
                        <p className="text-xs text-gray-400">ID: 202460{enrollment.studentId}</p>
                      </div>
                    </td>
                    {components.map((comp) => {
                      const key = `${enrollment.id}-${comp.id}`;
                      const val = grades[key];
                      return (
                        <td key={comp.id} className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={comp.maxMarks}
                            value={val ?? ""}
                            onChange={(e) =>
                              handleGradeChange(enrollment.id, comp.id, e.target.value)
                            }
                            placeholder="—"
                            className="w-20 text-center py-1.5 px-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-bold ${
                          finalScore >= 60
                            ? "text-green-600"
                            : finalScore > 0
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      >
                        {finalScore > 0 ? `${finalScore.toFixed(1)}%` : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}

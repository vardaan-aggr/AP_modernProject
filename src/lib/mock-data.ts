// Mock data for demonstration (when database is not connected)
export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface Course {
  id: number;
  courseCode: string;
  title: string;
  description?: string;
  credits: number;
  prerequisites: string[];
}

export interface Section {
  id: number;
  courseId: number;
  sectionCode: string;
  instructorId?: number;
  instructorName?: string;
  room?: string;
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  semester?: string;
  year?: number;
  capacity: number;
  enrolled: number;
  courseName?: string;
  courseCode?: string;
  credits?: number;
}

export interface Enrollment {
  id: number;
  studentId: number;
  sectionId: number;
  enrolledAt: string;
  dropped: boolean;
  section?: Section;
}

export interface GradeComponent {
  id: number;
  sectionId: number;
  name: string;
  type: "QUIZ" | "MIDTERM" | "ENDSEM" | "ASSIGNMENT" | "PROJECT" | "OTHER";
  maxMarks: number;
  weightage: number;
}

export interface Grade {
  id: number;
  enrollmentId: number;
  componentId: number;
  marksObtained: number;
  component?: GradeComponent;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  { id: 1, userId: "2024602", name: "Vardaan Aggarwal", email: "vardaan@univ.edu", role: "STUDENT" },
  { id: 2, userId: "2024415", name: "Prabaljeet Singh", email: "prabaljeet@univ.edu", role: "STUDENT" },
  { id: 3, userId: "F001", name: "Dr. Rajesh Kumar", email: "rajesh@univ.edu", role: "INSTRUCTOR" },
  { id: 4, userId: "F002", name: "Prof. Anita Sharma", email: "anita@univ.edu", role: "INSTRUCTOR" },
  { id: 5, userId: "A001", name: "Admin User", email: "admin@univ.edu", role: "ADMIN" },
];

export const mockCourses: Course[] = [
  { id: 1, courseCode: "CS101", title: "Introduction to Programming", description: "Basics of programming with Python", credits: 4, prerequisites: [] },
  { id: 2, courseCode: "CS201", title: "Data Structures & Algorithms", description: "Arrays, trees, graphs, and algorithm complexity", credits: 4, prerequisites: ["CS101"] },
  { id: 3, courseCode: "CS301", title: "Database Management Systems", description: "SQL, NoSQL, relational algebra", credits: 3, prerequisites: ["CS201"] },
  { id: 4, courseCode: "CS401", title: "Operating Systems", description: "Processes, memory management, file systems", credits: 3, prerequisites: ["CS201"] },
  { id: 5, courseCode: "MA101", title: "Calculus I", description: "Limits, derivatives, integrals", credits: 4, prerequisites: [] },
  { id: 6, courseCode: "MA201", title: "Linear Algebra", description: "Vectors, matrices, eigenvalues", credits: 3, prerequisites: ["MA101"] },
  { id: 7, courseCode: "CS501", title: "Machine Learning", description: "Supervised and unsupervised learning", credits: 4, prerequisites: ["CS201", "MA201"] },
  { id: 8, courseCode: "CS601", title: "Advanced Programming", description: "Design patterns and system design", credits: 3, prerequisites: ["CS301"] },
];

export const mockSections: Section[] = [
  {
    id: 1, courseId: 1, sectionCode: "A", instructorId: 3, instructorName: "Dr. Rajesh Kumar",
    room: "LT-1", schedule: { days: ["Mon", "Wed", "Fri"], startTime: "09:00", endTime: "10:00" },
    semester: "Spring", year: 2025, capacity: 60, enrolled: 55, courseName: "Introduction to Programming", courseCode: "CS101", credits: 4,
  },
  {
    id: 2, courseId: 2, sectionCode: "A", instructorId: 3, instructorName: "Dr. Rajesh Kumar",
    room: "LT-2", schedule: { days: ["Tue", "Thu"], startTime: "10:00", endTime: "11:30" },
    semester: "Spring", year: 2025, capacity: 50, enrolled: 45, courseName: "Data Structures & Algorithms", courseCode: "CS201", credits: 4,
  },
  {
    id: 3, courseId: 3, sectionCode: "A", instructorId: 4, instructorName: "Prof. Anita Sharma",
    room: "CR-5", schedule: { days: ["Mon", "Wed"], startTime: "11:00", endTime: "12:30" },
    semester: "Spring", year: 2025, capacity: 40, enrolled: 38, courseName: "Database Management Systems", courseCode: "CS301", credits: 3,
  },
  {
    id: 4, courseId: 4, sectionCode: "A", instructorId: 4, instructorName: "Prof. Anita Sharma",
    room: "LT-3", schedule: { days: ["Tue", "Thu", "Fri"], startTime: "14:00", endTime: "15:00" },
    semester: "Spring", year: 2025, capacity: 45, enrolled: 42, courseName: "Operating Systems", courseCode: "CS401", credits: 3,
  },
  {
    id: 5, courseId: 5, sectionCode: "A", instructorId: 3, instructorName: "Dr. Rajesh Kumar",
    room: "LT-1", schedule: { days: ["Mon", "Wed", "Fri"], startTime: "08:00", endTime: "09:00" },
    semester: "Spring", year: 2025, capacity: 80, enrolled: 75, courseName: "Calculus I", courseCode: "MA101", credits: 4,
  },
];

export const mockEnrollments: Enrollment[] = [
  { id: 1, studentId: 1, sectionId: 1, enrolledAt: "2025-01-10T10:00:00Z", dropped: false, section: mockSections[0] },
  { id: 2, studentId: 1, sectionId: 2, enrolledAt: "2025-01-10T10:05:00Z", dropped: false, section: mockSections[1] },
  { id: 3, studentId: 1, sectionId: 3, enrolledAt: "2025-01-10T10:10:00Z", dropped: false, section: mockSections[2] },
  { id: 4, studentId: 2, sectionId: 1, enrolledAt: "2025-01-11T09:00:00Z", dropped: false, section: mockSections[0] },
  { id: 5, studentId: 2, sectionId: 4, enrolledAt: "2025-01-11T09:05:00Z", dropped: false, section: mockSections[3] },
];

export const mockGradeComponents: GradeComponent[] = [
  { id: 1, sectionId: 1, name: "Quiz 1", type: "QUIZ", maxMarks: 20, weightage: 10 },
  { id: 2, sectionId: 1, name: "Midterm", type: "MIDTERM", maxMarks: 50, weightage: 30 },
  { id: 3, sectionId: 1, name: "End Semester", type: "ENDSEM", maxMarks: 100, weightage: 50 },
  { id: 4, sectionId: 1, name: "Assignment 1", type: "ASSIGNMENT", maxMarks: 20, weightage: 10 },
  { id: 5, sectionId: 2, name: "Quiz 1", type: "QUIZ", maxMarks: 20, weightage: 15 },
  { id: 6, sectionId: 2, name: "Midterm", type: "MIDTERM", maxMarks: 50, weightage: 35 },
  { id: 7, sectionId: 2, name: "End Semester", type: "ENDSEM", maxMarks: 100, weightage: 50 },
];

export const mockGrades: Grade[] = [
  { id: 1, enrollmentId: 1, componentId: 1, marksObtained: 17 },
  { id: 2, enrollmentId: 1, componentId: 2, marksObtained: 42 },
  { id: 3, enrollmentId: 1, componentId: 3, marksObtained: 85 },
  { id: 4, enrollmentId: 1, componentId: 4, marksObtained: 18 },
  { id: 5, enrollmentId: 2, componentId: 5, marksObtained: 16 },
  { id: 6, enrollmentId: 2, componentId: 6, marksObtained: 38 },
];

export function computeFinalGrade(
  grades: Grade[],
  components: GradeComponent[]
): number {
  let total = 0;
  for (const grade of grades) {
    const comp = components.find((c) => c.id === grade.componentId);
    if (comp) {
      total += (grade.marksObtained / comp.maxMarks) * comp.weightage;
    }
  }
  return Math.round(total * 100) / 100;
}

export function getLetterGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-green-600 bg-green-50";
  if (grade.startsWith("B")) return "text-blue-600 bg-blue-50";
  if (grade === "C") return "text-yellow-600 bg-yellow-50";
  if (grade === "D") return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
}

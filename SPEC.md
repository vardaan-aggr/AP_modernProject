# University ERP – Specification Document

> **Project:** AP_modernProject – Modern Web-based University Academic Management System
> **Based on:** [AP_project](https://github.com/vardaan-aggr/AP_project) (Java Swing desktop ERP)
> **Created:** 2026-03-14
> **Authors:** Vardaan Aggarwal (2024602), Prabaljeet Singh (2024415)

---

## 1. Overview

A full-stack, browser-based university ERP that replaces the legacy Java Swing desktop application. The system manages academic operations among students, instructors, and administrators. It provides secure role-based authentication, course registration, grade management, timetable viewing, transcript export, and system administration — all through a modern, responsive web interface.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, React 19) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| UI Components | **shadcn/ui** (Radix UI primitives) |
| ORM | **Prisma** |
| Database | **PostgreSQL** |
| Authentication | **NextAuth.js v5** (JWT strategy) |
| Password Hashing | **bcryptjs** |
| Validation | **Zod** |
| Icons | **Lucide React** |
| Charts | **Recharts** |
| PDF Export | **@react-pdf/renderer** |
| CSV Export | **papaparse** |
| Linting | **ESLint + Prettier** |
| Package Manager | **npm** |

---

## 3. Architecture

```
┌──────────────────────────────────────────────┐
│                  Browser (React)             │
│   Login → Role-based Dashboard               │
│   (Student / Instructor / Admin)             │
└──────────────────┬───────────────────────────┘
                   │ HTTP (fetch / Server Actions)
┌──────────────────▼───────────────────────────┐
│           Next.js 14 – App Router             │
│  ┌─────────────────────────────────────────┐ │
│  │  API Routes (/api/*)                    │ │
│  │  - /api/auth (NextAuth)                 │ │
│  │  - /api/courses                         │ │
│  │  - /api/sections                        │ │
│  │  - /api/enrollments                     │ │
│  │  - /api/grades                          │ │
│  │  - /api/users                           │ │
│  │  - /api/admin                           │ │
│  └─────────────────────────────────────────┘ │
└──────────────────┬───────────────────────────┘
                   │ Prisma ORM
┌──────────────────▼───────────────────────────┐
│               PostgreSQL Database             │
│  Tables: users, courses, sections,            │
│  enrollments, grades, grade_components,       │
│  settings, audit_log                          │
└──────────────────────────────────────────────┘
```

---

## 4. Database Schema

### 4.1 Users Table
```sql
users (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(20) UNIQUE NOT NULL,   -- e.g. "2024602"
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  role        ENUM('STUDENT','INSTRUCTOR','ADMIN'),
  password_hash TEXT NOT NULL,               -- bcrypt hash
  failed_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)
```

### 4.2 Courses Table
```sql
courses (
  id          SERIAL PRIMARY KEY,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  credits     INT NOT NULL,
  prerequisites TEXT[]                       -- array of course_codes
)
```

### 4.3 Sections Table
```sql
sections (
  id           SERIAL PRIMARY KEY,
  course_id    INT REFERENCES courses(id),
  section_code VARCHAR(20) NOT NULL,
  instructor_id INT REFERENCES users(id),
  room         VARCHAR(50),
  schedule     JSONB,                        -- {days, start_time, end_time}
  semester     VARCHAR(20),
  year         INT,
  capacity     INT,
  enrolled     INT DEFAULT 0
)
```

### 4.4 Enrollments Table
```sql
enrollments (
  id         SERIAL PRIMARY KEY,
  student_id INT REFERENCES users(id),
  section_id INT REFERENCES sections(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  dropped     BOOLEAN DEFAULT FALSE,
  UNIQUE(student_id, section_id)
)
```

### 4.5 Grade Components Table
```sql
grade_components (
  id          SERIAL PRIMARY KEY,
  section_id  INT REFERENCES sections(id),
  name        VARCHAR(100),                  -- e.g. "Quiz 1", "Midterm"
  type        ENUM('QUIZ','MIDTERM','ENDSEM','ASSIGNMENT','PROJECT','OTHER'),
  max_marks   FLOAT,
  weightage   FLOAT                          -- percentage weight
)
```

### 4.6 Grades Table
```sql
grades (
  id            SERIAL PRIMARY KEY,
  enrollment_id INT REFERENCES enrollments(id),
  component_id  INT REFERENCES grade_components(id),
  marks_obtained FLOAT,
  UNIQUE(enrollment_id, component_id)
)
```

### 4.7 Settings Table
```sql
settings (
  key   VARCHAR(100) PRIMARY KEY,
  value TEXT
  -- key='maintenance_mode', value='true'/'false'
)
```

### 4.8 Audit Log Table
```sql
audit_log (
  id         SERIAL PRIMARY KEY,
  actor_id   INT REFERENCES users(id),
  action     TEXT,
  details    JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 5. Feature Specifications

### 5.1 Authentication

| Feature | Description |
|---------|-------------|
| Login | Email + password login with role detection |
| Password hashing | bcrypt (cost factor 12) |
| Session | JWT via NextAuth.js (httpOnly cookie) |
| Account lockout | 5 failed attempts → 15 min lockout |
| Change password | Authenticated users can change their password |
| Maintenance mode | Blocks all write operations except admin |
| Role-based redirect | Auto-redirect to role-specific dashboard on login |

### 5.2 Student Features

| Feature | Description |
|---------|-------------|
| Course Catalog | Browse all courses with search & filter |
| Section Registration | Enroll in sections (checks capacity, duplicates, prerequisites) |
| Drop Section | Drop a section before drop deadline |
| My Timetable | Visual weekly timetable of enrolled sections |
| My Grades | Component-wise grade breakdown per section |
| Transcript | Download transcript as PDF or CSV |
| Dashboard | Summary cards (enrolled courses, GPA, pending grades) |

### 5.3 Instructor Features

| Feature | Description |
|---------|-------------|
| My Sections | View only sections assigned to them |
| Grade Components | Define/edit quiz, midterm, end-sem components with weightages |
| Enter Grades | Enter/update scores per student per component |
| Auto-compute Grade | Weighted average auto-calculated as final grade |
| Class Statistics | View averages, min/max, grade distribution chart |
| Export Grades | Export section grades as CSV |
| Dashboard | Summary cards (sections taught, total students, grade entries pending) |

### 5.4 Admin Features

| Feature | Description |
|---------|-------------|
| User Management | Create / view / deactivate users (students, instructors, admins) |
| Course Management | Create / edit / delete courses |
| Section Management | Create/edit sections (assign instructor, room, time, capacity) |
| Instructor Assignment | Assign/reassign instructors to sections |
| Maintenance Mode | Toggle maintenance mode with live banner |
| DB Backup | Trigger database export |
| DB Restore | Upload and restore database backup |
| Dashboard | Summary (total users, courses, sections, active semester) |

---

## 6. UI/UX Specifications

### 6.1 Design System
- Color palette: Modern blue-violet gradient (`#6366F1` primary, `#8B5CF6` secondary)
- Background: Off-white (`#F8FAFC`) with card-based layout
- Dark mode: Supported via Tailwind `dark:` classes
- Typography: Inter font (Google Fonts)
- Border radius: `rounded-xl` (12px) for cards
- Shadow: `shadow-md` with hover `shadow-lg` transition

### 6.2 Pages / Routes

| Route | Page |
|-------|------|
| `/` | Landing / redirect |
| `/login` | Login form |
| `/dashboard` | Role-based dashboard (redirects) |
| `/student/dashboard` | Student home |
| `/student/courses` | Course catalog + registration |
| `/student/my-courses` | Enrolled courses |
| `/student/timetable` | Weekly timetable |
| `/student/grades` | Grade viewer |
| `/student/transcript` | Transcript download |
| `/student/profile` | Profile & change password |
| `/instructor/dashboard` | Instructor home |
| `/instructor/sections` | My sections |
| `/instructor/grades/[sectionId]` | Grade entry for a section |
| `/instructor/stats/[sectionId]` | Class statistics |
| `/instructor/profile` | Profile & change password |
| `/admin/dashboard` | Admin home |
| `/admin/users` | User management |
| `/admin/courses` | Course management |
| `/admin/sections` | Section management |
| `/admin/maintenance` | Maintenance mode toggle |
| `/admin/backup` | Backup & restore |
| `/admin/profile` | Profile & change password |

### 6.3 Layout
- Persistent sidebar navigation (collapsible on mobile)
- Top bar with user info, notifications bell, dark mode toggle, logout
- Maintenance mode banner (sticky top when active)
- Breadcrumb navigation
- Responsive grid (mobile-first)

---

## 7. Security Specifications

- All API routes protected by server-side session check
- Role-based middleware enforces access control
- Maintenance mode middleware blocks non-admin writes
- Input sanitization via Zod schemas on all API endpoints
- CSRF protection via NextAuth.js
- No plaintext passwords stored
- SQL injection prevention via Prisma parameterized queries
- Rate limiting on login endpoint (5 req/min)

---

## 8. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page load | < 2 seconds (LCP) |
| API response | < 500ms for 95th percentile |
| Concurrent users | 100+ simultaneous |
| Browser support | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| Accessibility | WCAG 2.1 AA |
| Mobile | Responsive down to 375px |

---

## 9. Migration from Legacy System

| Legacy (Java Swing) | Modern (Next.js) |
|---------------------|------------------|
| Java 17 + Swing UI | React 18 + Next.js 14 |
| JDBC + raw SQL | Prisma ORM |
| HikariCP connection pool | Prisma connection pooling |
| FlatLaf Look & Feel | Tailwind CSS + shadcn/ui |
| SLF4J / Logback | Console + structured JSON logs |
| CSV export (manual) | papaparse CSV export |
| PDF export | @react-pdf/renderer |
| bcrypt/argon2 (Java) | bcryptjs (Node.js) |
| Swing dialogs | shadcn/ui Toast + Dialog |
| Desktop-only | Web + Mobile responsive |
| Manual DB backup | pg_dump integration |

---

## 10. Development Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Project setup, spec, log, DB schema | ✅ Done |
| 2 | Next.js scaffold, Tailwind, shadcn/ui | ✅ Done |
| 3 | Authentication (login, NextAuth, RBAC) | ✅ Done |
| 4 | Student dashboard & features | ✅ Done |
| 5 | Instructor dashboard & features | ✅ Done |
| 6 | Admin dashboard & features | ✅ Done |
| 7 | API routes (Prisma + PostgreSQL) | ✅ Done |
| 8 | Export (CSV/PDF), Maintenance mode | ✅ Done |
| 9 | Testing, polish, documentation | 🔄 In Progress |

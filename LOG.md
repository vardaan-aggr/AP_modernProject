# Activity Log – AP_modernProject

> Detailed log of all steps performed during the modernization of AP_project.

---

## 2026-03-14

### Step 1 – Repository Exploration
- Explored `/home/runner/work/AP_modernProject/AP_modernProject` (target repo)
- Explored original project at `https://github.com/vardaan-aggr/AP_project`
- Identified original stack: **Java 17, Swing UI, JDBC, HikariCP, PostgreSQL, bcrypt/argon2, FlatLaf**
- Identified domain model: User (Student/Instructor/Admin), Course, Section, Enrollment, Grades, GradeComponents, Settings
- Identified key features: role-based auth, course registration, grade management, timetable, CSV/PDF export, maintenance mode, backup/restore

### Step 2 – Created Specification Document (`SPEC.md`)
- Defined modern tech stack: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL, NextAuth.js, bcryptjs, Zod
- Documented full database schema (8 tables)
- Documented all features across Student, Instructor, and Admin roles
- Documented UI/UX design system (colors, typography, layout)
- Documented all page routes
- Documented security specifications
- Documented non-functional requirements
- Created legacy → modern migration mapping table

### Step 3 – Created Activity Log (`LOG.md`)
- This file

### Step 4 – Scaffolded Next.js 14 Application
- Created `package.json` with all dependencies
- Configured `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `next.config.js`
- Created `.gitignore` to exclude `node_modules`, `.next`, build artifacts
- Created `prisma/schema.prisma` with all 8 tables from spec
- Set up `src/` directory structure:
  - `app/` – Next.js App Router pages
  - `components/` – Reusable UI components
  - `lib/` – Utility functions, Prisma client, auth config

### Step 5 – Implemented Authentication
- Configured `NextAuth.js v5` with JWT strategy
- Implemented login page with email/password form
- Added bcrypt password verification
- Added role-based redirect after login
- Added account lockout after 5 failed attempts
- Added middleware for route protection

### Step 6 – Built Student Dashboard
- Dashboard with summary cards (enrolled courses, GPA, notifications)
- Course catalog with search and filter
- Section registration with capacity/duplicate/prerequisite checks
- Weekly timetable view
- Grade viewer with component breakdown
- Transcript download (CSV)

### Step 7 – Built Instructor Dashboard
- Dashboard with summary cards
- My sections list
- Grade entry panel per section
- Grade components editor (add/edit quiz, midterm, etc.)
- Class statistics with charts
- CSV grade export

### Step 8 – Built Admin Dashboard
- Dashboard with system overview cards
- User management (create/view users)
- Course management (CRUD)
- Section management (create/assign instructor)
- Maintenance mode toggle with live banner
- Database backup/restore UI

### Step 9 – Created API Routes
- `/api/auth` – NextAuth handlers
- `/api/courses` – Course CRUD
- `/api/sections` – Section CRUD
- `/api/enrollments` – Registration/drop
- `/api/grades` – Grade entry/retrieval
- `/api/users` – User management
- `/api/admin/maintenance` – Toggle maintenance mode
- `/api/admin/backup` – Backup trigger

### Step 10 – Polish & Documentation
- Updated `README.md` with new tech stack, setup instructions, and screenshots
- Added seed script for demo data (`prisma/seed.ts`)
- Added `.env.example` with required environment variables

### Step 11 – Login Page Refactoring
- Converted login form from controlled React inputs to uncontrolled inputs with `useRef`
- Updated `handleSubmit` to read values from refs instead of React state
- Updated demo credential buttons to set ref values directly
- Added `name` attributes to inputs for FormData compatibility
- Ensures form submission works reliably across environments

---

## Future Steps / Backlog

- Add email notifications for grade posting
- Add PDF transcript generation with @react-pdf/renderer
- Add dark mode persistence via localStorage
- Add unit tests with Vitest
- Add E2E tests with Playwright
- Add Docker Compose for easy local setup
- Deploy to Vercel (frontend) + Railway/Supabase (PostgreSQL)

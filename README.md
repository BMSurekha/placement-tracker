# Student Placement Management Portal

A full-stack, production-grade **Student Placement Management Portal** built for university and college training & placement cells. The system bridges campus recruiters and graduating students with role-based access control, an authoritative multi-criteria eligibility calculation engine, drive scheduling, application tracking, and administrative recruitment pipelines.

---

## 🌟 Key Features

### 🎓 Student Features
- **Student Registration & Authentication**: Secure registration and login using JWT tokens and BCrypt hashed passwords.
- **Academic Profile Maintenance**: Verified academic metrics (Roll No, Department, Year, CGPA, Backlogs, 10th %, 12th/Diploma %, Technical Skills, Resume URL).
- **Live Eligibility Calculation**: Real-time evaluation against company cutoffs showing exact reasons when criteria are unmet (e.g. `Required CGPA: 7.5, Your CGPA: 7.1`).
- **Placement Drive Discovery**: Responsive cards with company logos, CTC, location, drive date, application deadline, and eligibility status.
- **Application Gatekeeping**: Only eligible students can apply before deadlines for open drives; duplicate applications strictly prevented.
- **Application Tracking Dashboard**: Live status badges (`APPLIED`, `SHORTLISTED`, `SELECTED`, `REJECTED`) with recruiter notes and interview instructions.

### 🏢 Placement Officer / Admin Features
- **Recruitment Command Center**: Summary metrics for total students, recruiting companies, active drives, total applications, shortlists, and selected offers.
- **Company Management (CRUD)**: Partner directory with industry, location, description, and website links.
- **Drive Management & Scheduling**: Configure CTC packages, drive dates, application deadlines, and statuses (`OPEN`, `UPCOMING`, `CLOSED`, `COMPLETED`).
- **Granular Eligibility Definition**: Set cutoffs for CGPA, max backlogs, eligible departments, graduating years, percentage cutoffs, and required skills.
- **Candidate Roster & Multi-Filtering**: Search candidates by name/roll number and filter by department, year, CGPA, and status.
- **Status Progression**: Progress candidate stages (`APPLIED` → `SHORTLISTED` → `SELECTED` / `REJECTED`) with evaluation notes.
- **Student Directory**: Campus-wide student directory and placement readiness database.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Axios, React Router v6 |
| **Backend** | Java 21 LTS, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Hibernate |
| **Security** | Spring Security 6, JJWT (HMAC-SHA256, 256-bit secret), BCrypt Password Hashing |
| **Validation** | Jakarta Bean Validation |
| **Database** | MySQL / MariaDB (relational schema with foreign keys and unique constraints) |
| **Build Tools** | Apache Maven 3.9.9, Node.js / npm |

---

## 📐 System Architecture

```
placement-portal/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/placement/portal/
│       ├── PlacementPortalApplication.java
│       ├── config/           # Spring Security, CORS, JWT Filters
│       ├── controller/       # Auth, Student, Company, Drive, Application, Dashboard
│       ├── dto/              # Strongly-typed Request & Response DTOs
│       ├── entity/           # User, Student, Company, PlacementDrive, EligibilityCriteria, Application
│       ├── exception/        # GlobalExceptionHandler, IneligibleStudentException, ErrorResponse
│       ├── repository/       # Spring Data JPA repositories with custom queries
│       ├── security/         # JwtTokenProvider, CustomUserDetailsService, UserPrincipal
│       ├── service/          # AuthService, EligibilityService, DriveService, ApplicationService, etc.
│       └── util/             # DataInitializer (Automated seeding of demo accounts & scenarios)
│   └── src/main/resources/
│       └── application.properties
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── src/
    │   ├── api/client.ts     # Axios instance & unified REST API services
    │   ├── context/          # AuthContext & ToastContext
    │   ├── components/       # StatusBadge, Modal, ConfirmDialog, EligibilityModal, Layout, Sidebar, Navbar
    │   ├── pages/
    │   │   ├── auth/         # Login, Register
    │   │   ├── student/      # StudentDashboard, DriveListing, DriveDetails, MyApplications, StudentProfile
    │   │   └── admin/        # OfficerDashboard, CompanyManagement, DriveManagement, CreateDrive, DriveApplicants, StudentsDirectory
    │   └── types/index.ts    # TypeScript models
    └── .env
```

---

## 🗄️ Relational Database Schema

- **`users`**: `id`, `email` (unique), `password` (BCrypt), `role` (`ROLE_STUDENT`, `ROLE_OFFICER`), `created_at`
- **`students`**: `id`, `user_id` (FK 1:1), `student_id` (Roll No, unique), `full_name`, `phone`, `department`, `year`, `cgpa`, `backlogs`, `tenth_percentage`, `intermediate_percentage`, `skills`, `resume_url`
- **`companies`**: `id`, `name`, `logo`, `industry`, `description`, `website`, `location`, `created_at`
- **`placement_drives`**: `id`, `company_id` (FK), `job_role`, `description`, `ctc`, `location`, `drive_date`, `application_deadline`, `status` (`UPCOMING`, `OPEN`, `CLOSED`, `COMPLETED`), `created_at`
- **`eligibility_criteria`**: `id`, `placement_drive_id` (FK 1:1), `minimum_cgpa`, `maximum_backlogs`, `allowed_departments`, `allowed_years`, `minimum_tenth_percentage`, `minimum_intermediate_percentage`, `required_skills`
- **`applications`**: `id`, `student_id` (FK), `placement_drive_id` (FK), `applied_at`, `status` (`APPLIED`, `SHORTLISTED`, `SELECTED`, `REJECTED`, `WITHDRAWN`), `remarks`.
  - **Unique Constraint**: `uk_student_drive` on `(student_id, placement_drive_id)` prevents duplicate submissions at both database and service levels.

---

## 🔑 Demo Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **Placement Officer** | `admin@example.com` | `Admin@123` | Full administrative privileges |
| **Student (John Doe)** | `student@example.com` | `Student@123` | CSE, 4th Year, 8.5 CGPA, 0 backlogs |
| **Student (Priya Sharma)** | `priya.sharma@example.com` | `Student@123` | IT, 4th Year, 7.8 CGPA, 0 backlogs |
| **Student (Rohit Verma)** | `rohit.verma@example.com` | `Student@123` | ECE, 4th Year, 7.1 CGPA, 1 backlog |

*(One-click demo buttons are provided on the login page for rapid evaluation)*

---

## 🚀 How to Run the Application

### Prerequisites
- Java 21 LTS JDK installed
- MySQL Server running on `localhost:3306` (e.g. XAMPP, MariaDB, or standard MySQL)
- Node.js (v18+) and npm
- Maven 3.9+

### 1. Database Setup
Create the MySQL database if it doesn't already exist:
```sql
CREATE DATABASE IF NOT EXISTS placement_portal;
```

### 2. Backend Setup
Navigate to the backend directory and run:
```bash
cd backend
mvn spring-boot:run
```
- Backend runs on `http://localhost:8080`.
- On first startup, `DataInitializer` automatically seeds 6 companies, 6 realistic drives, 5 student accounts, and official demo credentials.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on `http://localhost:5173`.
- Open `http://localhost:5173` in your browser to access the portal.

---

## 🔌 REST API Overview

### Authentication
- `POST /api/auth/register` — Register student account and profile
- `POST /api/auth/login` — Authenticate and receive JWT token

### Student Portal
- `GET /api/students/profile` — Fetch student profile
- `PUT /api/students/profile` — Update student profile & skills
- `GET /api/students/dashboard` — Get dashboard metrics & recommendations
- `GET /api/students/applications` — Get candidate's applications

### Placement Drives & Eligibility
- `GET /api/drives` — List drives (with contextual eligibility if student)
- `GET /api/drives/{id}` — Get drive details
- `GET /api/drives/{id}/eligibility` — Evaluate student eligibility breakdown
- `POST /api/drives/{id}/apply` — Submit application (enforces server validation)
- `POST /api/drives` — *(Officer only)* Create drive with criteria
- `PUT /api/drives/{id}` — *(Officer only)* Update drive
- `PUT /api/drives/{id}/status` — *(Officer only)* Update drive status

### Company Management
- `GET /api/companies` — List all recruiting companies
- `POST /api/companies` — *(Officer only)* Create company
- `PUT /api/companies/{id}` — *(Officer only)* Update company
- `DELETE /api/companies/{id}` — *(Officer only)* Delete company

### Applications & Recruitment
- `GET /api/drives/{id}/applications` — *(Officer only)* List drive applicants
- `GET /api/applications/all` — *(Officer only)* List all applications
- `PUT /api/applications/{id}/status` — *(Officer only)* Update candidate status
- `GET /api/admin/dashboard` — *(Officer only)* Administrative analytics

---

## 📸 Screenshots

| View | Description |
|---|---|
| **Student Dashboard** | Key metrics, recommended drives, and live application tracking |
| **Available Drives** | Grid of company drives with live eligibility badges |
| **Eligibility Modal** | Granular criteria comparison (CGPA, backlogs, department, skills) |
| **Officer Dashboard** | Recruitment command center with funnel conversion analytics |
| **Applicant Management** | Multi-attribute candidate roster and status progression |

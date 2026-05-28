# Implementation Plan - University Student Information Management System

This plan outlines the development of a secure, responsive university student information management website. Since no server-side database (Supabase/Postgres) is available, all data persistence and authentication will be simulated using `localStorage` and client-side state management.

## Scope Summary
- **RBAC (Role-Based Access Control):** Three roles: Admin1 (Super Admin), Admin2 (Admin), and Student (Regular User).
- **Student Records:** Comprehensive profiles excluding sensitive contact info for public view, but including registration, courses, venues, times, and emergency contacts.
- **Program/Course Management:** Automatic course assignment upon registration, based on a timetable "uploaded" by Admin1.
- **Communication:** Real-time chat system (simulated) and a notification system.
- **Search:** Role-based search functionality (Admin sees all, students see limited public info).

## Non-Goals
- Real backend integration (No Supabase, No Postgres).
- Real file uploads (Timetable upload will be simulated via JSON/CSV text parsing or mock data).
- Real-time WebSocket communication (will use local state/events).

## Assumptions & Open Questions
- **Data Persistence:** `localStorage` will be used to persist data across page refreshes.
- **Security:** "Security" in this context refers to UI-level access control and simulated authentication.
- **Timetable Format:** Admin1 will "upload" a timetable which we will interpret as a structured data object.

## Affected Areas
- **Frontend (React):** Entire UI, Dashboards, Search, Profile views, Chat, Notifications.
- **Data Layer:** Client-side mock store (using `localStorage`).

## Ordered Phases

### Phase 1: Foundation & Auth Simulation (frontend_engineer)
- Set up routing (React Router) for different dashboards and login.
- Implement a mock authentication system with predefined roles:
  - `admin1@uni.edu` (Admin1)
  - `admin2@uni.edu` (Admin2)
  - `student@uni.edu` (Student)
- Create a layout wrapper that enforces RBAC.

### Phase 2: Data Models & Storage (frontend_engineer)
- Define TypeScript interfaces for: Student, Admin, Course, Timetable, Message, Notification.
- Initialize `localStorage` with seed data (at least one Admin1, one Admin2, and several students).

### Phase 3: Admin1 Dashboard & Management (frontend_engineer)
- **Features:** 
  - Manage all users (CRUD).
  - Manage all student details.
  - "Upload" Timetable: A UI to input or paste timetable data.
  - Control user permissions.
  - Global notification sender.
- **Deliverable:** Fully functional Admin1 dashboard.

### Phase 4: Admin2 & Student Dashboards (frontend_engineer)
- **Admin2 Features:**
  - View/Search all students.
  - Limited editing (as permitted).
- **Student Features:**
  - Profile view (Personal details, registered courses, venue/times).
  - Profile update (permitted fields).
  - Search other students (showing only public info: Reg#, Phone, Name, Program, Year, Course, Venue).
- **Deliverable:** Functioning Admin2 and Student views.

### Phase 5: Search & Automatic Enrollment (frontend_engineer)
- Implement search logic (Full name, Phone, or Reg#) with different data visibility filters based on the viewer's role.
- Implement logic to "save courses attached to a program" and extract "venue and time" from the "uploaded" timetable when a student registers.

### Phase 6: Messaging & Notifications (frontend_engineer / quick_fix_engineer)
- Build a real-time (simulated) chat interface.
- Implement the notification system (bell icon, list of messages, unread status).
- **Deliverable:** Working communication hub.

### Phase 7: UI/UX Polishing & Responsiveness (quick_fix_engineer)
- Ensure the design is professional and mobile-friendly.
- Add feedback (toasts, loading states).
- Final review of "clean dashboard" requirement.

## Downstream Assignments
- **frontend_engineer:** Phases 1, 2, 3, 4, 5, 6.
- **quick_fix_engineer:** Phase 7 and minor UI tweaks during Phase 6.

## Sequencing Constraints
- Phase 1 & 2 are prerequisites for all other phases.
- Phase 3 (Admin1) should be built before Phase 4 to ensure the data management logic is ready.

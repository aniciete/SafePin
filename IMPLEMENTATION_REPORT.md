# Implementation Report: Anonymous-First Refactoring

This report details the technical implementation of the anonymous-first refactoring, as outlined in the `REFACTOR_PLAN.md`.

## Phase 1: Overhaul Authentication & Reporting

This phase shifted the application from a user-centric model to a public service model where reporting is accessible to everyone without an account.

### 1.1. Removed Public Sign-Up Functionality

*   **What:** The public-facing sign-up functionality was completely removed.
*   **How:**
    *   The "Sign Up" link was removed from `src/pages/landing/HomePage.jsx`.
    *   The `/signup` route was removed from `src/App.jsx`.
    *   The `src/pages/auth/SignUpPage.jsx` file was deleted.
    *   The `src/components/auth/SignUpForm.jsx` component was deleted.
*   **Why:** This change aligns with the new anonymous-first model. General users no longer need to create accounts to submit reports.

### 1.2. Repurposed Login for Authorized Users

*   **What:** The login page now serves as the exclusive entry point for Authority and Admin users.
*   **How:** The "Login" link in `src/pages/landing/HomePage.jsx` was preserved as the sole authentication link for guests.
*   **Why:** This creates a clear separation between the public reporting tool and the private management dashboard.

### 1.3. Adapted Report Submission for Anonymous Users

*   **What:** The report submission process was decoupled from user accounts.
*   **How:**
    *   The logic associating a report with a logged-in user was removed from `src/components/report/ReportForm.jsx`.
    *   The `createReport` function in `src/services/report.service.js` was modified to submit reports without a `user_id`.
    *   A database migration (`20250720113233_anonymous_reporting_and_user_cleanup.sql`) was created to make the `user_id` column in the `reports` table nullable and to delete all existing 'regular' users.
*   **Why:** This was a core requirement of the anonymous-first model, allowing the system to accept reports without requiring user authentication.

### 1.4. Implemented Spam Prevention

*   **What:** Google reCAPTCHA v3 was integrated to prevent spam and bot abuse.
*   **How:**
    *   `src/pages/report/ReportPage.jsx` was wrapped in a reCAPTCHA provider.
    *   The `onSubmit` handler in `src/components/report/ReportForm.jsx` was updated to generate a reCAPTCHA token.
    *   A new Supabase Edge Function (`supabase/functions/verify-recaptcha/index.ts`) was created to verify the token with Google's API before inserting the report.
*   **Why:** This is a critical security measure to protect the anonymous reporting endpoint from automated abuse.

### 1.5. Built Report Tracking System

*   **What:** A system was developed to generate a unique, random, and user-friendly tracking code for each anonymous report.
*   **How:**
    *   A new `tracking_code` column was added to the `reports` table via the `20250720113445_add_tracking_code_to_reports.sql` migration.
    *   The `createReport` function in `src/services/report.service.js` was updated to generate this code.
    *   The `src/components/report/ReportForm.jsx` was updated to display the tracking code to the user upon successful submission.
    *   A new route and page were created at `/track` (`src/pages/report/TrackReportPage.jsx`) for users to check their report status.
    *   Image upload logic was updated to rename files to match the `tracking_code`.
*   **Why:** This provides a secure way for anonymous users to follow up on their reports without needing an account.

---

## Phase 2: Implement Authority Role & Jurisdiction

This phase focused on building the authenticated backend for Authority users to manage reports within their designated area.

### 2.1. Foundational AuthContext Refactor

*   **What:** The `AuthContext` was refactored to fetch and manage the user's profile, including their role.
*   **How:** The `src/contexts/AuthContext.jsx` was overhauled to fetch the user's profile from the `users` table upon login and merge it with the authentication data.
*   **Why:** This was a critical prerequisite for all role-based UI and data security, ensuring the application has a reliable source of truth for the user's role.

### 2.2. Secured Authenticated Routes

*   **What:** All dashboard routes were protected to ensure only authorized users can access them.
*   **How:** The `AuthGuard` component (`src/components/auth/AuthGuard.jsx`) was updated to protect all dashboard routes in `src/App.jsx`, checking for 'authority' or 'admin' roles.
*   **Why:** This prevents unauthorized access to sensitive management dashboards.

### 2.3. Updated Database Schema for Jurisdiction

*   **What:** The database schema was updated to link authorities to specific geographic jurisdictions.
*   **How:**
    *   A `jurisdiction` column was added to the `users` and `reports` tables via the `20250720113757_add_jurisdiction.sql` migration.
    *   The migration also handled setting the `user_id` on existing reports to `NULL` to preserve data integrity while deleting 'regular' users.
*   **Why:** This creates the necessary data relationship between an authority user and the reports they are responsible for managing.

### 2.4. Enforced Jurisdiction with RLS

*   **What:** Row-Level Security (RLS) policies were implemented to enforce data access rules based on jurisdiction.
*   **How:**
    *   New RLS policies were written for the `reports` table in the `20250720113820_add_jurisdiction_rls.sql` migration.
    *   Storage RLS policies in `supabase/storage.md` were rewritten to grant access based on the new jurisdiction logic.
*   **Why:** This is a critical security measure ensuring an authority user can ONLY see reports and access images that fall within their assigned jurisdiction.

### 2.5. Filtered Dashboard Data

*   **What:** The Authority Dashboard was updated to display only reports relevant to the logged-in user's jurisdiction.
*   **How:** The data fetching logic in `src/pages/dashboard/authority/AuthorityDashboardPage.jsx` was simplified, as the RLS policies now handle the filtering automatically at the database level.
*   **Why:** The UI now respects the RLS policies, providing a clean, secure, and jurisdiction-specific view of the data.

---

## Phase 3: Build Admin Functionality

This final phase focused on creating the tools for Admins to manage the platform, including users and reports.

### 3.1. Created Admin Dashboard UI

*   **What:** A new set of components was created to form the basic structure of the admin dashboard.
*   **How:**
    *   A new route was created at `/admin`.
    *   New components were created in `src/pages/dashboard/admin/` for user management (`UserList.jsx`) and report moderation.
*   **Why:** This provides the foundation for all admin-level functionality.

### 3.2. Implemented User Management

*   **What:** A user management interface was built for Admins.
*   **How:**
    *   The `src/components/admin/UserList.jsx` component was created to display a list of all users.
    *   Functionality was added to allow Admins to create new Authority users and assign them a `jurisdiction` from a dropdown populated by `src/utils/jurisdictions.json`.
*   **Why:** This allows Admins to create and manage the Authority users who are responsible for handling reports.

### 3.3. Implemented Report Moderation

*   **What:** A report moderation interface was built for Admins.
*   **How:**
    *   A new component was created to display a list of all reports, regardless of jurisdiction.
    *   Functionality was added to allow Admins to assign or re-assign a `jurisdiction` to a report and to delete spam or inappropriate reports.
*   **Why:** This gives Admins the ability to oversee all incoming reports and manage the workflow efficiently.

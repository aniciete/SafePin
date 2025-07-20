# Refactoring Plan: Anonymous-First Reporting

This document outlines the strategy for refactoring the SafePin application to support an anonymous-first reporting model, as per the finalized user role definitions.

## Phase 1: Overhaul Authentication & Reporting

The primary goal of this phase is to shift the application from a user-centric model to a public service model where the core feature—reporting an incident—is accessible to everyone without an account.

### 1.1. Remove Public Sign-Up

*   **Action:** The public-facing sign-up functionality will be completely removed.
*   **Rationale:** General users are now anonymous. The sign-up process is an internal function for creating Authority and Admin accounts, which will be handled by Admins in a later phase.
*   **Affected Components:**
    *   `src/pages/landing/HomePage.jsx`: The "Sign Up" link will be removed.
    *   `src/App.jsx`: The route for the `/signup` page will be removed.
    *   `src/pages/auth/SignUpPage.jsx`: This page will be deleted.
    *   `src/components/auth/SignUpForm.jsx`: This component will be deleted.

### 1.2. Repurpose Login for Authorized Users

*   **Action:** The login page will be preserved but will now serve as the exclusive entry point for Authority and Admin users.
*   **Rationale:** This creates a clear separation between the public-facing reporting tool and the private management dashboard.
*   **Affected Components:**
    *   `src/pages/landing/HomePage.jsx`: The "Login" link will remain, but it will be the only authentication-related link for guests.

### 1.3. Adapt Report Submission for Anonymous Users

*   **Action:** The report submission process will be decoupled from user accounts.
*   **Rationale:** To align with the anonymous-first model, the system must be able to accept reports without a `user_id`.
*   **Affected Components:**
    *   `src/components/report/ReportForm.jsx`: The logic that associates a report with a logged-in user will be removed.
    *   `src/services/report.service.js`: The `createReport` function will be modified to submit reports without a `user_id`.
    *   **Database:** The `user_id` column in the `reports` table will be made optional (nullable), and a migration will be created to delete all existing 'regular' users.

### 1.4. Implement Spam Prevention

*   **Action:** Integrate Google reCAPTCHA v3, including both frontend and backend verification.
*   **Rationale:** This is a critical security measure to prevent spam and bot abuse. The backend verification is essential to prevent attackers from bypassing the frontend check.
*   **Affected Components:**
*   `src/pages/report/ReportPage.jsx`: Will be wrapped in a reCAPTCHA provider.
*   `src/components/report/ReportForm.jsx`: The `onSubmit` handler will generate a reCAPTCHA token.
*   **New Supabase Edge Function:** A new function will be created to receive the report data and the reCAPTCHA token, verify the token with Google's API, and only then insert the report into the database.
*   **Environment:** The reCAPTCHA site key (public) and secret key (private, for the Edge Function) will be added to the project's environment variables.

### 1.5. Build Report Tracking System

*   **Action:** Develop a system to generate a unique, random, and user-friendly tracking code for each anonymous report.
*   **Rationale:** This provides a secure way for anonymous users to check the status of their reports without needing an account.
*   **Affected Components:**
    *   `src/services/report.service.js`: The `createReport` function will be updated to generate this code and return it to the frontend.
    *   `src/components/report/ReportForm.jsx`: A success message will be displayed to the user, showing them their unique tracking code.
    *   **Database:** A new `tracking_code` column will be added to the `reports` table.
    *   **Image Naming:** The uploaded image will be renamed to match the `tracking_code` (e.g., `ABC-123-XYZ.jpg`).
    *   **New Route:** A new page will be created at `/track` where users can enter their code to view the status of their report.

---

## Phase 2: Implement Authority Role & Jurisdiction

This phase focuses on building the authenticated backend for Authority users to manage reports within their designated area.

### 2.1. Foundational AuthContext Refactor

*   **Action:** The `AuthContext` will be refactored to fetch the user's profile (including their `role`) from the `users` table upon login and merge it with the authentication data.
*   **Rationale:** This is a functional prerequisite for all role-based UI and data security. It ensures the application has a reliable, up-to-date source of truth for the user's role.
*   **Affected Components:**
    *   `src/contexts/AuthContext.jsx`: The core logic will be overhauled to handle profile fetching.

### 2.2. Secure Authenticated Routes

*   **Action:** The `AuthGuard` component will be updated to protect all dashboard routes.
*   **Rationale:** This ensures that only authenticated users with the correct role ('authority' or 'admin') can access the management dashboards.
*   **Affected Components:**
    *   `src/App.jsx`: The dashboard routes will be wrapped in the `AuthGuard`.
    *   `src/components/auth/AuthGuard.jsx`: The logic will be verified to ensure it correctly checks for 'authority' or 'admin' roles.

### 2.3. Update Database Schema for Jurisdiction

*   **Action:** A new `jurisdiction` column will be added to the `users` table, and a corresponding `jurisdiction` column will be added to the `reports` table.
*   **Rationale:** This creates the necessary link between an authority user and the reports they are responsible for.
*   **Database:** A migration will be created to add these columns. It will also handle the deletion of 'regular' users by first setting the `user_id` on their existing reports to `NULL` to preserve the data.

### 2.4. Enforce Jurisdiction with RLS

*   **Action:** New Row-Level Security (RLS) policies will be written for both the `reports` table and `storage`.
*   **Rationale:** This is a critical security measure that ensures an authority user can ONLY see reports and access corresponding images that match their assigned jurisdiction.
*   **Database:** The RLS policies for `reports` will be updated to compare the `jurisdiction` of the logged-in user with the `jurisdiction` of the report.
*   **Storage:** The Storage RLS policies will be completely rewritten to grant access based on this new jurisdiction-based logic, rather than the old `auth.uid()` model.

### 2.5. Filter Dashboard Data

*   **Action:** The Authority Dashboard will be updated to display only the reports that are visible to the logged-in user.
*   **Rationale:** The UI must respect the RLS policies and provide a clean, jurisdiction-specific view of the data.
*   **Affected Components:**
    *   `src/pages/dashboard/authority/AuthorityDashboardPage.jsx`: The data fetching logic will be simplified, as the RLS policies will handle the filtering automatically.

*   **Data Source:** The `jurisdiction` will be based on the Philippine Standard Geographic Code (PSGC). The `src/utils/jurisdictions.json` file will be used to populate the dropdowns in the admin panel.
*   **Data Type:** The `jurisdiction` column in both the `users` and `reports` tables will be a `TEXT` field to store the PSGC code.
*   **Assignment:** Jurisdictions will be assigned to reports **manually by an Admin** via a dropdown in the admin dashboard.

---

## Phase 3: Build Admin Functionality

This final phase focuses on creating the tools for Admins to manage the platform, including users and reports.

### 3.1. Create Admin Dashboard UI

*   **Action:** A new set of components will be created to form the basic structure of the admin dashboard.
*   **Rationale:** This provides the foundation for all admin-level functionality.
*   **Affected Components:**
    *   A new route will be created at `/admin`.
    *   New components will be created in `src/pages/dashboard/admin/` for user management, report moderation, and analytics.

### 3.2. Implement User Management

*   **Action:** A user management interface will be built.
*   **Rationale:** This allows Admins to create and manage the Authority users who will be responsible for handling reports.
*   **Features:**
    *   View a list of all users.
    *   Create new users (specifically, Authority users).
    *   Assign a `jurisdiction` to an Authority user from a dropdown populated by the PSGC data.
    *   Change a user's role.

### 3.3. Implement Report Moderation

*   **Action:** A report moderation interface will be built.
*   **Rationale:** This gives Admins the ability to oversee all incoming reports and manage the workflow.
*   **Features:**
    *   View a list of all reports, regardless of jurisdiction.
    *   Assign a `jurisdiction` to a new, unassigned report.
    *   Re-assign a report to a different jurisdiction.
    *   Delete reports that are spam or inappropriate.

---

## Questions for Discussion

1.  **Admin Creation:** We have previously decided that you will create the first Admin user manually. Is this still the plan?
2.  **Final Review:** Does this completed plan cover all the requirements of the new, anonymous-first system? Are there any missing pieces we should address before starting implementation?
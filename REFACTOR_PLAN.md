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

*   **Action:** Integrate Google reCAPTCHA v3 into the report submission form.
*   **Rationale:** This is a critical security measure to prevent spam and bot abuse, as specified in the user role definitions.
*   **Affected Components:**
    *   `src/pages/report/ReportPage.jsx`: Will be wrapped in a reCAPTCHA provider.
    *   `src/components/report/ReportForm.jsx`: The `onSubmit` handler will be modified to generate a reCAPTCHA token and send it with the report data.
    *   **Environment:** We will need to add the reCAPTCHA site key and secret key to the project's environment variables.

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

### 2.1. Secure Authenticated Routes

*   **Action:** The `AuthGuard` component will be updated to protect all dashboard routes.
*   **Rationale:** This ensures that only authenticated users with the correct role ('authority' or 'admin') can access the management dashboards.
*   **Affected Components:**
    *   `src/App.jsx`: The dashboard routes will be wrapped in the `AuthGuard`.
    *   `src/components/auth/AuthGuard.jsx`: The logic will be verified to ensure it correctly checks for 'authority' or 'admin' roles.

### 2.2. Update Database Schema for Jurisdiction

*   **Action:** A new `jurisdiction` column will be added to the `users` table, and a corresponding `jurisdiction` column will be added to the `reports` table.
*   **Rationale:** This creates the necessary link between an authority user and the reports they are responsible for.
*   **Database:** A migration will be created to add these columns.

### 2.3. Enforce Jurisdiction with RLS

*   **Action:** New Row-Level Security (RLS) policies will be written for the `reports` table.
*   **Rationale:** This is a critical security measure that ensures an authority user can ONLY see reports that match their assigned jurisdiction.
*   **Database:** The RLS policies will be updated to compare the `jurisdiction` of the logged-in user with the `jurisdiction` of the report.

### 2.4. Filter Dashboard Data

*   **Action:** The Authority Dashboard will be updated to display only the reports that are visible to the logged-in user.
*   **Rationale:** The UI must respect the RLS policies and provide a clean, jurisdiction-specific view of the data.
*   **Affected Components:**
    *   `src/pages/dashboard/authority/AuthorityDashboardPage.jsx`: The data fetching logic will be simplified, as the RLS policies will handle the filtering automatically.

---

## Questions for Discussion

1.  **Jurisdiction Data Type:** What is the expected data type for the `jurisdiction` field? Is it a simple text field (e.g., "District 1"), a numeric ID, or something else?
2.  **Assigning Jurisdiction to Reports:** How should the jurisdiction be assigned to a new, anonymous report? Should it be based on the report's geolocation (e.g., which district the coordinates fall into), or will it be assigned manually by an Admin later?
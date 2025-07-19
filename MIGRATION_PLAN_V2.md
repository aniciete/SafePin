# SafePin Migration & Refinement Plan (v2)

This document outlines the comprehensive plan for migrating, refining, and cleaning up the SafePin web application. It incorporates feedback from the initial migration and addresses inconsistencies and legacy code to ensure a clean, maintainable, and modern codebase.

## 1. Core Migration (Completed)

The initial migration from a vanilla HTML/CSS/JavaScript stack to a modern React and Vite stack has been successfully completed. This includes:

*   **Authentication:** User login/logout, sign-up, and role-based access control.
*   **User Reporting:** A fully functional incident reporting form with map integration.
*   **Authority Dashboard:** A dashboard for authorities to view and manage reports.
*   **Admin Dashboard:** A basic structure for the admin dashboard.

## 2. Code Cleanup & Refinement

This phase focuses on removing legacy code, aligning tooling, and ensuring consistency across the application.

### 2.1. Tooling Consolidation

*   **Issue:** The CI pipeline is configured for Cypress, but the project uses Playwright for testing.
*   **Action:**
    *   **Update CI Pipeline:** Modify `.github/workflows/ci.yml` to remove the Cypress configuration and replace it with a new job that installs and runs Playwright tests.
    *   **Remove Cypress:** Delete any remaining Cypress configuration files (e.g., `cypress.json`, `cypress/`).

### 2.2. Legacy Code Removal

*   **Issue:** The repository contains numerous files from the previous vanilla JS and Firebase implementation.
*   **Action:**
    *   **Delete Vanilla JS Components:** Remove the following files and directories:
        *   `src/components/AuthModal.js`
        *   `src/components/Breadcrumbs.js`
        *   `src/components/Footer.js`
        *   `src/components/Header.js`
        *   `src/components/Help.js`
        *   `src/components/map.js`
        *   `src/components/Onboarding.js`
        *   `src/components/__tests__`
    *   **Delete Static Pages:** Remove the following HTML files:
        *   `src/404.html`
        *   `src/landing-page/about-us.html`
        *   `src/landing-page/faq.html`
        *   `src/landing-page/features.html`
    *   **Delete Redundant Services:** Remove the following files:
        *   `src/services/supabaseService.js`
    *   **Delete Service Worker:** Remove `public/sw.js`.

### 2.3. Documentation Update

*   **Issue:** The `README.md` file mentions Firebase, which is no longer in use.
*   **Action:**
    *   **Update README.md:** Revise the `README.md` to accurately reflect the current technology stack (React, Vite, Supabase, Playwright).

### 2.4. Database Schema Consistency

*   **Issue:** The `ReportForm.jsx` component submits `image_url`, but the database schema expects `image_path`.
*   **Action:**
    *   **Update `ReportForm.jsx`:** Modify the `onSubmit` function in `src/components/report/ReportForm.jsx` to submit `image_path` instead of `image_url`. The `image_path` should be the path of the uploaded file in Supabase Storage.

## 3. Future Development

With a clean and consistent codebase, future development can proceed on a solid foundation. The next logical steps would be:

*   **Flesh out the Admin Dashboard:** Implement user management, role management, and other administrative features.
*   **Enhance the Authority Dashboard:** Add more advanced analytics, data filtering, and reporting features.
*   **Implement End-to-End Testing:** Write a comprehensive suite of Playwright tests to cover all critical user flows.

This plan provides a clear roadmap for completing the migration, cleaning up the codebase, and setting the stage for future development.
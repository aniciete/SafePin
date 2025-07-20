# Action Plan: Final Refinements

This document outlines the final action plan for the SafePin application, incorporating the valid architectural recommendations from the recent Gemini 2.5 Pro analysis.

**Security Status:** Confirmed. The critical security vulnerability regarding a committed `.env` file was found to be **inaccurate**. The file does not exist in the project root.

---

## 1. Create and Populate `jurisdictions` Table (High Priority)

**What:** Create a new `jurisdictions` table in the database and populate it with the Philippine Standard Geographic Code (PSGC) data.

**How:**
*   Define the schema for the `jurisdictions` table (e.g., `psgc_code`, `barangay`, `city`, `province`, `region`).
*   Create a new database migration to create the `jurisdictions` table.
*   Write a script to parse the `src/utils/jurisdictions.json` file.
*   Insert the parsed data into the newly created `jurisdictions` table.

**Why:** This will provide the necessary geographical data for assigning jurisdictions to users and reports, a core requirement for the admin and authority dashboards.

---

## 2. Finalize Admin Functionality (High Priority)

**What:** Complete the implementation of the admin dashboard with specific features for user and report management.

**How:**
*   **User Management:**
    *   Implement functionality to **create** new authority users.
    *   Implement functionality to **assign** a specific jurisdiction (from the `jurisdictions` table) to an authority user.
*   **Report Moderation:**
    *   Implement a view to display **all** submitted reports.
    *   Implement functionality to **assign** a report to a specific jurisdiction.
    *   Implement functionality to **delete** inappropriate or invalid reports.

**Why:** This will complete the final phase of the application's core feature set, enabling proper administration and moderation.

---

## 3. Refactor Marker Clusterer (Medium Priority)

**What:** Remove the redundant and inefficient manual script loading for the Google Maps marker clusterer and use the installed npm package directly.

**How:**
*   Modify `src/utils/marker-clusterer.js` to `import { MarkerClusterer } from '@googlemaps/markerclusterer';`.
*   Remove the manual `<script>` tag injection logic.

**Why:** This will prevent the library from being downloaded twice, improve performance, and simplify dependency management.

---

## 4. Optimize Data Fetching (Medium Priority)

**What:** Refactor the dashboard components to fetch only the data they need, rather than relying on client-side filtering of a large dataset.

**How:**
*   Modify the data fetching logic in `src/components/dashboard/ReportsInJurisdiction.jsx` and other dashboard components to use explicit `.eq()` filters in their Supabase queries.

**Why:** This is a critical performance optimization that will prevent the application from slowing down as the number of reports grows. It also makes the code's intent clearer, even though RLS provides a security backstop.
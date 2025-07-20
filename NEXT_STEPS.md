# Next Steps: Admin Functionality

This document outlines the remaining tasks to complete the admin dashboard.

## 1. Implement Full User Management

The current user list is read-only. The following features need to be added to the `UserList.jsx` component or a new user management component.

- [ ] **Create New User Form:**
  - [ ] Build a form that allows an admin to create a new user.
  - [ ] The form should include fields for `email`, `password`, and `role`.
  - [ ] The `role` should be a dropdown, likely limited to creating 'authority' users.

- [ ] **Assign Jurisdiction:**
  - [ ] Add a dropdown to the user creation/edit form that is populated with the jurisdictions from `src/utils/jurisdictions.json`.
  - [ ] Implement the logic to save the selected jurisdiction (PSGC code) to the `jurisdiction` column in the `users` table.

- [ ] **Edit User Role:**
  - [ ] Add a mechanism (e.g., an "Edit" button next to each user) to change a user's role.

## 2. Implement Report Moderation

A new component and route (`/admin/reports`) are needed to allow admins to manage all incoming reports.

- [ ] **Create Report Moderation Component:**
  - [ ] Build a new component that fetches and displays *all* reports, bypassing the RLS policies for authorities.
  - [ ] Add this component to the `AdminDashboardPage.jsx`.

- [ ] **Assign/Re-assign Jurisdiction:**
  - [ ] For each report in the list, add a dropdown of all jurisdictions.
  - [ ] Implement the logic to update the `jurisdiction` column for a report when an admin selects a value.

- [ ] **Delete Reports:**
  - [ ] Add a "Delete" button for each report.
  - [ ] Implement the logic to delete reports that are identified as spam or inappropriate.
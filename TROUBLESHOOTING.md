# Troubleshooting Local Development Issues

This guide provides solutions to common issues you might encounter while setting up your local development environment for SafePin.

## Issue 1: Admin Login Redirects to Homepage

**Symptom:** After logging in with an admin account created in the Supabase Studio, you are redirected to the homepage instead of the admin dashboard.

**Cause:** When you create a user directly in the Supabase Studio (Authentication > Users), the trigger that creates their profile in the `public.users` table does not have access to the `role` metadata. As a result, the user is assigned a default role of `'user'`, which does not have permission to access the admin dashboard.

**Solution:** Manually update the user's role in the `public.users` table by running the following SQL command in the Supabase Studio SQL Editor.

1.  Open your local Supabase Studio.
2.  Navigate to the **SQL Editor**.
3.  Run the following command, replacing `'your-admin-email@example.com'` with the email of your admin user:

```sql
-- Update the role for your admin user
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

After running this command, log out and log back in. You should now be correctly redirected to the admin dashboard.

## Issue 2: Clicking on Map Does Not Assign Barangay

**Symptom:** When creating a report, clicking on the map does not populate the "Assigned Barangay" field.

**Cause:** This feature relies on a database function that performs a geospatial query against the `jurisdiction_boundaries` table. This table is currently empty. Although a migration exists to allow data import, the data itself has not yet been loaded.

**Solution:** Import your jurisdiction data from your CSV file into the `jurisdiction_boundaries` table using the Supabase Studio.

1.  Navigate to the **Table Editor** in your Supabase Studio.
2.  Select the `jurisdiction_boundaries` table from the list.
3.  Click the **"Insert"** button in the top right, and then select **"Import data from CSV"**.
4.  Upload your CSV file containing the jurisdiction boundaries.
5.  Ensure the columns from your CSV file correctly map to the table columns (`id`, `psgc_code`, `barangay_name`, `city_name`, `geom`).
6.  Complete the import process.

Once the data is imported, the map-click feature on the report page should start working correctly.
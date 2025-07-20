# Supabase Functions Setup

This guide explains how to deploy the Edge Function for deleting report images and how to set up the database components for sanitizing report data.

## 1. Deploy the `delete-report-image` Edge Function

You'll need the Supabase CLI to deploy the function.

1.  **Install the Supabase CLI:**
    If you don't have it, install it by following the instructions on the [official Supabase documentation](https://supabase.com/docs/guides/cli).

2.  **Log in to the Supabase CLI:**
    ```bash
    supabase login
    ```

3.  **Link your project:**
    Navigate to your project's root directory in the terminal and run:
    ```bash
    supabase link --project-ref YOUR_PROJECT_ID
    ```
    Replace `YOUR_PROJECT_ID` with the ID of your Supabase project.

4.  **Deploy the function:**
    ```bash
    supabase functions deploy delete-report-image
    ```

## 2. Create the Database Webhook

This webhook will trigger the `delete-report-image` function whenever a report is deleted.

1.  Go to your Supabase Project Dashboard.
2.  Navigate to **Database** > **Webhooks**.
3.  Click **Create a new webhook**.
4.  In the **Name** field, enter `Delete Report Image`.
5.  For the **Table**, select `reports`.
6.  For the **Events**, check `DELETE`.
7.  For the **Type**, select `HTTP Request`.
8.  In the **URL** field, enter the URL of your deployed Edge Function. It will look like this:
    `https://YOUR_PROJECT_ID.supabase.co/functions/v1/delete-report-image`
9.  Leave the **Headers** empty.
10. Click **Create webhook**.

## 3. A Note on Data Sanitization

The application relies on Supabase's built-in parameterized queries to prevent SQL injection. All data insertion and updates should be handled through the Supabase client library, which automatically and safely handles parameterization.

**Do not** use manual string concatenation to build queries, and **do not** create custom sanitization functions in Postgres, as these are prone to error and can be easily bypassed. The client library is the secure and recommended way to interact with the database.
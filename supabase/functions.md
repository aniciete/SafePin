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

## 3. Create the Sanitization Function in Postgres

This Postgres function will automatically sanitize the report data before it is inserted into the database. Run the following SQL in your Supabase SQL Editor.

```sql
-- A simple function to remove potentially harmful characters
CREATE OR REPLACE FUNCTION public.sanitize(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Replace with a more robust sanitization library if needed
    RETURN regexp_replace(input_text, '[<>&"''/]', '', 'g');
END;
$$ LANGUAGE plpgsql;

-- A trigger function to sanitize report data before insertion
CREATE OR REPLACE FUNCTION public.sanitize_report_data()
RETURNS TRIGGER AS $$
BEGIN
    NEW.incident_type := public.sanitize(NEW.incident_type);
    NEW.severity := public.sanitize(NEW.severity);
    NEW.description := public.sanitize(NEW.description);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The trigger that calls the function before a new report is inserted
CREATE TRIGGER on_report_insert_sanitize
    BEFORE INSERT ON public.reports
    FOR EACH ROW EXECUTE PROCEDURE public.sanitize_report_data();
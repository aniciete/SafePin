# Local Supabase Environment Setup Guide

This guide will walk you through the steps to ensure your local Supabase environment is correctly configured and ready for the new database schema.

## 1. Verify Supabase CLI Installation

First, ensure that you have the Supabase CLI installed and are logged in.

```bash
supabase -v
```

If it's not installed, you can install it with:

```bash
npm i -g supabase
```

Then, log in to your Supabase account:

```bash
supabase login
```

## 2. Link Your Project

If you haven't already, link your local project to your Supabase project. You can find your project reference ID in your Supabase project's dashboard URL: `https://app.supabase.com/project/<your-ref>`.

```bash
supabase link --project-ref <your-ref>
```

## 3. Start Your Local Environment

Start your local Supabase stack. This will spin up a local instance of the database, Auth, and Storage.

```bash
supabase start
```

## 4. Create Your `.env` File

Your application needs a `.env` file to connect to the local Supabase instance. You can create this file by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and replace the placeholder values with the credentials from the output of the `supabase start` command.

**CRITICAL WARNING:** The credentials in your `.env` file determine which database you connect to.
- For **local development**, these values **MUST** come from the `supabase start` command output. The URL will start with `http://127.0.0.1:54321`.
- For **production**, you will use the keys from your live Supabase project dashboard. **Do not use your production keys for local development.**

Here is an example of a correctly configured `.env` file for local development:

```
VITE_SUPABASE_URL="http://127.0.0.1:54321"
VITE_SUPABASE_ANON_KEY="YOUR_LOCAL_ANON_KEY"
VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
SERVICE_ROLE_KEY="YOUR_LOCAL_SERVICE_ROLE_KEY"
VITE_RECAPTCHA_SITE_KEY="YOUR_RECAPTCHA_SITE_KEY"
RECAPTCHA_SECRET_KEY="YOUR_RECAPTCHA_SECRET_KEY"
DB_PASSWORD="YOUR_DB_PASSWORD"
```

## 5. Apply the New Schema

Now that your local environment is running, you can apply the new schema by running the migration files.

```bash
supabase db reset
```

This command will:
1.  Drop the existing local database.
2.  Recreate it.
3.  Apply all migrations from the `supabase/migrations` directory.

## 6. Open Supabase Studio

You can use Supabase Studio to view and manage your local database. To open it, run the following command:

```bash
supabase studio open
```

This will automatically open the local Studio URL in your default web browser. You can also get the URL by running `supabase status`.

## 7. Verify the Schema

After the migration has been applied, you can verify that the new schema has been created correctly by connecting to your local database and inspecting the tables. You can find the connection string in the output of the `supabase start` command.

You can use a tool like `psql` or a GUI like DBeaver or Postico to connect to the database.

Once connected, you can run the following queries to verify the schema:

*   **List tables:**
    ```sql
    \dt public.*
    ```
*   **List views:**
    ```sql
    \dv public.*
    ```
*   **List functions:**
    ```sql
    \df public.*
    ```

## 8. Run the Application

Once you've verified that the schema has been created correctly, you can run the application locally.

```bash
npm run dev
```

The application should now be running with the new database schema.

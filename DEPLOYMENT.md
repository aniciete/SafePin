# Production Deployment Plan (v4 - Corrected)

This document outlines the simplified process for promoting the **`safepin-staging`** project (`clfsoexpcrfrlijwqsqu`) to production and deploying the frontend to Netlify.

## Deployment Strategy
Instead of migrating to a new Supabase project, we are promoting the current, stable `safepin-staging` project to be the official production environment. This eliminates the need for database migrations and reduces deployment risk.

## Deployment Steps

### 1. Production Project Setup (Supabase)
1.  **Rename Project:** In the Supabase dashboard for `clfsoexpcrfrlijwqsqu`, go to **Project Settings > General** and rename the project to something that clearly identifies it as production (e.g., "SafePin Production").
2.  **Invite Team:** In **Project Settings > Team**, invite all necessary team members.
3.  **Enable Backups:** For production projects, it is critical to have robust backups. Go to **Database > Backups** and enable Point-in-Time Recovery (PITR). This is a paid feature but essential for production databases.
4.  **Set Production Secrets:**
    ```bash
    # Ensure you are logged in and linked to the correct project
    supabase secrets set --env-file ./.env.production
    ```
5.  **Deploy Edge Functions:**
    ```bash
    supabase functions deploy --project-ref clfsoexpcrfrlijwqsqu
    ```

### 2. Frontend Deployment (Netlify)
6.  **Build the Frontend:**
    ```bash
    npm run build
    ```
7.  **Deploy to Netlify:**
    ```bash
    # Ensure you are logged in to the Netlify CLI
    netlify deploy --dir=dist --prod
    ```
8.  **Configure Netlify & Supabase:**
    *   In the Netlify UI, go to **Site settings > Build & deploy > Environment** and add your production environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GOOGLE_MAPS_API_KEY`).
    *   In the Supabase Dashboard, go to **Authentication > URL Configuration** and set the **Site URL** to your production Netlify URL.

### 3. Final Verification
9.  **Perform Production Smoke Test:**
    - [ ] Access the production URL and check for console errors.
    - [ ] Submit a new anonymous report with an image.
    - [ ] Verify the report can be tracked with the generated code.
    - [ ] Log in as an admin user.
    - [ ] From the admin dashboard, create a new authority user.
    - [ ] Log out and log in as the new authority user.
    - [ ] Confirm the authority user can view reports assigned to their jurisdiction.
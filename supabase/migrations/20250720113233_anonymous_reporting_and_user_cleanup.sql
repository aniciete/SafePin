-- Phase 1: Preserve reports from regular users
-- Set user_id to NULL for reports created by users with the 'regular' role.
-- This is necessary before deleting the users to avoid foreign key constraint violations.
UPDATE public.reports
SET user_id = NULL
WHERE user_id IN (SELECT id FROM public.users WHERE role = 'regular');

-- Phase 2: Delete regular users
-- Remove all users who have the 'regular' role from the auth.users table.
-- This will cascade-delete their corresponding entries in the public.users table.
DELETE FROM auth.users
WHERE id IN (SELECT id FROM public.users WHERE role = 'regular');

-- Phase 3: Modify the reports table
-- Make the user_id column optional to allow for anonymous reports.
ALTER TABLE public.reports
ALTER COLUMN user_id DROP NOT NULL;
-- Drop all admin-related policies from all tables.
-- This is an exhaustive list to ensure a clean slate.
DROP POLICY IF EXISTS "Admins have full access to reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile, and admins can view all" ON public.users;
DROP POLICY IF EXISTS "Users can view profiles" ON public.users;

-- Drop and recreate the one policy we want to keep for non-admin users.
-- This makes the script runnable multiple times.
DROP POLICY IF EXISTS "Authenticated users can see their own profile" ON public.users;
CREATE POLICY "Authenticated users can see their own profile"
ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
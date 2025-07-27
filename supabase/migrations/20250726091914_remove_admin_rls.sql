-- Drop all admin-related policies from all tables.
-- We are abandoning the RLS-for-admins approach.
DROP POLICY IF EXISTS "Admins have full access to reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users, users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view profiles" ON public.users;
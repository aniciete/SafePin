-- ========== STEP 1: CLEAN UP ALL PREVIOUS POLICIES AND HELPERS ==========

-- Drop all potentially conflicting policies on the users table
DROP POLICY IF EXISTS "Users can view profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;

-- Drop all potentially conflicting policies on the reports table
DROP POLICY IF EXISTS "Admins have full access to reports" ON public.reports;

-- Drop all helper functions, as they are no longer needed
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.get_my_role();

-- ========== STEP 2: CREATE THE DEFINITIVE, CORRECT RLS POLICIES ==========

-- This is the final, working policy for the 'users' table.
-- It allows an admin to see all users by directly checking their role in the public.users table.
CREATE POLICY "Admins can view all users, users can view their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (
  -- Rule 1: A user can see their own profile.
  (auth.uid() = id) 
  OR
  -- Rule 2: A user can see ALL rows IF their own role in the users table is 'admin'.
  ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
);

-- This is the final, working policy for the 'reports' table.
-- It uses the same direct pattern to grant admins full access.
CREATE POLICY "Admins have full access to reports"
ON public.reports
FOR ALL -- This covers SELECT, INSERT, UPDATE, DELETE
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
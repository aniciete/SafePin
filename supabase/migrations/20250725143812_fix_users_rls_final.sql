-- Step 1: Create a privileged helper function to check if the current user is an admin.
-- Because it is SECURITY DEFINER, it runs as the user who created it (postgres)
-- and can bypass RLS to read the users table without causing recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
-- Set a secure search path to prevent hijacking.
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'authenticated' THEN
    RETURN (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin';
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- Step 2: Drop the old, faulty policy that causes the infinite recursion error.
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;

-- Step 3: Create the new, correct policy that uses the helper function.
-- This policy is now non-recursive and will work correctly.
CREATE POLICY "Users can view user profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    -- A user can always see their own profile row.
    (auth.uid() = id)
    OR
    -- A user can see ALL rows IF our secure helper function says they are an admin.
    (public.is_admin())
  );
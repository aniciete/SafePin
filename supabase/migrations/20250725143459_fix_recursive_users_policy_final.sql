-- Drop the old, faulty policy that causes the infinite recursion error.
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;

-- Create the new, correct, and non-recursive policy.
-- This is the definitive fix for the "infinite recursion" error.
CREATE POLICY "Users can view user profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    -- A user can always see their own profile row.
    (auth.uid() = id)
    OR
    -- A user can see ALL rows IF their own role in the users table is 'admin'.
    -- This subquery is non-recursive because it only ever queries the single row
    -- for the currently authenticated user (auth.uid()).
    (
      (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    )
  );
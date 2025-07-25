-- Drop the old, faulty policy
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;

-- Create the new, correct policy
-- This policy uses a non-recursive subquery to check the current user's role.
CREATE POLICY "Users can view user profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    -- A user can always see their own profile row.
    (auth.uid() = id)
    OR
    -- A user can see ALL rows IF their own role in the users table is 'admin'.
    (
      (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    )
  );
-- Drop the old, recursive policy on the users table.
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;

-- Create a new, non-recursive policy.
-- This policy allows users to see their own profile,
-- and allows admins to see everyone's profile.
-- It gets the user's role directly from their session JWT, avoiding the infinite loop.
CREATE POLICY "Users can view user profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    -- Users can see their own row
    (auth.uid() = id)
    OR
    -- Users with the 'admin' role can see all rows
    ((auth.jwt() ->> 'user_role')::text = 'admin')
  );
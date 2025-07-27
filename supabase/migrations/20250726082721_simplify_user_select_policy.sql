-- Drop the old, complex policy.
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;

-- Create a new, simpler policy.
-- This policy has two simple rules and no subqueries.
CREATE POLICY "Users can view their own profile, and admins can view all"
ON public.users
FOR SELECT
TO authenticated
USING (
  -- Rule 1: A user can see their own row. This is the most important part.
  (auth.uid() = id) 
  OR
  -- Rule 2: A user can see ANY row if their JWT claims they are an admin.
  -- This is safe because we have a trigger that syncs the role to the JWT.
  ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
);
-- Drop the old, recursive policy.
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile, and admins can view all" ON public.users; -- Drop any other named variations

-- Create the new, correct policy that relies on the JWT.
-- This is non-recursive because it does not query the 'users' table.
CREATE POLICY "Users can view profiles"
ON public.users
FOR SELECT
TO authenticated
USING (
  -- Rule 1: A user can see their own profile row.
  (auth.uid() = id) 
  OR
  -- Rule 2: A user can see ALL rows if their JWT has the 'admin' role claim.
  ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
);
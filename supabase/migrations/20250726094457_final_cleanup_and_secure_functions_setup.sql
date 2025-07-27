-- Drop the faulty admin RLS policies.
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.users;
-- (Add any other variations you might have created)

-- Keep the simple policy for users to see themselves.
CREATE POLICY "Authenticated users can see their own profile"
ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);

-- Drop all the helper functions we created. They are no longer needed.
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.get_my_role();
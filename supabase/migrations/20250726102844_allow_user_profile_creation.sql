-- This policy explicitly allows new rows to be inserted into the public.users table.
-- It is scoped to the 'postgres' role, which is the role used by SECURITY DEFINER functions
-- and the Supabase backend itself. This is a secure way to allow our trigger to work.
CREATE POLICY "Allow user profile creation by admin trigger"
ON public.users
FOR INSERT
TO postgres -- This is the key. We are granting permission to the database's own superuser.
WITH CHECK (true);
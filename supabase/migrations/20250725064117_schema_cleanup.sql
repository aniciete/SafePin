-- 1. Remove the redundant trigger function and the 'regular' default
DROP FUNCTION IF EXISTS public.create_user_profile();
ALTER TABLE public.users ALTER COLUMN role DROP DEFAULT;

-- 2. Temporarily drop ALL RLS policies that will be recreated later. This makes the script runnable even after partial failures.
DROP POLICY IF EXISTS "Allow admins full access" ON public.reports;
DROP POLICY IF EXISTS "Allow authorities to view reports in their jurisdiction" ON public.reports;
DROP POLICY IF EXISTS "Allow authorities to update reports in their jurisdiction" ON public.reports;
DROP POLICY IF EXISTS "Allow anonymous report creation" ON public.reports; -- <-- ADDED THIS LINE
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;
DROP POLICY IF EXISTS "Allow admins full access to storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow authorities to view images in their jurisdiction" ON storage.objects;

-- 3. Temporarily drop the CHECK constraint that depends on the users.role column.
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS "admin_cannot_have_jurisdiction";

-- 4. Temporarily drop the dashboard function that depends on the users.role column.
DROP FUNCTION IF EXISTS public.get_user_stats();

-- 5. Perform the enum and column type modification now that all dependencies are removed.
CREATE TYPE public.user_role_new AS ENUM ('admin', 'authority');
ALTER TABLE public.users ALTER COLUMN role TYPE public.user_role_new USING role::text::public.user_role_new;
DROP TYPE public.user_role;
ALTER TYPE public.user_role_new RENAME TO user_role;

-- 6. Recreate the CHECK constraint using the new enum type.
ALTER TABLE public.users
  ADD CONSTRAINT "admin_cannot_have_jurisdiction"
  CHECK (NOT (role = 'admin' AND jurisdiction IS NOT NULL));

-- 7. Recreate the dashboard function using the new enum type.
CREATE OR REPLACE FUNCTION "public"."get_user_stats"() RETURNS TABLE("role" "public"."user_role", "count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.role,
        count(u.id)
    FROM
        public.users u
    GROUP BY
        u.role;
END;
$$;

-- 8. Recreate all the RLS policies using the new, correct enum type.
-- Recreating policies for the 'reports' table:
CREATE POLICY "Allow admins full access" ON public.reports
  FOR ALL
  USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Allow authorities to view reports in their jurisdiction" ON public.reports
  FOR SELECT
  USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND jurisdiction = public.get_user_jurisdiction() );

CREATE POLICY "Allow authorities to update reports in their jurisdiction" ON public.reports
  FOR UPDATE
  USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND jurisdiction = public.get_user_jurisdiction() );

CREATE POLICY "Allow anonymous report creation" ON public.reports
  FOR INSERT
  WITH CHECK ( (auth.role() = 'anon') );

-- Recreating policy for the 'users' table:
CREATE POLICY "Users can view user profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING ( (auth.uid() = id) OR ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin') );

-- Recreating policies for the 'storage.objects' table:
CREATE POLICY "Allow admins full access to storage" ON storage.objects
  FOR ALL
  USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Allow authorities to view images in their jurisdiction" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'reports' AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND
    (SELECT jurisdiction FROM public.reports WHERE tracking_code = (storage.foldername(name))[1]) = public.get_user_jurisdiction()
  );
-- Helper function to get the jurisdiction of the currently authenticated user
CREATE OR REPLACE FUNCTION public.get_user_jurisdiction()
RETURNS TEXT AS $$
DECLARE
  user_jurisdiction TEXT;
BEGIN
  SELECT jurisdiction INTO user_jurisdiction
  FROM public.users
  WHERE id = auth.uid();
  RETURN user_jurisdiction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove existing policies on the reports table that are no longer valid
DROP POLICY IF EXISTS "Anyone can create a report" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can view reports" ON public.reports;
DROP POLICY IF EXISTS "Authorities can update report status" ON public.reports;

-- RLS policies for the 'reports' table
-- 1. Admins can do anything.
CREATE POLICY "Allow admins full access" ON public.reports
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 2. Authorities can view reports in their own jurisdiction.
CREATE POLICY "Allow authorities to view reports in their jurisdiction" ON public.reports
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND jurisdiction = public.get_user_jurisdiction());

-- 3. Authorities can update reports in their own jurisdiction.
CREATE POLICY "Allow authorities to update reports in their jurisdiction" ON public.reports
  FOR UPDATE USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND jurisdiction = public.get_user_jurisdiction());

-- 4. Allow anonymous users to create reports.
CREATE POLICY "Allow anonymous report creation" ON public.reports
  FOR INSERT WITH CHECK (auth.role() IS NULL OR auth.role() = 'anon');

-- RLS policies for the 'storage.objects' table
-- 1. Admins can do anything.
CREATE POLICY "Allow admins full access to storage" ON storage.objects
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 2. Authorities can view images from reports in their jurisdiction.
CREATE POLICY "Allow authorities to view images in their jurisdiction" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reports' AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND
    (SELECT jurisdiction FROM public.reports WHERE tracking_code = name) = public.get_user_jurisdiction()
  );

-- 3. Allow anonymous users to upload images.
CREATE POLICY "Allow anonymous image uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.role() IS NULL OR auth.role() = 'anon');
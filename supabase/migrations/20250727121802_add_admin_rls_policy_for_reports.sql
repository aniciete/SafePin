-- supabase/migrations/YYYYMMDDHHMMSS_add_admin_rls_policy_for_reports.sql

CREATE POLICY "Allow admin full access to reports"
ON public.reports
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

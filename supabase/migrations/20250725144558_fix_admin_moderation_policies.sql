-- Drop the old admin policy on the reports table.
DROP POLICY IF EXISTS "Allow admins full access" ON public.reports;

-- Recreate the policy, explicitly granting it for ALL actions (SELECT, INSERT, UPDATE, DELETE).
-- The USING clause applies to all actions, ensuring admins can modify any row.
CREATE POLICY "Admins have full access to reports" ON public.reports
  FOR ALL -- This applies to SELECT, INSERT, UPDATE, and DELETE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );
-- Drop the old, faulty admin policy on the reports table.
DROP POLICY IF EXISTS "Admins have full access to reports" ON public.reports;

-- Create the new, correct policy that uses the reliable JWT check.
CREATE POLICY "Admins have full access to reports"
ON public.reports
FOR ALL -- This applies to SELECT, INSERT, UPDATE, DELETE
USING (
  -- A user can do anything to the reports table IF their JWT claims they are an admin.
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
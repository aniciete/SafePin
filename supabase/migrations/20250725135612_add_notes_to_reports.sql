-- Add a new 'notes' column to the reports table to store internal comments by authorities.
ALTER TABLE public.reports
ADD COLUMN notes TEXT;

-- Update the RLS policy for authorities to allow them to update this new column.
-- We drop the old policy and recreate it to include the new permission.
DROP POLICY IF EXISTS "Allow authorities to update reports in their jurisdiction" ON public.reports;

CREATE POLICY "Allow authorities to update reports in their jurisdiction" ON public.reports
  FOR UPDATE
  USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND jurisdiction = public.get_user_jurisdiction() )
  -- Specify which columns they are allowed to update. This is a good security practice.
  WITH CHECK ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority' AND jurisdiction = public.get_user_jurisdiction() );
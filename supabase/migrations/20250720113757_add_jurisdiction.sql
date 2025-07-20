-- Add jurisdiction column to the users table
-- This will store the PSGC code for the area an authority user is responsible for.
ALTER TABLE public.users
ADD COLUMN jurisdiction TEXT;

-- Add jurisdiction column to the reports table
-- This will be assigned by an admin to route the report to the correct authority.
ALTER TABLE public.reports
ADD COLUMN jurisdiction TEXT;

-- Create an index on the new columns to speed up lookups
CREATE INDEX idx_users_jurisdiction ON public.users(jurisdiction);
CREATE INDEX idx_reports_jurisdiction ON public.reports(jurisdiction);
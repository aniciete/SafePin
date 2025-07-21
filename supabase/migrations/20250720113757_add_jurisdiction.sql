
-- Add jurisdiction column to the reports table
-- This will be assigned by an admin to route the report to the correct authority.
ALTER TABLE public.reports
ADD COLUMN jurisdiction TEXT;

-- Create an index on the new columns to speed up lookups
CREATE INDEX idx_users_jurisdiction ON public.users(jurisdiction);
CREATE INDEX idx_reports_jurisdiction ON public.reports(jurisdiction);
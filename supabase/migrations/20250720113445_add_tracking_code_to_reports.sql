-- Add a new column to the reports table to store the unique tracking code
ALTER TABLE public.reports
ADD COLUMN tracking_code TEXT UNIQUE;

-- Create an index on the new column to speed up lookups
CREATE INDEX idx_reports_tracking_code ON public.reports(tracking_code);
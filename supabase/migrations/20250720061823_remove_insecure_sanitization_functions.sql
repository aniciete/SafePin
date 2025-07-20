-- Drop the trigger from the reports table
DROP TRIGGER IF EXISTS on_report_insert_sanitize ON public.reports;

-- Drop the trigger function
DROP FUNCTION IF EXISTS public.sanitize_report_data();

-- Drop the sanitization function
DROP FUNCTION IF EXISTS public.sanitize(input_text TEXT);
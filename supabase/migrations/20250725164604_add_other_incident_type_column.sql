-- Add a new column to store the custom text when incident_type is 'Other'.
-- It is nullable because it will only have a value in specific cases.
ALTER TABLE public.reports
ADD COLUMN incident_type_other TEXT;

-- Add a CHECK constraint to enforce our business logic:
-- The new column can ONLY have a value if the incident_type is 'Other'.
-- It MUST be NULL for all other incident types.
ALTER TABLE public.reports
ADD CONSTRAINT incident_type_other_check
CHECK (
  (incident_type = 'Other' AND incident_type_other IS NOT NULL AND incident_type_other <> '')
  OR
  (incident_type <> 'Other' AND incident_type_other IS NULL)
);
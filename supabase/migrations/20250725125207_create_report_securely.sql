-- We need the http extension to make external API calls from Postgres
CREATE EXTENSION IF NOT EXISTS http;

-- This is the main function that will handle everything.
CREATE OR REPLACE FUNCTION public.create_report_securely(
    recaptcha_token TEXT,
    incident_type TEXT,
    severity TEXT,
    description TEXT,
    location JSONB,
    image_path TEXT,
    tracking_code TEXT,
    jurisdiction TEXT,
    contact_info TEXT
)
RETURNS json
LANGUAGE plpgsql
-- CRITICAL: This function runs with the privileges of the user who DEFINED it (the postgres role),
-- not the user who CALLS it (the anonymous user). This allows it to bypass RLS for the INSERT.
SECURITY DEFINER
AS $$
DECLARE
    recaptcha_response jsonb;
    recaptcha_secret_key text;
BEGIN
    -- 1. Retrieve the secret key from Supabase's encrypted secrets vault.
    -- This is the modern, correct way to access secrets.
    recaptcha_secret_key := vault.get_secret('RECAPTCHA_SECRET_KEY');
    IF recaptcha_secret_key IS NULL THEN
        RAISE EXCEPTION 'reCAPTCHA secret key not found in Supabase secrets vault.';
    END IF;

    -- 2. Verify the reCAPTCHA token by calling Google's API
    SELECT content::jsonb
    INTO recaptcha_response
    FROM http_post(
        'https://www.google.com/recaptcha/api/siteverify',
        'secret=' || recaptcha_secret_key || '&response=' || recaptcha_token,
        'application/x-www-form-urlencoded'
    );

    -- 3. Check if the verification was successful and the score is high enough
    IF NOT (recaptcha_response->>'success')::boolean OR (recaptcha_response->>'score')::numeric < 0.5 THEN
        RAISE EXCEPTION 'reCAPTCHA verification failed. Please try again.';
    END IF;

    -- 4. If verification is successful, insert the report into the table.
    -- Because this is a SECURITY DEFINER function, it has permission to insert.
    INSERT INTO public.reports(incident_type, severity, description, location, image_path, tracking_code, jurisdiction, contact_info)
    VALUES (incident_type::public.incident_type, severity, description, location, image_path, tracking_code, jurisdiction, contact_info);

    -- 5. Return a success message
    RETURN json_build_object('success', true, 'message', 'Report created successfully.');
END;
$$;
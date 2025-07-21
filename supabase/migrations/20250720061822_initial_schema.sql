-- Create ENUM types for report status and incident types
DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending_verification', 'verified', 'rejected', 'archived', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE incident_type AS ENUM (
        'Theft', 'Assault', 'Vandalism', 'Harassment', 'Robbery',
        'Burglary', 'Fire', 'Medical Emergency', 'Suspicious Activity',
        'Environmental Hazard', 'Road Accident', 'Other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create a table for user roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('regular', 'admin', 'authority');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create a table for users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    role user_role DEFAULT 'regular',
    jurisdiction TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    onboarding_completed BOOLEAN DEFAULT false
);

-- Create a table for reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    anonymous_user_id TEXT, -- For anonymous reports
    location JSONB,
    incident_type incident_type, -- Use ENUM type
    severity TEXT,
    description TEXT,
    image_path TEXT, -- Changed from image_url to image_path
    status report_status DEFAULT 'pending_verification', -- Use ENUM type
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ
);

-- Create a table for rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE,
    count INT,
    last_updated_at TIMESTAMPTZ
);
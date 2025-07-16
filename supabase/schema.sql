-- Phase 1: Database Schema

-- 1. Create a table for user roles
CREATE TYPE user_role AS ENUM ('regular', 'admin', 'authority');

-- 2. Create a table for users
-- This table will store public user data.
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    role user_role DEFAULT 'regular',
    created_at TIMESTAMPTZ DEFAULT now(),
    onboarding_completed BOOLEAN DEFAULT false
);

-- 3. Create a table for reports
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    anonymous_user_id TEXT, -- For anonymous reports
    location JSONB,
    incident_type TEXT,
    severity TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'pending_verification',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ
);

-- 4. Create a table for rate limiting
CREATE TABLE public.rate_limits (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE,
    count INT,
    last_updated_at TIMESTAMPTZ
);

-- Phase 2: Authentication & Security

-- 1. Function to create a new user profile upon sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (new.id, new.email, 'regular'); -- Default role is 'regular'
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger to call the function on new user sign-up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Row-Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Policies for 'users' table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.users
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Policies for 'reports' table
CREATE POLICY "Anyone can create a report" ON public.reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view reports" ON public.reports
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authorities can update report status" ON public.reports
    FOR UPDATE USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'authority'
    ) WITH CHECK (
        -- Authorities can only update specific fields
        (SELECT jsonb_object_keys(to_jsonb(t))) <@ ARRAY['status', 'verified_by', 'verified_at']::text[]
    );

-- Policies for 'rate_limits' table
-- Only allow server-side access (e.g., from Edge Functions)
CREATE POLICY "Allow server-side access to rate limits" ON public.rate_limits
    FOR ALL USING (false);

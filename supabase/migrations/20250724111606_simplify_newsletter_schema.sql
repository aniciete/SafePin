-- Drop existing newsletter table and related objects if they exist
DROP TRIGGER IF EXISTS update_newsletter_subscriptions_updated_at ON public.newsletter_subscriptions;
DROP FUNCTION IF EXISTS public.update_newsletter_subscriptions_updated_at();
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Anyone can update their own subscription" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Only admins can read newsletter subscriptions" ON public.newsletter_subscriptions;
DROP TABLE IF EXISTS public.newsletter_subscriptions;

-- Create the simplified newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    consent_timestamp TIMESTAMP WITH TIME ZONE, -- The only audit field needed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for clarity
COMMENT ON TABLE public.newsletter_subscriptions IS 'Stores email addresses for newsletter subscriptions.';
COMMENT ON COLUMN public.newsletter_subscriptions.is_active IS 'True if the user is currently subscribed.';
COMMENT ON COLUMN public.newsletter_subscriptions.consent_timestamp IS 'Timestamp of when the user gave consent.';

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public access for subscribing (inserting)
CREATE POLICY "Public can subscribe to the newsletter"
ON public.newsletter_subscriptions
FOR INSERT WITH CHECK (true);

-- Allow anonymous users to update their own subscription to unsubscribe
-- Note: This is a simplified policy. In a real-world scenario,
-- you would likely have a more secure way to handle unsubscribes,
-- such as a unique tokenized link sent to the user's email.
CREATE POLICY "Users can unsubscribe"
ON public.newsletter_subscriptions
FOR UPDATE USING (true);

-- Restrict read access to service_role only
CREATE POLICY "Admins can view subscriptions"
ON public.newsletter_subscriptions
FOR SELECT USING (false); -- Effectively blocks reads from anon and authenticated roles
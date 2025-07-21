ALTER TABLE public.users
ADD CONSTRAINT admin_cannot_have_jurisdiction
CHECK (NOT (role = 'admin' AND jurisdiction IS NOT NULL));
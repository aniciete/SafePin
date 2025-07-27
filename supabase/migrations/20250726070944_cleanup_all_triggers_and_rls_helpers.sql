-- Drop all RLS policies that we are replacing with the admin client
DROP POLICY IF EXISTS "Admins have full access to reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view user profiles" ON public.users;

-- Drop all helper functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_profile_created ON public.users;
DROP TRIGGER IF EXISTS on_user_profile_updated ON public.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.sync_user_claims();
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.get_my_role();
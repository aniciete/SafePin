-- ========== STEP 1: CLEAN UP ALL PREVIOUS ATTEMPTS ==========
-- Drop the old, unreliable HTTP trigger and any other related functions.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user(); -- In case this old one exists
DROP FUNCTION IF EXISTS public.on_auth_user_created(); -- In case this old one exists

-- ========== STEP 2: CREATE THE NEW, DIRECT TRIGGER FUNCTION ==========
-- This function runs entirely within the database. It is transactional and reliable.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new row into public.users, taking the details from the new auth.users record.
  INSERT INTO public.users (id, email, role, jurisdiction)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    (NEW.raw_user_meta_data->>'jurisdiction')
  );
  RETURN NEW;
END;
$$;

-- ========== STEP 3: ATTACH THE NEW TRIGGER ==========
-- This trigger will fire after a new user is inserted into the auth.users table.
CREATE TRIGGER on_auth_user_created_direct
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
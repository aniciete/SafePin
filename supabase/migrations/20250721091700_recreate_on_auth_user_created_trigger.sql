-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the on_auth_user_created function to correctly insert into public.users
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, jurisdiction)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'jurisdiction'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-link the trigger to the corrected function
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.on_auth_user_created();
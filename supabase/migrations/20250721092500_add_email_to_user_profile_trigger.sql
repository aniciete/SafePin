-- Recreate the on_auth_user_created function to include the user's email
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, jurisdiction)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    NEW.raw_user_meta_data->>'jurisdiction'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
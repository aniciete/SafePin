-- Recreate the on_auth_user_created function to correctly cast the role to the user_role enum
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, jurisdiction)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    NEW.raw_user_meta_data->>'jurisdiction'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
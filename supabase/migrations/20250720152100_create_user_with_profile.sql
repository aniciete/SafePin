-- Enable the pgcrypto extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE OR REPLACE FUNCTION create_user_with_profile(
  email TEXT,
  password TEXT,
  role TEXT,
  jurisdiction TEXT
) RETURNS JSONB AS $$
DECLARE
  new_user_id UUID;
  encrypted_password TEXT;
BEGIN
  -- Create the user in auth.users
  INSERT INTO auth.users (email, encrypted_password, raw_user_meta_data)
  VALUES (email, crypt(password, gen_salt('bf')), jsonb_build_object('role', role))
  RETURNING id INTO new_user_id;

  -- Create the user profile in public.users
  INSERT INTO public.users (id, role, jurisdiction)
  VALUES (new_user_id, role, jurisdiction);

  RETURN jsonb_build_object('id', new_user_id, 'email', email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
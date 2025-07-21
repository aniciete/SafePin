# Resolution of the `create-user` Edge Function Error

This document details the troubleshooting process and final resolution for the "Database error creating new user" error encountered with the `create-user` Edge Function.

## Initial Diagnosis: Race Condition

The initial assumption was that a race condition existed between the `create-user` Edge Function and the `on_auth_user_created` database trigger. Both were attempting to create a user profile in the `public.users` table simultaneously, leading to a primary key constraint violation.

The first fix involved patching the Edge Function to remove the manual insert, relying solely on the database trigger.

**File:** [`supabase/functions/create-user/index.ts`](supabase/functions/create-user/index.ts)

```typescript
// ... (code before the fix)
// Manually insert into public.users since the trigger might not run in this context
const { error: profileError } = await supabaseAdmin
  .from('users')
  .insert({
    id: user.id,
    role: role,
    jurisdiction: jurisdiction,
  });
// ... (code after the fix)
```

This change was deployed, but the error persisted.

## Troubleshooting the Local Environment

Attempts to test the fix locally were hampered by persistent issues with the local Supabase environment, which consistently failed to start with a database error. This led to the decision to move testing to the staging environment. A detailed log of the local troubleshooting steps can be found in [`debug.log`](debug.log).

## Deeper Investigation in Staging

After deploying to the staging environment and using the correct credentials, the error continued. This indicated a deeper problem within the database schema.

An analysis of the migration history revealed the true root cause:

1.  An early migration created a function, `create_user_with_profile`.
2.  Subsequent migrations created the `on_auth_user_created` trigger, which **called** the `create_user_with_profile` function.
3.  A later migration **deleted** the `create_user_with_profile` function, leaving the trigger with a broken reference.

This broken reference was the cause of the generic database error.

## The Final Solution: Correcting the Trigger

The final solution involved a series of migrations to correct the `on_auth_user_created` trigger:

1.  **[`20250721091700_recreate_on_auth_user_created_trigger.sql`](supabase/migrations/20250721091700_recreate_on_auth_user_created_trigger.sql):** This migration was created to drop the old, broken trigger and recreate it with the correct logic to directly insert into the `public.users` table.

2.  **[`20250721092000_fix_user_role_type_cast.sql`](supabase/migrations/20250721092000_fix_user_role_type_cast.sql):** After applying the first fix, a new error emerged from the logs: a type mismatch between the text `role` and the `public.user_role` enum. This final migration corrected the trigger to properly cast the role to the correct type.

```sql
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
```

After applying this final migration, the user creation process was successful.

## Final Testing Command

The following `curl` command can be used to successfully create a new user in the staging environment:

```bash
curl -X POST 'https://tsyowtatzuxbvquhkgyo.supabase.co/functions/v1/create-user' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer [YOUR_STAGING_ANON_KEY]' \
-d '{
  "email": "test-user@example.com",
  "password": "YourSecurePassword123!",
  "role": "admin",
  "jurisdiction": "1380100001"
}'
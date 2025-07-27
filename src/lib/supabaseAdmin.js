import { createClient } from '@supabase/supabase-js';

let supabaseAdmin = null;

/**
 * Returns a Supabase client initialized with the Service Role Key.
 * This client bypasses all RLS policies.
 * It MUST ONLY be used in admin-only components protected by an AuthGuard.
 * The client is created as a singleton to avoid the "Multiple GoTrueClient instances" error.
 */
export const getSupabaseAdmin = () => {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  // Read the variables from process.env, which are populated by the Vite config.
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase URL and Service Role Key are required for the admin client.");
  }

  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // Important: prevent the service role key from being stored in browser local storage.
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  return supabaseAdmin;
};
import { createClient } from '@supabase/supabase-js';

let supabaseAdmin = null;

/**
 * Returns a Supabase client initialized with the Service Role Key.
 * This client bypasses all RLS policies.
 * It MUST ONLY be used in admin-only components protected by an AuthGuard.
 * The client is created as a singleton to avoid the "Multiple GoTrueClient instances" error.
 */
export const getSupabaseAdmin = (jwt) => {
  // If a JWT is provided, create a new client with the user's auth context.
  // This is necessary for calling Edge Functions from the client-side.
  if (jwt) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      throw new Error("Supabase URL and Anon Key are required for the user-context client.");
    }
    return createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    });
  }

  // Otherwise, return the singleton admin client.
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
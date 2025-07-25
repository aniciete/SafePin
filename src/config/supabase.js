import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and anonymous key are required. Make sure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set.',
  );
}

// Create and export a SINGLETON instance of the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
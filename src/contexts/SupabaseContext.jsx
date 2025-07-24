import { createContext, useContext, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  // Use useMemo to ensure the Supabase client is created only once.
  const supabase = useMemo(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.');
    }

    // --- START: NEW, MORE RELIABLE SECURITY CHECK ---
    try {
      // A JWT is composed of three parts separated by dots. The payload is the middle part.
      const payload = JSON.parse(atob(supabaseAnonKey.split('.')[1]));

      // Check the 'role' claim within the JWT payload.
      // The service_role key will have 'service_role' here. The anon key will have 'anon'.
      if (payload.role === 'service_role') {
        throw new Error('FATAL SECURITY ERROR: Attempting to use Service Role Key in the browser. Check your .env file.');
      }
    } catch (e) {
      // This might fail if the key is not a valid JWT, which is also an issue.
      console.error("Could not parse Supabase key. Ensure it's a valid anon key.", e);
      throw new Error('Invalid Supabase key provided. Please check your .env file.');
    }
    // --- END: NEW, MORE RELIABLE SECURITY CHECK ---

    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};
import { createContext, useContext } from 'react';
// Import the singleton instance instead of createClient
import { supabase } from '../config/supabase';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  // The value provided is now the pre-configured singleton instance.
  // No more useMemo, no more creating a new client here.
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
// src/contexts/SupabaseContext.jsx
import { createContext, useContext } from 'react';
import { supabase } from '../config/supabase';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => useContext(SupabaseContext);
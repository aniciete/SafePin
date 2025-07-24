import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useSupabase } from './SupabaseContext';

// Helper function to introduce a short delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { supabase } = useSupabase();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authUser, retries = 3) => {
    if (!authUser) {
      setProfile(null);
      return null;
    }
    try {
      for (let i = 0; i < retries; i++) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error && error.code !== 'PGRST116') { // 'PGRST116' means "not found"
          throw error;
        }

        if (data) {
          setProfile(data);
          return data;
        }
        
        await sleep(250 * (i + 1));
      }
      
      throw new Error("User profile could not be found. This may indicate an RLS or database trigger issue.");

    } catch (error) {
      console.error('[Auth] Error fetching profile:', error.message);
      setProfile(null);
      return null;
    }
  }, [supabase]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchUserProfile(currentUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase, fetchUserProfile]);

  const value = {
    user,
    profile,
    loading,
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { profile: null, error };
      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        return { profile: userProfile, error: null };
      }
      return { profile: null, error: new Error('Login successful but no user object returned.') };
    },
    logout: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
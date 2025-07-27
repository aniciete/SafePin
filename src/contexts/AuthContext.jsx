import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useSupabase } from './SupabaseContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { supabase } = useSupabase();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return null;
    }
  }, [supabase]);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, [supabase, fetchUserProfile]);

  const value = {
    user,
    profile,
    loading,
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { profile: null, error };

      if (data.user) {
        // --- THIS IS THE FIX ---
        // After a successful login, we manually refresh the JWT to ensure
        // the user_metadata (role, jurisdiction) is up-to-date for RLS.
        await supabase.auth.refreshSession();
        
        const userProfile = await fetchUserProfile(data.user);
        return { profile: userProfile, error: null };
      }
      return { profile: null, error: new Error('Login failed: No user data returned.') };
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
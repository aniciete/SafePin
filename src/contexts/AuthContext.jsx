import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useSupabase } from './SupabaseContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { supabase } = useSupabase();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // Initialize loading to true. This is critical for the AuthGuard to work on refresh.
  const [loading, setLoading] = useState(true);

  // This callback remains the same.
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

  // This useEffect is designed to robustly handle the initial page load and session refresh.
  useEffect(() => {
    // 1. Proactively get the session on initial load.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      }
      // 2. Set loading to false only after the initial check is complete.
      setLoading(false);
    });

    // 3. Set up the listener for subsequent auth changes (e.g., SIGNED_OUT).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // This listener primarily handles logouts or token refreshes.
        // The initial session is handled by getSession() above.
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  const value = {
    user,
    profile,
    loading,
    // This login function is designed to work with the LoginForm's redirect logic.
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { profile: null, error };
      if (data.user) {
        // Manually fetch the profile here to return it immediately to the LoginForm.
        // This ensures the redirect happens correctly without a race condition.
        const userProfile = await fetchUserProfile(data.user);
        return { profile: userProfile, error: null };
      }
      return { profile: null, error: new Error('Login failed.') };
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
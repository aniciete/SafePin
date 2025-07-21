// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useSupabase } from './SupabaseContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { supabase } = useSupabase();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (authUser) => {
      setLoading(true); // Start loading
      if (!authUser) {
        setUser(null);
        setProfile(null);
        setLoading(false); // Stop loading if no user
        return;
      }

      setUser(authUser);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false); // Stop loading after fetch is complete
      }
    }, [supabase]);

    useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          fetchUserProfile(session?.user ?? null);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }, [fetchUserProfile]);

  const value = {
    user,
    profile,
    loading,
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { data, error };
      }
      console.log('User:', data.user);
      if (data.user && !data.user.email_confirmed_at) {
        return { data, error: { message: 'Email not confirmed' } };
      }
      if (data.user) {
        await fetchUserProfile(data.user);
      }
      return { data, error };
    },
    loginWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
    logout: () => supabase.auth.signOut(),
    signUp: (email, password, role = 'regular') => supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        },
        email_confirm: false
      }
    }),
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
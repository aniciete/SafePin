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
      return null;
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
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return null;
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
        return { profile: null, error };
      }
      if (data.user && !data.user.email_confirmed_at) {
        return { profile: null, error: { message: 'Email not confirmed' } };
      }
      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        return { profile: userProfile, error: null };
      }
      return { profile: null, error: { message: 'User not found after login.' } };
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
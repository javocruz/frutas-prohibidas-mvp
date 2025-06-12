import { useState, useCallback } from 'react';
import { AuthState, User } from '../types';
import { supabase } from '../lib/supabase';

async function fetchUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    points: data.points,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null
  });

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        throw new Error(error?.message || 'Invalid email or password');
      }
      const profile = await fetchUserProfile(data.user.id);
      if (!profile) throw new Error('User profile not found');
      setState({ user: profile, loading: false, error: null });
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, loading: false, error: null });
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error || !data.user) {
        throw new Error(error?.message || 'Registration failed');
      }
      // Optionally, insert into users table if not handled by Supabase function/trigger
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
        role: 'user',
        points: 0,
      });
      if (insertError) throw new Error(insertError.message);
      const profile = await fetchUserProfile(data.user.id);
      if (!profile) throw new Error('User profile not found');
      setState({ user: profile, loading: false, error: null });
      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw err;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setState({ user: null, loading: false, error: null });
        return null;
      }
      const profile = await fetchUserProfile(data.user.id);
      if (!profile) {
        setState({ user: null, loading: false, error: null });
        return null;
      }
      setState({ user: profile, loading: false, error: null });
      return profile;
    } catch (error) {
      setState({ user: null, loading: false, error: null });
      return null;
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    register,
    checkAuth
  };
}; 
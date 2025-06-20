import { useState, useCallback, useRef } from 'react';
import { AuthState, User } from '../types';
import { supabase } from '../lib/supabase';
import React from 'react';

async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      points: data.points,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });
  const isUpdating = useRef(false);
  const mounted = useRef(true);
  const instanceId = Math.random();
  const checkAuthPromise = useRef<Promise<User | null> | null>(null);

  // Reset isUpdating if component unmounts or mounts
  React.useEffect(() => {
    isUpdating.current = false;
    mounted.current = true;
    return () => {
      mounted.current = false;
      isUpdating.current = false;
    };
  }, []);

  const updateState = useCallback((updates: Partial<AuthState>) => {
    if (!mounted.current) return;
    setState(prev => {
      // If we're updating while another operation is in progress, merge the updates
      return { ...prev, ...updates };
    });
  }, []);

  const checkAuth = useCallback(async () => {
    // If we're already checking auth, return the existing promise
    if (checkAuthPromise.current) {
      return checkAuthPromise.current;
    }
    
    // If we're updating, wait for it to complete
    if (isUpdating.current) {
      return null;
    }

    isUpdating.current = true;
    updateState({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        updateState({ user: null, loading: false, error: null });
        return null;
      }
      
      const profile = await fetchUserProfile(data.user.id);
      
      if (!profile) {
        updateState({ user: null, loading: false, error: null });
        return null;
      }
      
      updateState({ user: profile, loading: false, error: null });
      return profile;
    } catch (error) {
      console.error('useAuth: Auth check error:', error);
      updateState({ user: null, loading: false, error: null });
      return null;
    } finally {
      if (mounted.current) {
        isUpdating.current = false;
        checkAuthPromise.current = null;
      }
    }
  }, [updateState]);

  const login = useCallback(async (email: string, password: string) => {
    if (isUpdating.current) {
      throw new Error('Another authentication operation is in progress. Please try again.');
    }
    isUpdating.current = true;
    updateState({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        throw new Error(error?.message || 'Invalid email or password');
      }
      const profile = await fetchUserProfile(data.user.id);
      if (!profile) {
        updateState({ loading: false, error: 'User profile not found in database. Please contact support.' });
        throw new Error('User profile not found in database. Please contact support.');
      }
      updateState({ user: profile, loading: false, error: null });
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error('useAuth: login error', message);
      updateState({ loading: false, error: message });
      throw error;
    } finally {
      if (mounted.current) {
        isUpdating.current = false;
      }
    }
  }, [updateState]);

  const logout = useCallback(async () => {
    if (isUpdating.current) return;
    isUpdating.current = true;
    updateState({ loading: true });
    
    try {
      await supabase.auth.signOut();
      updateState({ user: null, loading: false, error: null });
    } catch (error) {
      console.error('Logout error:', error);
      updateState({ loading: false, error: 'Failed to logout' });
    } finally {
      if (mounted.current) {
        isUpdating.current = false;
      }
    }
  }, [updateState]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    if (isUpdating.current) {
      throw new Error('Another authentication operation is in progress. Please try again.');
    }
    isUpdating.current = true;
    updateState({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        throw error;
      }

      return data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      updateState({ loading: false, error: message });
      throw err;
    } finally {
      if (mounted.current) {
        isUpdating.current = false;
        updateState({ loading: false });
      }
    }
  }, [updateState]);

  // Expose a busy state for UI
  const busy = state.loading || isUpdating.current;

  return {
    ...state,
    login,
    logout,
    register,
    checkAuth,
    busy,
  };
};

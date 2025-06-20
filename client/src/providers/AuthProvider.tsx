import React, { createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { AuthContextType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, error, login, logout, register, checkAuth, busy } = useAuth();
  const initialCheckDone = useRef(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const mounted = useRef(true);

  React.useEffect(() => {
    mounted.current = true;

    const initializeAuth = async () => {
      if (!mounted.current) {
        return;
      }
      
      try {
        if (!initialCheckDone.current) {
          await checkAuth();
          initialCheckDone.current = true;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted.current) {
          setIsInitializing(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted.current) {
        return;
      }

      try {
        if (event === 'SIGNED_IN' && session) {
          if (!loading && (!user || user.id !== session.user.id)) {
            await checkAuth();
          }
        } else if (event === 'SIGNED_OUT') {
          await logout();
        } else if (event === 'USER_UPDATED' && session) {
          await checkAuth();
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        if (mounted.current) {
          await logout();
        }
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [checkAuth, logout]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuth,
    isInitializing,
    busy
  }), [user, loading, error, login, logout, register, checkAuth, isInitializing, busy]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

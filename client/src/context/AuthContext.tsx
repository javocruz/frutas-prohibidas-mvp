import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, ApiResponse } from '../types';
import { api } from '../api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState({ user: null, loading: false, error: null });
        return;
      }

      const response = await api.get<ApiResponse<User>>('/auth/me');
      setState({ user: response.data.data, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: 'Authentication failed' });
      localStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.data.token);
      setState({ user: response.data.data.user, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Invalid email or password',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setState({ user: null, loading: false, error: null });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', response.data.data.token);
      setState({ user: response.data.data.user, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Registration failed',
      }));
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
import { useState, useCallback } from 'react';
import { User, AuthState } from '../types';
import { mockUsers } from '../data/mockData';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null
  });

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user in mock data
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;
      
      // Simulate token
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      
      setState({ user: userWithoutPassword, loading: false, error: null });
      return userWithoutPassword;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setState({ user: null, loading: false, error: null });
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        role: 'user',
        points: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Simulate token
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      
      setState({ user: userWithoutPassword, loading: false, error: null });
      return userWithoutPassword;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    // Don't set loading state if we already have a user
    if (state.user) return state.user;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const token = localStorage.getItem('token');
      if (!token) {
        setState({ user: null, loading: false, error: null });
        return null;
      }

      // For mock purposes, return the first user
      const { password: _, ...userWithoutPassword } = mockUsers[0];
      setState({ user: userWithoutPassword, loading: false, error: null });
      return userWithoutPassword;
    } catch (error) {
      setState({ user: null, loading: false, error: null });
      return null;
    }
  }, [state.user]); // Only depend on state.user

  return {
    ...state,
    login,
    logout,
    register,
    checkAuth
  };
}; 
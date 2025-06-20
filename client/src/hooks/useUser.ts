import { useState, useEffect, useCallback } from 'react';
import { Metrics } from '../types';
import { useAuthContext } from '../providers/AuthProvider';
import { metricsService } from '../services/metricsService';

interface UserState {
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
}

export const useUser = () => {
  const { user } = useAuthContext();
  const [state, setState] = useState<UserState>({
    metrics: null,
    loading: false,
    error: null,
  });

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setState({
        metrics: null,
        loading: false,
        error: null,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const metrics = await metricsService.getUserMetrics(user.id);
      setState(prev => ({ ...prev, metrics, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user data',
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    ...state,
    fetchUserData,
  };
};

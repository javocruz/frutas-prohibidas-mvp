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
    if (!user) return;
    try {
      setState(prev => ({ ...prev, loading: true }));
      const metrics = await metricsService.getUserMetrics(user.id);
      console.log('Fetched metrics:', metrics);
      setState(prev => ({ ...prev, metrics }));
      // Fetch receipts and rewards here if needed
      // For example:
      // const receipts = await receiptsService.getUserReceipts(user.id);
      // const rewards = await rewardsService.getUserRewards(user.id);
      // setState(prev => ({ ...prev, receipts, rewards }));
    } catch (error) {
      setState({
        metrics: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user data',
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  return {
    ...state,
    fetchUserData,
  };
}; 
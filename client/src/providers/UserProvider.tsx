import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Receipt, Reward, Metrics } from '../types';
import { useAuthContext } from './AuthProvider';
import { metricsService, receiptService, rewardService } from '../services';

interface UserContextType {
  metrics: Metrics | null;
  receipts: Receipt[];
  rewards: Reward[];
  loading: boolean;
  error: string | null;
  loadMetrics: () => Promise<void>;
  loadReceipts: () => Promise<void>;
  loadRewards: () => Promise<void>;
  handleRedeemReward: (rewardId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const [state, setState] = useState<{
    metrics: Metrics | null;
    receipts: Receipt[];
    rewards: Reward[];
    loading: boolean;
    error: string | null;
  }>({
    metrics: null,
    receipts: [],
    rewards: [],
    loading: false,
    error: null
  });

  const withLoadingAndError = useCallback(async <T,>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await operation();
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage;
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const loadMetrics = useCallback(async () => {
    if (!user) return;
    await withLoadingAndError(
      async () => {
        const metrics = await metricsService.getUserMetrics(user.id);
        setState(prev => ({ ...prev, metrics }));
      },
      'Failed to load metrics'
    );
  }, [user, withLoadingAndError]);

  const loadReceipts = useCallback(async () => {
    if (!user) return;
    await withLoadingAndError(
      async () => {
        const receipts = await receiptService.getUserReceipts(user.id);
        setState(prev => ({ ...prev, receipts }));
      },
      'Failed to load receipts'
    );
  }, [user, withLoadingAndError]);

  const loadRewards = useCallback(async () => {
    if (!user) return;
    await withLoadingAndError(
      async () => {
        const rewards = await rewardService.getAvailableRewards();
        setState(prev => ({ ...prev, rewards }));
      },
      'Failed to load rewards'
    );
  }, [user, withLoadingAndError]);

  const handleRedeemReward = useCallback(async (rewardId: string) => {
    if (!user) return;
    await withLoadingAndError(
      async () => {
        await rewardService.redeemReward(user.id, rewardId);
        // Refresh rewards and metrics after redemption
        await Promise.all([loadRewards(), loadMetrics()]);
      },
      'Failed to redeem reward'
    );
  }, [user, withLoadingAndError, loadRewards, loadMetrics]);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      setState(prev => ({ ...prev, loading: true }));
      const metrics = await metricsService.getUserMetrics(user.id);
      setState(prev => ({ ...prev, metrics }));
      // Fetch receipts and rewards here if needed
      // For example:
      // const receipts = await receiptsService.getUserReceipts(user.id);
      // const rewards = await rewardsService.getUserRewards(user.id);
      // setState(prev => ({ ...prev, receipts, rewards }));
    } catch (error) {
      setState({
        metrics: null,
        receipts: [],
        rewards: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user data',
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      Promise.all([loadMetrics(), loadReceipts(), loadRewards()]);
    } else {
      setState({
        metrics: null,
        receipts: [],
        rewards: [],
        loading: false,
        error: null
      });
    }
  }, [user, loadMetrics, loadReceipts, loadRewards]);

  return (
    <UserContext.Provider value={{
      ...state,
    loadMetrics,
    loadReceipts,
    loadRewards,
      handleRedeemReward
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 
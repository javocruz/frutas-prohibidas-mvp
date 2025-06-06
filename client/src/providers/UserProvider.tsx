import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Metrics, Receipt, Reward, ApiResponse } from '../types';
import { useAuthContext } from './AuthProvider';
// import { metricsService } from '../services/metricsService';
// import { receiptService } from '../services/receiptService';
// import { rewardService } from '../services/rewardService';
import { mockUser, mockMetrics, mockReceipts, mockRewards } from '../data/mockData';

interface UserContextType {
  user: User | null;
  metrics: Metrics | null;
  receipts: Receipt[];
  rewards: Reward[];
  loading: {
    metrics: boolean;
    receipts: boolean;
    rewards: boolean;
    redeem: boolean;
  };
  error: {
    metrics: string | null;
    receipts: string | null;
    rewards: string | null;
    redeem: string | null;
  };
  updateUser: (user: User) => void;
  updatePoints: (points: number) => void;
  loadMetrics: () => Promise<Metrics>;
  loadReceipts: () => Promise<Receipt[]>;
  loadRewards: () => Promise<Reward[]>;
  redeemReward: (userId: string, rewardId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Utility function to handle async operations with loading and error states
 */
const withLoadingAndError = async <T,>(
  operation: () => Promise<ApiResponse<T>>,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
): Promise<T> => {
  try {
    setLoading(true);
    setError(null);
    const response = await operation();
    return response.data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { user: authUser } = useAuthContext();
  // For mock, just use mockUser
  const [user, setUser] = useState<User | null>(mockUser);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState({
    metrics: false,
    receipts: false,
    rewards: false,
    redeem: false,
  });
  const [error, setError] = useState({
    metrics: null as string | null,
    receipts: null as string | null,
    rewards: null as string | null,
    redeem: null as string | null,
  });

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const updatePoints = useCallback((points: number) => {
    if (user) {
      setUser(prev => prev ? { ...prev, points } : null);
    }
  }, [user]);

  // Mocked load functions
  const loadMetrics = useCallback(async () => {
    setLoading(prev => ({ ...prev, metrics: true }));
    setError(prev => ({ ...prev, metrics: null }));
    return new Promise<Metrics>((resolve) => {
      setTimeout(() => {
        setMetrics(mockMetrics);
        setLoading(prev => ({ ...prev, metrics: false }));
        resolve(mockMetrics);
      }, 300);
    });
  }, []);

  const loadReceipts = useCallback(async () => {
    setLoading(prev => ({ ...prev, receipts: true }));
    setError(prev => ({ ...prev, receipts: null }));
    return new Promise<Receipt[]>((resolve) => {
      setTimeout(() => {
        setReceipts(mockReceipts);
        setLoading(prev => ({ ...prev, receipts: false }));
        resolve(mockReceipts);
      }, 300);
    });
  }, []);

  const loadRewards = useCallback(async () => {
    setLoading(prev => ({ ...prev, rewards: true }));
    setError(prev => ({ ...prev, rewards: null }));
    return new Promise<Reward[]>((resolve) => {
      setTimeout(() => {
        setRewards(mockRewards);
        setLoading(prev => ({ ...prev, rewards: false }));
        resolve(mockRewards);
      }, 300);
    });
  }, []);

  const handleRedeemReward = useCallback(async (userId: string, rewardId: string) => {
    setLoading(prev => ({ ...prev, redeem: true }));
    setError(prev => ({ ...prev, redeem: null }));
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // For mock, just mark the reward as unavailable
        setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, available: false } : r));
        setLoading(prev => ({ ...prev, redeem: false }));
        resolve();
      }, 300);
    });
  }, []);

  // Load initial data on mount
  useEffect(() => {
    loadMetrics();
    loadReceipts();
    loadRewards();
  }, [loadMetrics, loadReceipts, loadRewards]);

  const value: UserContextType = {
    user,
    metrics,
    receipts,
    rewards,
    loading,
    error,
    updateUser,
    updatePoints,
    loadMetrics,
    loadReceipts,
    loadRewards,
    redeemReward: handleRedeemReward
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}; 
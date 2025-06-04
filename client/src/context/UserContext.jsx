import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchMetrics, fetchReceipts, fetchRewards, redeemReward } from '../api/index';

const UserContext = createContext(null);

/**
 * Utility function to handle async operations with loading and error states
 */
const withLoadingAndError = async (operation, setLoading, setError) => {
  try {
    setLoading(true);
    setError(null);
    const result = await operation();
    return result;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

/**
 * Provider component for user data and points management.
 * Handles fetching and updating user metrics, receipts, and rewards.
 */
export function UserProvider({ children }) {
  const [metrics, setMetrics] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMetrics = useCallback(async () => {
    const data = await withLoadingAndError(
      () => fetchMetrics(),
      setLoading,
      setError
    );
    setMetrics(data);
    return data;
  }, []);

  const loadReceipts = useCallback(async () => {
    const data = await withLoadingAndError(
      () => fetchReceipts(),
      setLoading,
      setError
    );
    setReceipts(data);
    return data;
  }, []);

  const loadRewards = useCallback(async () => {
    const data = await withLoadingAndError(
      () => fetchRewards(),
      setLoading,
      setError
    );
    setRewards(data);
    return data;
  }, []);

  const handleRedeemReward = useCallback(async (userId, rewardId) => {
    const result = await withLoadingAndError(
      () => redeemReward(userId, rewardId),
      setLoading,
      setError
    );
    // Refresh metrics to update points
    await loadMetrics();
    return result;
  }, [loadMetrics]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          loadMetrics(),
          loadReceipts(),
          loadRewards()
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    loadInitialData();
  }, [loadMetrics, loadReceipts, loadRewards]);

  const value = {
    metrics,
    receipts,
    rewards,
    loading,
    error,
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
}

/**
 * Custom hook to use the UserContext
 * @returns {Object} UserContext value
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 
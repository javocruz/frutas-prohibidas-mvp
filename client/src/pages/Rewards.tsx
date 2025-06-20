import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useAuthContext } from '../providers/AuthProvider';
import { Reward } from '../types';
import { rewardService } from '../services/RewardService';

const Rewards: React.FC = () => {
  const { user } = useAuthContext();
  const { metrics, loading: userLoading, error: userError } = useUser();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await rewardService.getAvailableRewards();
        setRewards(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rewards');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const handleRedeem = async (rewardId: string) => {
    if (!user) {
      setError('You must be logged in to redeem rewards');
      return;
    }

    try {
      await rewardService.redeemReward(user.id, rewardId);
      // Refresh the rewards list
      const response = await rewardService.getAvailableRewards();
      setRewards(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem reward');
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{userError}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-neutral-600">No rewards available at the moment.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Rewards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map(reward => (
          <div
            key={reward.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-neutral-800">{reward.name}</h3>
              <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium">
                {reward.points_required} points
              </span>
            </div>
            <p className="text-neutral-600 mb-4">{reward.description}</p>
            <button
              className={`w-full py-2 px-4 rounded-md transition-colors duration-300 ${
                metrics?.totalPoints >= reward.points_required
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!metrics || metrics.totalPoints < reward.points_required}
              onClick={() => handleRedeem(reward.id)}
            >
              {!metrics
                ? 'Loading...'
                : metrics.totalPoints >= reward.points_required
                ? 'Redeem Reward'
                : 'Not Enough Points'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;

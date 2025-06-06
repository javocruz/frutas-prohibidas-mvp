import React, { useEffect } from 'react';
import { useUserContext } from '../providers/UserProvider';
import { useAuthContext } from '../providers/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Reward } from '../types';

const Rewards: React.FC = () => {
  const { user } = useAuthContext();
  const { rewards, loading, error, loadRewards, redeemReward } = useUserContext();

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const handleRedeem = async (rewardId: string) => {
    if (!user) return;
    try {
      await redeemReward(user.id, rewardId);
      // Refresh rewards after redemption
      await loadRewards();
    } catch (err) {
      console.error('Error redeeming reward:', err);
    }
  };

  if (loading.rewards) {
    return <LoadingSpinner />;
  }

  if (error.rewards) {
    return <ErrorMessage message={error.rewards} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rewards</h2>
        <p className="mt-1 text-sm text-gray-500">
          Redeem your points for exciting rewards
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward: Reward) => (
          <div
            key={reward.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">
                {reward.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {reward.description}
              </p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-brand">
                  {reward.points} points
                </span>
              </div>
              <button
                onClick={() => handleRedeem(reward.id)}
                disabled={loading.redeem}
                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.redeem ? 'Redeeming...' : 'Redeem'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards; 
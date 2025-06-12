import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { receiptService } from '../services/receiptService';
import { rewardService } from '../services/rewardService';
import { Receipt, Reward } from '../types';

// TODO: Only allow access to users with admin role (already handled by ProtectedRoute in App.tsx)
// TODO: Add functionality to:
//   - Add new rewards
//   - Add points to users
//   - Manage and view metrics
//   - Admin dashboard features

const Admin: React.FC = () => {
  const { user } = useAuthContext();
  const userId = user?.id;
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User not found. Please log in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      receiptService.getUserReceipts(userId),
      rewardService.getAvailableRewards()
    ])
      .then(([receiptsData, rewardsData]) => {
        setReceipts(Array.isArray(receiptsData) ? receiptsData : []);
        setRewards(Array.isArray(rewardsData) ? rewardsData : []);
      })
      .catch((err) => setError(err.message || 'Failed to fetch admin data'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading admin data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Points & Rewards</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-500">Total Points</p>
              <p className="text-2xl font-bold">{receipts.reduce((total, receipt) => total + receipt.points_earned, 0)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Available Rewards</p>
              <p className="text-2xl font-bold">{rewards.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Receipt Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-500">Pending Receipts</p>
              <p className="text-2xl font-bold">N/A</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Recent Receipts</p>
              <p className="text-2xl font-bold">{receipts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Sustainability Impact</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-500">CO₂ Saved</p>
              <p className="text-2xl font-bold">{receipts.reduce((total, receipt) => total + (receipt.total_co2_saved || 0), 0)} kg</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Water Saved</p>
              <p className="text-2xl font-bold">{receipts.reduce((total, receipt) => total + (receipt.total_water_saved || 0), 0)} L</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Land Saved</p>
              <p className="text-2xl font-bold">{receipts.reduce((total, receipt) => total + (receipt.total_land_saved || 0), 0)} m²</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Receipts</h2>
            <div className="space-y-4">
              {(!receipts || receipts.length === 0) ? (
                <div>No receipts found.</div>
              ) : (
                receipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {receipt.points_earned !== undefined && receipt.points_earned !== null ? `${receipt.points_earned} pts` : 'N/A'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {receipt.created_at ? new Date(receipt.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-500">{receipt.amount !== undefined && receipt.amount !== null ? `$${receipt.amount.toFixed(2)}` : 'N/A'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Available Rewards</h2>
            <div className="space-y-4">
              {(!rewards || rewards.length === 0) ? (
                <div>No rewards found.</div>
              ) : (
                rewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{reward.name}</p>
                      <p className="text-xs text-neutral-500">{reward.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-500">{reward.points} pts</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reward.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {reward.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { ApiResponse, Receipt, Reward } from '../types';

interface DashboardStats {
  totalPoints: number;
  pendingReceipts: number;
  availableRewards: number;
  recentReceipts: Receipt[];
  recentRewards: Reward[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<ApiResponse<DashboardStats>>('/dashboard');
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Points</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats?.totalPoints || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Receipts</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pendingReceipts || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Available Rewards</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.availableRewards || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Receipts</h2>
          {stats?.recentReceipts.length ? (
            <ul className="space-y-4">
              {stats.recentReceipts.map((receipt) => (
                <li key={receipt.id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">${receipt.amount.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      receipt.status === 'approved' ? 'bg-green-100 text-green-800' :
                      receipt.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {receipt.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(receipt.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent receipts</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Rewards</h2>
          {stats?.recentRewards.length ? (
            <ul className="space-y-4">
              {stats.recentRewards.map((reward) => (
                <li key={reward.id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{reward.name}</span>
                    <span className="text-indigo-600">{reward.points} points</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {reward.description}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent rewards</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
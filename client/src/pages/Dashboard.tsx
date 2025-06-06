import React, { useEffect } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { useUserContext } from '../providers/UserProvider';
import { Receipt, Reward } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardStats {
  totalPoints: number;
  pendingReceipts: number;
  availableRewards: number;
  recentReceipts: Receipt[];
  recentRewards: Reward[];
}

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

// Reusable MetricCard component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon }) => (
  <div className="p-6 border border-neutral-200 rounded-lg shadow-sm flex flex-col items-center justify-center bg-white transform transition duration-300 hover:scale-105 hover:shadow-md" role="region" aria-label={`${title} Metric`}>
    <div className="text-4xl text-accent-500 mb-3" aria-hidden="true">{icon}</div>
    <div className="text-xl font-semibold text-neutral-800 mb-1">{title}</div>
    <div className="text-4xl font-bold text-brand animate-count-up" data-value={value}>{value} {unit}</div>
  </div>
);

// Reusable ChartContainer component
const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200" role="group" aria-label={`${title} Chart`}>
    <h2 className="text-xl font-semibold text-neutral-800 mb-4">{title}</h2>
    {children}
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { metrics, receipts, rewards, loading, error, loadMetrics, loadReceipts, loadRewards } = useUserContext();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          loadMetrics(),
          loadReceipts(),
          loadRewards()
        ]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    loadDashboardData();
  }, [loadMetrics, loadReceipts, loadRewards]);

  if (loading.metrics || loading.receipts || loading.rewards) {
    return <LoadingSpinner />;
  }

  if (error.metrics || error.receipts || error.rewards) {
    return (
      <ErrorMessage 
        message={error.metrics || error.receipts || error.rewards || 'An error occurred'} 
      />
    );
  }

  const pendingReceipts = receipts.filter(r => r.status === 'pending').length;
  const availableRewards = rewards.filter(r => r.points <= (metrics?.points || 0)).length;
  const recentReceipts = receipts.slice(0, 5);
  const recentRewards = rewards.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Points"
          value={metrics?.points || 0}
          unit="points"
          icon="🏆"
        />
        <MetricCard
          title="Pending Receipts"
          value={pendingReceipts}
          unit="receipts"
          icon="📝"
        />
        <MetricCard
          title="Available Rewards"
          value={availableRewards}
          unit="rewards"
          icon="🎁"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartContainer title="Recent Receipts">
          {recentReceipts.length ? (
            <ul className="space-y-4">
              {recentReceipts.map((receipt) => (
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
        </ChartContainer>

        <ChartContainer title="Recent Rewards">
          {recentRewards.length ? (
            <ul className="space-y-4">
              {recentRewards.map((reward) => (
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
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard; 
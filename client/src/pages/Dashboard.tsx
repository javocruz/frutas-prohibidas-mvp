import React from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { useUser } from '../hooks/useUser';

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
    <div className="text-4xl font-bold text-brand">{value.toFixed(2)} {unit}</div>
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
  const { metrics, loading, error } = useUser();

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

  if (!metrics) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>
      
      {/* Top Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Points"
          value={metrics.totalPoints}
          unit="points"
          icon="🏆"
        />
        <MetricCard
          title="CO₂ Saved"
          value={metrics.sustainabilityMetrics.co2Saved}
          unit="kg"
          icon="🌱"
        />
        <MetricCard
          title="Water Saved"
          value={metrics.sustainabilityMetrics.waterSaved}
          unit="L"
          icon="💧"
        />
        <MetricCard
          title="Land Saved"
          value={metrics.sustainabilityMetrics.landSaved}
          unit="m²"
          icon="🌍"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartContainer title="Recent Receipts">
          {metrics.recentReceipts.length ? (
            <ul className="space-y-4">
              {metrics.recentReceipts.map((receipt) => (
                <li key={receipt.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-500">
                      {new Date(receipt.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-semibold text-brand">
                      +{receipt.pointsEarned} points
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600">
                    {receipt.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent receipts</p>
          )}
        </ChartContainer>

        <ChartContainer title="Recent Rewards">
          {metrics.recentRewards.length ? (
            <ul className="space-y-4">
              {metrics.recentRewards.map((reward) => (
                <li key={reward.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-neutral-800">
                      {reward.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(reward.redeemedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{reward.description}</p>
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
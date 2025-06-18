import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { useUser } from '../hooks/useUser';
import { Container, Box, Typography } from '@mui/material';
import symbolLogo from '../assets/symbol-logo.png';
import { api } from '../lib/api';

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
  <div
    className="p-6 border border-neutral-200 rounded-lg shadow-sm flex flex-col items-center justify-center bg-white transform transition duration-300 hover:scale-105 hover:shadow-md"
    role="region"
    aria-label={`${title} Metric`}
  >
    <div className="text-4xl text-accent-500 mb-3" aria-hidden="true">
      {icon}
    </div>
    <div className="text-xl font-semibold text-neutral-800 mb-1">{title}</div>
    <div className="text-4xl font-bold text-brand">
      {title === 'Water Saved' || title === 'Total Points' || title === 'Lifetime Points'
        ? Math.round(value)
        : Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      {' '}{unit}
    </div>
  </div>
);

// Reusable ChartContainer component
const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200"
    role="group"
    aria-label={`${title} Chart`}
  >
    <h2 className="text-xl font-semibold text-neutral-800 mb-4">{title}</h2>
    {children}
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { metrics, loading, error } = useUser();
  const [restaurantMetrics, setRestaurantMetrics] = useState<{ co2Saved: number; waterSaved: number; landSaved: number } | null>(null);
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantMetrics = async () => {
      setRestaurantLoading(true);
      setRestaurantError(null);
      try {
        const response = await api.get('/metrics/restaurant');
        if (response.data.success) {
          setRestaurantMetrics({
            co2Saved: response.data.data.totalCo2Saved,
            waterSaved: response.data.data.totalWaterSaved,
            landSaved: response.data.data.totalLandSaved,
          });
        } else {
          setRestaurantError('Failed to fetch restaurant metrics');
        }
      } catch (err) {
        setRestaurantError('Failed to fetch restaurant metrics');
      } finally {
        setRestaurantLoading(false);
      }
    };
    fetchRestaurantMetrics();
  }, []);

  if (loading || restaurantLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (error || restaurantError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error || restaurantError}</div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <img
          src={symbolLogo}
          alt="Frutas Prohibidas Symbol"
          style={{ width: '40px', marginRight: '10px' }}
        />
        <Typography variant="h4" component="h1">
          Frutas Prohibidas
        </Typography>
      </Box>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Metrics */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Your Sustainability Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <MetricCard title="Lifetime Points" value={metrics.totalPoints} unit="points" icon="🏆" />
              <MetricCard title="CO₂ Saved" value={metrics.sustainabilityMetrics.co2Saved} unit="kg" icon="🌱" />
              <MetricCard title="Water Saved" value={metrics.sustainabilityMetrics.waterSaved} unit="L" icon="💧" />
              <MetricCard title="Land Saved" value={metrics.sustainabilityMetrics.landSaved} unit="m²" icon="🌍" />
            </div>
            <hr className="my-4" />
            <h2 className="text-xl font-semibold mb-2">Restaurant Sustainability Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <MetricCard title="CO₂ Saved" value={restaurantMetrics?.co2Saved ?? 0} unit="kg" icon="🌱" />
              <MetricCard title="Water Saved" value={restaurantMetrics?.waterSaved ?? 0} unit="L" icon="💧" />
              <MetricCard title="Land Saved" value={restaurantMetrics?.landSaved ?? 0} unit="m²" icon="🌍" />
            </div>
          </div>
          {/* Recent Receipts in skinny right column */}
          <div className="md:col-span-1">
            <ChartContainer title="Recent Receipts">
              {metrics.recentReceipts.length ? (
                <ul className="space-y-4">
                  {metrics.recentReceipts.map(receipt => (
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
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;

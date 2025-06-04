import React from 'react';
import { useUser } from '../context/UserContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

// Reusable MetricCard component
const MetricCard = ({ title, value, unit, icon }) => (
  <div className="p-6 border border-neutral-200 rounded-lg shadow-sm flex flex-col items-center justify-center bg-white transform transition duration-300 hover:scale-105 hover:shadow-md" role="region" aria-label={`${title} Metric`}>
    <div className="text-4xl text-accent-500 mb-3" aria-hidden="true">{icon}</div>
    <div className="text-xl font-semibold text-neutral-800 mb-1">{title}</div>
    <div className="text-4xl font-bold text-brand animate-count-up" data-value={value}>{value} {unit}</div>
  </div>
);

// Reusable ChartContainer component
const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200" role="group" aria-label={`${title} Chart`}>
    <h2 className="text-xl font-semibold text-neutral-800 mb-4">{title}</h2>
    {children}
  </div>
);

export default function Dashboard() {
  const { metrics, loading, error } = useUser();

  // Simple count-up animation logic
  React.useEffect(() => {
    if (metrics) {
      document.querySelectorAll('.animate-count-up').forEach(element => {
        const targetValue = parseFloat(element.dataset.value);
        let startValue = 0;
        const duration = 1000; // milliseconds
        const increment = targetValue / (duration / 10); // Adjust 10 for smoother animation

        const timer = setInterval(() => {
          startValue += increment;
          if (startValue >= targetValue) {
            startValue = targetValue;
            clearInterval(timer);
          }
          element.textContent = `${startValue.toFixed(1)} ${element.dataset.unit || ''}`;
        }, 10);
      });
    }
  }, [metrics]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!metrics) return null;

  const data = [
    { name: 'CO2 (kg)', value: metrics.co2Saved, unit: 'kg' },
    { name: 'Water (L)', value: metrics.waterSaved, unit: 'L' },
    { name: 'Land (m²)', value: metrics.landSaved, unit: 'm²' }
  ];

  return (
    <div className="space-y-8 p-4 md:p-8" aria-live="polite">
      <h1 className="text-3xl font-extrabold text-neutral-900">Your Sustainability Dashboard</h1>

      {/* User points display */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 text-center">
        <p className="text-2xl font-semibold text-neutral-700">You currently have <strong className="text-brand">{metrics.pointsTotal || 0} points</strong>.</p>
        <p className="text-md text-neutral-500 mt-1">Keep up the great work to earn more rewards!</p>
      </div>

      {/* Environmental Impact Metrics */}
      <section aria-labelledby="environmental-impact-heading">
        <h2 id="environmental-impact-heading" className="text-2xl font-bold text-neutral-800 mb-6">Your Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="CO₂ Saved" value={metrics.co2Saved} unit="kg" icon="🌍" />
          <MetricCard title="Water Saved" value={metrics.waterSaved} unit="L" icon="💧" />
          <MetricCard title="Land Saved" value={metrics.landSaved} unit="m²" icon="🏞️" />
        </div>
      </section>

      {/* Metrics Chart */}
      <ChartContainer title="Environmental Impact Overview">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
}

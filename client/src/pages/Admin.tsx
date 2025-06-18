import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { receiptService } from '../services/receiptService';
import { rewardService } from '../services/rewardService';
import { Receipt, Reward } from '../types';
import { api } from '../lib/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// TODO: Only allow access to users with admin role (already handled by ProtectedRoute in App.tsx)
// TODO: Add functionality to:
//   - Add new rewards
//   - Add points to users
//   - Manage and view metrics
//   - Admin dashboard features

const AdminAnalytics: React.FC = () => {
  const { user } = useAuthContext();
  const userId = user?.id;
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      setError('User not found. Please log in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([receiptService.getUserReceipts(userId), rewardService.getAvailableRewards()])
      .then(([receiptsData, rewardsData]) => {
        setReceipts(Array.isArray(receiptsData) ? receiptsData : []);
        setRewards(Array.isArray(rewardsData) ? rewardsData : []);
      })
      .catch(err => setError(err.message || 'Failed to fetch admin data'))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/metrics/admin-analytics');
        if (response.data.success) {
          setAnalytics(response.data.data);
        } else {
          setError('Failed to fetch analytics');
        }
      } catch (err) {
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading admin data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analytics) return <div>No analytics data available.</div>;

  const { kpis, salesByDay, topItems, leastItems, categoryBreakdown, issuedVsRedeemed, engagement, hourlyCounts } = analytics;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Analytics</h1>
      </div>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <KpiCard label="Total Receipts Issued" value={kpis.totalReceipts} />
        <KpiCard label="Total Codes Redeemed" value={kpis.totalCodesRedeemed} />
        <KpiCard label="Redemption Rate (%)" value={kpis.redemptionRate} />
        <KpiCard label="Active Users (30d)" value={kpis.activeUsers} />
        <KpiCard label="New Users (30d)" value={kpis.newUsers} />
        <KpiCard label="Total Points Awarded" value={kpis.totalPointsAwarded} />
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Sales Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Sales (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDay} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Receipts" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryBreakdown.map((entry: { category: string; count: number }, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#f87171', '#a78bfa', '#fbbf24', '#34d399', '#f472b6', '#60a5fa', '#facc15'][index % 10]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Top 10 and Least 10 Sold Items Side by Side */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top 10 Most Sold Items Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Top 10 Most Sold Items</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Least 10 Sold Items Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Least 10 Sold Items</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leastItems} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f87171" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Issued vs. Redeemed Dual-Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Issued vs. Redeemed (Last 12 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issuedVsRedeemed} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="issued" fill="#8884d8" name="Issued" />
              <Bar dataKey="redeemed" fill="#82ca9d" name="Redeemed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Monthly Engagement Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Engagement (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagement} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" name="Unique Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Hourly Peak Times Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Hourly Peak Times (Avg Receipts by Hour)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyCounts} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill="#8884d8" name="Avg Receipts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KpiCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 flex flex-col items-center justify-center">
    <div className="text-2xl font-bold text-brand mb-2">{value}</div>
    <div className="text-sm text-gray-600 text-center">{label}</div>
  </div>
);

export default AdminAnalytics;

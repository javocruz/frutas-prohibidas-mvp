import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { receiptService } from '../services/receiptService';
import { Receipt } from '../types';

const Receipts: React.FC = () => {
  const { user } = useAuthContext();
  const userId = user?.id;
  const [receipts, setReceipts] = useState<Receipt[]>([]);
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
    receiptService.getUserReceipts(userId)
      .then((data) => setReceipts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Failed to fetch receipts'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading receipts...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!receipts || receipts.length === 0) return <div>No receipts found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Receipts</h1>
        <button className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors duration-300">
            Upload Receipt
          </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {receipt.created_at ? new Date(receipt.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {typeof receipt.points_earned === 'number' ? `$${receipt.points_earned.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {receipt.points_earned !== undefined && receipt.points_earned !== null ? receipt.points_earned : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <button className="text-brand hover:text-brand-dark">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Receipts; 
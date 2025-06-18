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
  const [expandedReceiptId, setExpandedReceiptId] = useState<string | null>(null);
  const [receiptCode, setReceiptCode] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User not found. Please log in again.');
      setLoading(false);
      return;
    }
    loadReceipts();
  }, [userId]);

  const loadReceipts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await receiptService.getUserReceipts(userId!);
      setReceipts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptCode.trim()) {
      setClaimError('Please enter a receipt code');
      return;
    }

    setIsClaiming(true);
    setClaimError(null);
    setClaimSuccess(null);

    try {
      const response = await fetch('/api/receipts/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receipt_code: receiptCode.trim(),
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to claim receipt');
      }

      setClaimSuccess('Receipt claimed successfully!');
      setReceiptCode('');
      loadReceipts(); // Reload receipts to show the new one
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : 'Failed to claim receipt');
    } finally {
      setIsClaiming(false);
    }
  };

  const toggleReceipt = (receiptId: string) => {
    setExpandedReceiptId(expandedReceiptId === receiptId ? null : receiptId);
  };

  const formatDecimal = (value: unknown) => {
    if (value === null || value === undefined) return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

  if (loading) return <div>Loading receipts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Receipts</h1>
      </div>

      {/* Claim Receipt Form */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Claim a Receipt</h2>
        <form onSubmit={handleClaimReceipt} className="space-y-4">
          <div>
            <label htmlFor="receiptCode" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Receipt Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="receiptCode"
                value={receiptCode}
                onChange={(e) => setReceiptCode(e.target.value.toUpperCase())}
                placeholder="e.g., AB123456"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
                maxLength={8}
                pattern="[A-Z]{2}[0-9]{6}"
                title="Enter an 8-character code (2 letters followed by 6 numbers)"
              />
              <button
                type="submit"
                disabled={isClaiming || !receiptCode.trim()}
                className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-50 transition-colors duration-300"
              >
                {isClaiming ? 'Claiming...' : 'Claim Receipt'}
              </button>
            </div>
          </div>
          {claimError && (
            <div className="text-red-600 text-sm">{claimError}</div>
          )}
          {claimSuccess && (
            <div className="text-green-600 text-sm">{claimSuccess}</div>
          )}
        </form>
      </div>

      {/* Receipts List */}
      {receipts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No receipts found. Claim a receipt using the form above.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Eco Impact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {receipts.map((receipt) => (
                  <React.Fragment key={receipt.id}>
                    <tr
                      onClick={() => toggleReceipt(receipt.id)}
                      className="hover:bg-neutral-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {new Date(receipt.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {receipt.points_earned} points
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        <div className="space-y-1">
                          <div>CO₂: {formatDecimal(receipt.total_co2_saved)} kg</div>
                          <div>Water: {formatDecimal(receipt.total_water_saved)} L</div>
                          <div>Land: {formatDecimal(receipt.total_land_saved)} m²</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        <button className="text-brand hover:text-brand-dark">
                          {expandedReceiptId === receipt.id ? 'Hide' : 'Show'} Details
                        </button>
                      </td>
                    </tr>
                    {expandedReceiptId === receipt.id && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 bg-neutral-50">
                          <div className="space-y-2">
                            <h4 className="font-medium">Items:</h4>
                            {receipt.receipt_items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>
                                  {item.quantity}x {item.menu_items?.name}
                                </span>
                                <span className="text-neutral-500">
                                  CO₂: {formatDecimal(item.menu_items?.co2_saved)} kg | 
                                  Water: {formatDecimal(item.menu_items?.water_saved)} L | 
                                  Land: {formatDecimal(item.menu_items?.land_saved)} m²
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;

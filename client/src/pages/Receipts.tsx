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

  const toggleReceipt = (receiptId: string) => {
    setExpandedReceiptId(expandedReceiptId === receiptId ? null : receiptId);
  };

  const formatDecimal = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    // Convert to number if it's a Decimal or string
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

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
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {receipt.created_at ? new Date(receipt.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {receipt.points_earned !== undefined && receipt.points_earned !== null 
                        ? `${receipt.points_earned} points` 
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      <div className="space-y-1">
                        <div>CO₂: {formatDecimal(receipt.total_co2_saved)} kg</div>
                        <div>Water: {formatDecimal(receipt.total_water_saved)} L</div>
                        <div>Land: {formatDecimal(receipt.total_land_saved)} m²</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <button 
                        onClick={() => toggleReceipt(receipt.id)}
                        className="text-brand hover:text-brand-dark"
                      >
                        {expandedReceiptId === receipt.id ? 'Hide' : 'Show'} Items
                      </button>
                    </td>
                  </tr>
                  {expandedReceiptId === receipt.id && receipt.receipt_items && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-neutral-50">
                        <div className="space-y-4">
                          <h4 className="font-medium text-neutral-900">Ordered Items:</h4>
                          <div className="space-y-2">
                            {receipt.receipt_items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                                <div>
                                  <div className="font-medium">{item.menu_items.name}</div>
                                  <div className="text-sm text-neutral-500">Quantity: {item.quantity}</div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="text-sm">
                                    <span className="font-medium">Category:</span> {item.menu_items.category}
                                  </div>
                                  <div className="text-xs text-neutral-500">
                                    <div>CO₂: {formatDecimal(item.menu_items.co2_saved * item.quantity)} kg</div>
                                    <div>Water: {formatDecimal(item.menu_items.water_saved * item.quantity)} L</div>
                                    <div>Land: {formatDecimal(item.menu_items.land_saved * item.quantity)} m²</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
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
    </div>
  );
};

export default Receipts; 
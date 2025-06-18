import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { MenuItem, ReceiptItem } from '../types';
import ReceiptTemplate from '../components/ReceiptTemplate';
import { api } from '../lib/api';

interface ReceiptItemWithQuantity {
  menuItem: MenuItem;
  quantity: number;
}

const ReceiptsMaker: React.FC = () => {
  const { user } = useAuthContext();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptItemWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdReceipt, setCreatedReceipt] = useState<{
    code: string;
    points: number;
    createdAt: string;
    html: string;
  } | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu-items');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Group menu items by category
  const menuItemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addItemToReceipt = (menuItem: MenuItem) => {
    setCurrentReceipt(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeItemFromReceipt = (menuItemId: number) => {
    setCurrentReceipt(prev => prev.filter(item => item.menuItem.id !== menuItemId));
  };

  const updateItemQuantity = (menuItemId: number, quantity: number) => {
    if (quantity < 1) return;
    setCurrentReceipt(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotals = () => {
    return currentReceipt.reduce(
      (acc, item) => ({
        co2: acc.co2 + Number(item.menuItem.co2_saved) * item.quantity,
        water: acc.water + item.menuItem.water_saved * item.quantity,
        land: acc.land + Number(item.menuItem.land_saved) * item.quantity,
      }),
      { co2: 0, water: 0, land: 0 }
    );
  };

  const printReceipt = (html: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-100vw';
    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 500);
      } catch (err) {
        setError('Failed to print receipt. Please try downloading instead.');
        document.body.removeChild(iframe);
      }
    };

    iframe.srcdoc = html;
  };

  const downloadReceipt = () => {
    if (!createdReceipt) return;

    const blob = new Blob([createdReceipt.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${createdReceipt.code}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const finalizeReceipt = async () => {
    if (currentReceipt.length === 0) {
      setError('Cannot finalize an empty receipt');
      return;
    }

    setIsFinalizing(true);
    setError(null);
    setSuccessMessage(null);
    setCreatedReceipt(null);
    setShowPrintPreview(false);

    try {
      const response = await fetch('/api/receipts/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: currentReceipt.map(item => ({
            menu_item_id: item.menuItem.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create receipt');
      }

      const data = await response.json();
      
      // Generate receipt HTML
      const receiptHtml = ReceiptTemplate({
        items: currentReceipt,
        receiptCode: data.receipt_code,
        pointsEarned: data.points_earned,
        totals: calculateTotals(),
        createdAt: data.created_at,
      });

      setCreatedReceipt({
        code: data.receipt_code,
        points: data.points_earned,
        createdAt: data.created_at,
        html: receiptHtml,
      });

      setSuccessMessage('Receipt created! Click "Print Receipt" to print.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create receipt');
    } finally {
      setIsFinalizing(false);
    }
  };

  const handlePrintPreview = () => {
    if (!createdReceipt) return;
    setShowPrintPreview(true);
  };

  const handlePrint = () => {
    if (!createdReceipt) return;
    printReceipt(createdReceipt.html);
  };

  const handleReprint = () => {
    if (!createdReceipt) return;
    printReceipt(createdReceipt.html);
  };

  const clearReceipt = () => {
    setCurrentReceipt([]);
    setCreatedReceipt(null);
    setShowPrintPreview(false);
    setSuccessMessage(null);
  };

  if (loading) return <div>Loading menu items...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const totals = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Receipts Maker</h1>
        <div className="space-x-4">
          <button
            onClick={clearReceipt}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={currentReceipt.length === 0}
          >
            Clear Receipt
          </button>
          {!createdReceipt && (
            <button
              onClick={finalizeReceipt}
              className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-600 disabled:opacity-50"
              disabled={currentReceipt.length === 0 || isFinalizing}
            >
              {isFinalizing ? 'Creating Receipt...' : 'Create Receipt'}
            </button>
          )}
          {createdReceipt && (
            <>
              <button
                onClick={handlePrintPreview}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Preview Receipt
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Print Receipt
              </button>
              <button
                onClick={downloadReceipt}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Download
              </button>
              <button
                onClick={async () => {
                  if (!createdReceipt) return;
                  try {
                    await api.delete(`/receipts/code/${createdReceipt.code}`);
                    clearReceipt();
                  } catch (err) {
                    setError('Failed to revert receipt.');
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Revert Receipt
              </button>
            </>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Print Preview Modal */}
      {showPrintPreview && createdReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Receipt Preview</h2>
              <button
                onClick={() => setShowPrintPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                ref={previewIframeRef}
                srcDoc={createdReceipt.html}
                className="w-full h-[600px]"
                title="Receipt Preview"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowPrintPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Menu Items */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
            <div className="space-y-2">
              {Object.entries(menuItemsByCategory).map(([category, items]) => (
                <div key={category} className="border-b last:border-0">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-2 text-left font-medium hover:bg-neutral-50 flex justify-between items-center"
                  >
                    <span>{category}</span>
                    <span>{expandedCategories.includes(category) ? '−' : '+'}</span>
                  </button>
                  {expandedCategories.includes(category) && (
                    <div className="px-4 py-2 space-y-2">
                      {items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => addItemToReceipt(item)}
                          className="w-full px-4 py-2 text-left hover:bg-neutral-50 rounded-md"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Current Receipt */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Current Receipt</h2>
            {currentReceipt.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items added yet</p>
            ) : (
              <div className="space-y-4">
                {currentReceipt.map(item => (
                  <div
                    key={item.menuItem.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.menuItem.name}</div>
                      <div className="text-sm text-neutral-500">
                        CO₂: {item.menuItem.co2_saved}kg | Water: {item.menuItem.water_saved}L | Land: {item.menuItem.land_saved}m²
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateItemQuantity(item.menuItem.id, item.quantity - 1)}
                        className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.menuItem.id, item.quantity + 1)}
                        className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItemFromReceipt(item.menuItem.id)}
                        className="ml-2 px-2 py-1 text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-semibold mb-2">Totals</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>CO₂ Saved:</span>
                      <span>{totals.co2.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Water Saved:</span>
                      <span>{totals.water.toFixed(0)} L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Land Saved:</span>
                      <span>{totals.land.toFixed(2)} m²</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden receipt template for printing */}
      {createdReceipt && (
        <div className="hidden">
          <div ref={receiptRef}>
            <ReceiptTemplate
              items={currentReceipt}
              receiptCode={createdReceipt.code}
              pointsEarned={createdReceipt.points}
              totals={totals}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptsMaker; 
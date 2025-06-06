import React, { useEffect } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { useUserContext } from '../providers/UserProvider';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Receipt } from '../types';

const Receipts: React.FC = () => {
  const { user } = useAuthContext();
  const { receipts, loading, error, loadReceipts } = useUserContext();

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  const columns = [
    {
      header: 'Date',
      accessor: (receipt: Receipt) => new Date(receipt.createdAt).toLocaleDateString(),
    },
    {
      header: 'Amount',
      accessor: (receipt: Receipt) => `$${receipt.amount.toFixed(2)}`,
    },
    {
      header: 'Points',
      accessor: (receipt: Receipt) => receipt.points,
    },
    {
      header: 'Status',
      accessor: (receipt: Receipt) => <StatusBadge status={receipt.status} />,
    },
  ];

  if (loading.receipts) {
    return <LoadingSpinner />;
  }

  if (error.receipts) {
    return <ErrorMessage message={error.receipts} />;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Receipts</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and track your receipt submissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
          >
            Upload Receipt
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <Table
          columns={columns}
          data={receipts}
          onRowClick={(receipt) => {
            // Handle receipt click
            console.log('Receipt clicked:', receipt);
          }}
        />
      </div>
    </div>
  );
};

export default Receipts; 
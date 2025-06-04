import React from 'react';
import { useUser } from '../context/UserContext';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { formatDate } from '../utils/formatting';
import { Table, TableHeader, TableBody, TableRow, Th, Td } from '../components/Table';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function Receipts() {
  const { receipts, loading, error } = useUser();
  const [selectedReceipt, setSelectedReceipt] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openReceiptDetails = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-neutral-900">Receipts</h1>
          <p className="mt-2 text-sm text-neutral-600">
            A list of all your receipts and their details.
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <Th>Date</Th>
          <Th>Store</Th>
          <Th>Amount</Th>
          <Th>Points</Th>
          <Th>Status</Th>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow
              key={receipt.id}
              onClick={() => openReceiptDetails(receipt)}
              interactive
            >
              <Td>{formatDate(receipt.date)}</Td>
              <Td>{receipt.store}</Td>
              <Td>${receipt.amount.toFixed(2)}</Td>
              <Td>{receipt.points}</Td>
              <Td><StatusBadge status={receipt.status} /></Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-neutral-900"
                  >
                    Receipt Details
                  </Dialog.Title>
                  {selectedReceipt && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Date</p>
                        <p className="mt-1 text-sm text-neutral-900">{formatDate(selectedReceipt.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Store</p>
                        <p className="mt-1 text-sm text-neutral-900">{selectedReceipt.store}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Amount</p>
                        <p className="mt-1 text-sm text-neutral-900">${selectedReceipt.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Points</p>
                        <p className="mt-1 text-sm text-neutral-900">{selectedReceipt.points}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Status</p>
                        <p className="mt-1 text-sm text-neutral-900">
                          <StatusBadge status={selectedReceipt.status} />
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

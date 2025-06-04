import React from 'react';

const getStatusStyles = (status) => {
  switch (status) {
    case 'approved':
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
    case 'suspended':
      return 'bg-red-100 text-red-800';
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 
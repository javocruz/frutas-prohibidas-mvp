import React from 'react';

export type Status = 'pending' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800',
          icon: '✓',
          label: 'Approved',
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: '✕',
          label: 'Rejected',
        };
      case 'pending':
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: '⟳',
          label: 'Pending',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showIcon && (
        <span className="mr-1" aria-hidden="true">
          {config.icon}
        </span>
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;

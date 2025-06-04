import React from 'react';

export default function LoadingSpinner({ className = 'h-12 w-12' }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className={`animate-spin rounded-full border-b-2 border-brand ${className}`}></div>
    </div>
  );
} 
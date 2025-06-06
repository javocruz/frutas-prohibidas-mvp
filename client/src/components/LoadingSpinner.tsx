import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = false,
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex justify-center items-center h-32';

  return (
    <div 
      className={`${containerClasses} ${className}`}
      role="status"
      aria-label={text || 'Loading'}
    >
      <div className="flex flex-col items-center">
        <div 
          className={`animate-spin rounded-full border-b-2 border-brand ${sizeClasses[size]}`}
          aria-hidden="true"
        />
        {text && (
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 
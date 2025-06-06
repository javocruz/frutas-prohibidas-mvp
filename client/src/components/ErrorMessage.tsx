import React from 'react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  type = 'error',
  onDismiss,
  className = ''
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-400',
          icon: 'text-yellow-400',
          text: 'text-yellow-700'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-400',
          icon: 'text-blue-400',
          text: 'text-blue-700'
        };
      case 'error':
      default:
        return {
          container: 'bg-red-50 border-red-400',
          icon: 'text-red-400',
          text: 'text-red-700'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`border-l-4 p-4 mb-4 ${styles.container} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className={`h-5 w-5 ${styles.icon}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${styles.text}`}>{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.icon}`}
              onClick={onDismiss}
              aria-label="Dismiss message"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 
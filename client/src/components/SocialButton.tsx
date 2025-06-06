import React from 'react';

interface SocialButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onClick: () => void;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ 
  provider, 
  onClick, 
  className = '' 
}) => {
  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.07 2.7.61 3.44 1.57-3.14 1.88-2.29 5.13.22 6.41-.5 1.39-1.15 2.76-2.25 4.05zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
            />
          </svg>
        );
    }
  };

  const getProviderStyles = () => {
    switch (provider) {
      case 'google':
        return 'bg-white text-gray-700 hover:bg-gray-50';
      case 'facebook':
        return 'bg-[#1877F2] text-white hover:bg-[#166FE5]';
      case 'apple':
        return 'bg-black text-white hover:bg-gray-900';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${getProviderStyles()} ${className}`}
    >
      <span className="mr-2">{getProviderIcon()}</span>
      Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
};

export default SocialButton; 
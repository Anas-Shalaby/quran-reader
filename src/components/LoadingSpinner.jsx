// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  message = 'جارٍ التحميل...', 
  size = 'large', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex justify-center items-center bg-white/50 dark:bg-dark-50/50' 
    : 'flex justify-center items-center';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div 
          className={`
            animate-spin rounded-full 
            border-t-4 border-green-500 
            ${sizeClasses[size]} 
            mx-auto mb-4
            dark:border-green-300
          `}
        ></div>
        <h2 className="text-gray-700 dark:text-gray-200 text-xl font-bold">
          {message}
        </h2>
      </div>
    </div>
  );
};

export default LoadingSpinner;
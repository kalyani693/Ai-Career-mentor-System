import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message = null, className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-brand-700`} />
      {message && <p className="mt-2 text-sm text-slate-600 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

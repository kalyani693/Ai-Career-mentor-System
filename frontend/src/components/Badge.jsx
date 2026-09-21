import React from 'react';

const Badge = ({
  children,
  variant = 'brand', // 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
  className = '',
}) => {
  const variants = {
    brand: 'bg-brand-50 text-brand-800 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

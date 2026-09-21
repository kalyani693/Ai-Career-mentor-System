import React from 'react';

const Card = ({
  children,
  className = '',
  title = null,
  subtitle = null,
  icon: Icon = null,
  action = null,
  interactive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden ${
        interactive ? 'hover:shadow-md hover:border-brand-300 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {(title || Icon || action) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-brand-50 text-brand-800">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-slate-900 text-base">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;

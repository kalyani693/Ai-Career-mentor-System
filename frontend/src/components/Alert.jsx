import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = ({
  type = 'info', // 'info' | 'success' | 'warning' | 'error'
  title = null,
  message,
  className = '',
  onClose = null,
}) => {
  const types = {
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
  };

  const config = types[type] || types.info;
  const IconComponent = config.icon;

  if (!message && !title) return null;

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-3 ${config.bg} ${className}`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        {message && <div className="leading-relaxed break-words">{message}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;

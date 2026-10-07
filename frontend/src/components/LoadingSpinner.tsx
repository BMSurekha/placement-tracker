import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const spinnerSize =
    size === 'sm' ? 'w-5 h-5 border-2' : size === 'lg' ? 'w-10 h-10 border-4' : 'w-7 h-7 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <div
        className={`${spinnerSize} border-slate-200 border-t-brand-600 rounded-full animate-spin mb-3`}
      />
      {message && <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>}
    </div>
  );
};

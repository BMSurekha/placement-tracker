import React from 'react';
import { ApplicationStatus, DriveStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus | DriveStatus | 'ELIGIBLE' | 'NOT_ELIGIBLE';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'OPEN':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/20';
      break;
    case 'UPCOMING':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/20';
      break;
    case 'CLOSED':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
    case 'COMPLETED':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-600/20';
      break;

    case 'APPLIED':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-600/20';
      break;
    case 'SHORTLISTED':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-600/20';
      break;
    case 'SELECTED':
      colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-600/30 font-bold';
      break;
    case 'REJECTED':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/20';
      break;
    case 'WITHDRAWN':
      colorClasses = 'bg-gray-100 text-gray-600 border-gray-200';
      break;

    case 'ELIGIBLE':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'NOT_ELIGIBLE':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
  }

  const formatText = (text: string) => {
    if (text === 'NOT_ELIGIBLE') return 'Not Eligible';
    if (text === 'ELIGIBLE') return 'Eligible';
    return text.charAt(0) + text.slice(1).toLowerCase();
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {formatText(status)}
    </span>
  );
};

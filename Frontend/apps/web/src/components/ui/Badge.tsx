import React from 'react';

type BadgeVariant = 'status' | 'tier' | 'verification';
type StatusColor = 'green' | 'amber' | 'coral' | 'gray' | 'purple';
type TierName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

interface BadgeProps {
  variant?: BadgeVariant;
  status?: StatusColor;
  tier?: TierName;
  className?: string;
  children: React.ReactNode;
}

const statusStyles: Record<StatusColor, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
  coral: 'bg-red-50 text-red-700 border-red-200/80',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200/80',
};

const statusDots: Record<StatusColor, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  coral: 'bg-red-500',
  gray: 'bg-gray-400',
  purple: 'bg-violet-500',
};

const tierStyles: Record<TierName, string> = {
  Bronze: 'bg-orange-50 text-orange-800 border-orange-200',
  Silver: 'bg-slate-100 text-slate-700 border-slate-300',
  Gold: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  Platinum: 'bg-indigo-50 text-indigo-800 border-indigo-200',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'status', status = 'green', tier, className = '', children }) => {
  let colorClass = statusStyles[status];
  let dotClass = statusDots[status];
  if (variant === 'tier' && tier) {
    colorClass = tierStyles[tier];
    dotClass = '';
  }
  if (variant === 'verification') {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-300';
    dotClass = '';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${colorClass} ${className}`}>
      {variant === 'status' && <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />}
      {variant === 'verification' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )}
      {children}
    </span>
  );
};

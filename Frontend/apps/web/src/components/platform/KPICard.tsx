import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  accentColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, trend, trendLabel, icon, onClick, accentColor }) => {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200/80 shadow-card p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-px hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2' : ''
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accentColor || 'bg-brand-teal-soft'}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-[28px] leading-9 font-bold tracking-tight text-gray-900 tabular">{value}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-1.5">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
          )}
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-700' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-gray-400 ml-0.5">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

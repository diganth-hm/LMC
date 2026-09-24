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
      className={`bg-white rounded-md border border-gray-200 p-5 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">{label}</span>
        {icon && (
          <div className={`w-9 h-9 rounded-md flex items-center justify-center ${accentColor || 'bg-[#E1F5EE]'}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-gray-400 ml-0.5">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

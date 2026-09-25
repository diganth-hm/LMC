import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Shared page-title block so every screen uses the same heading hierarchy.
 * Presentation-only — no routing, data, or logic implications.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, className = '' }) => (
  <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${className}`}>
    <div>
      <h1 className="text-[22px] leading-7 font-bold tracking-tight text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

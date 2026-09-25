import React from 'react';

interface CardProps {
  variant?: 'basic' | 'stat' | 'elevated';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ variant = 'basic', className = '', children, onClick }) => {
  const base = 'bg-white rounded-lg border border-gray-200/80 transition-all duration-200';
  const variants: Record<string, string> = {
    basic: 'p-5 shadow-xs',
    stat: 'p-5 shadow-card',
    elevated: 'p-5 shadow-card hover:shadow-card-hover',
  };
  const interactive = onClick
    ? 'cursor-pointer hover:border-gray-300 hover:shadow-card-hover hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2'
    : '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${interactive} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

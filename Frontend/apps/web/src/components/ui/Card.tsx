import React from 'react';

interface CardProps {
  variant?: 'basic' | 'stat' | 'elevated';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ variant = 'basic', className = '', children, onClick }) => {
  const base = 'bg-white rounded-md border border-gray-200 transition-all duration-200';
  const variants: Record<string, string> = {
    basic: 'p-5',
    stat: 'p-5',
    elevated: 'p-5 shadow-md hover:shadow-lg',
  };
  const interactive = onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-sm' : '';

  return (
    <div className={`${base} ${variants[variant]} ${interactive} ${className}`} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  );
};

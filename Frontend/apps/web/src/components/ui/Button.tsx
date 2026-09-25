import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'outline';
  themeAccent?: 'teal' | 'purple' | 'coral';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  themeAccent = 'teal',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  let accentStyles = '';

  if (variant === 'primary') {
    if (themeAccent === 'teal') accentStyles = 'bg-brand-teal hover:bg-brand-teal-strong active:bg-brand-teal-deep text-white shadow-card hover:shadow-card-hover';
    else if (themeAccent === 'purple') accentStyles = 'bg-[#5B4B8A] hover:bg-[#4a3d72] active:bg-[#3f3260] text-white shadow-card hover:shadow-card-hover';
    else if (themeAccent === 'coral') accentStyles = 'bg-[#D85A30] hover:bg-[#b84b26] active:bg-[#9d4020] text-white shadow-card hover:shadow-card-hover';
  } else if (variant === 'secondary' || variant === 'outline') {
    if (themeAccent === 'teal') accentStyles = 'border border-brand-teal/35 text-brand-teal hover:bg-brand-teal-soft active:bg-brand-teal-light';
    else if (themeAccent === 'purple') accentStyles = 'border border-[#5B4B8A]/35 text-[#5B4B8A] hover:bg-[#F3F0F9] active:bg-[#eae5f5]';
    else if (themeAccent === 'coral') accentStyles = 'border border-[#D85A30]/35 text-[#b84b26] hover:bg-[#FDF2EE] active:bg-[#f9e4da]';
  } else if (variant === 'tertiary') {
    accentStyles = 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-transparent';
  } else if (variant === 'destructive') {
    accentStyles = 'bg-red-600 hover:bg-red-700 text-white shadow-card hover:shadow-card-hover';
  }

  let sizeStyles = 'px-4 py-2 text-sm';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-xs';
  if (size === 'lg') sizeStyles = 'px-6 py-3 text-base';

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold rounded-md transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${accentStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

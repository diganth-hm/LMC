import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'chart' | 'text' | 'avatar';
  count?: number;
  className?: string;
}

const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200/70 rounded-lg ${className}`} />
);

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'card', count = 1, className = '' }) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200/80 p-5 space-y-3 shadow-xs">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-8 w-28" />
            <Shimmer className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-xs">
            <Shimmer className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3 w-40" />
              <Shimmer className="h-3 w-24" />
            </div>
            <Shimmer className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200/80 p-6 shadow-xs ${className}`}>
        <Shimmer className="h-4 w-32 mb-4" />
        <Shimmer className="h-64 w-full" />
      </div>
    );
  }

  if (variant === 'avatar') {
    return <Shimmer className={`h-10 w-10 rounded-full ${className}`} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((_, i) => (
        <Shimmer key={i} className="h-3 w-full" />
      ))}
    </div>
  );
};

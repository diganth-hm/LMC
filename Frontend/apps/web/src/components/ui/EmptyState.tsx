import React from 'react';
import { Leaf } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  themeAccent?: 'teal' | 'purple' | 'coral';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction, themeAccent = 'teal' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon || <Leaf className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-5 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" themeAccent={themeAccent} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

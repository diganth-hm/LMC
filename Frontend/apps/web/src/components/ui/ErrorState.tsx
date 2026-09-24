import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { ApiError } from '../../types';

interface ErrorStateProps {
  error?: ApiError | Error | null;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, message, onRetry }) => {
  const displayMessage = message || (error && 'message' in error ? error.message : 'Something went wrong. Please try again.');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Something went wrong</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-sm">{displayMessage}</p>
      {onRetry && (
        <Button variant="outline" themeAccent="teal" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

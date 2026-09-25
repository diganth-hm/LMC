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
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-up">
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Something went wrong</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-sm leading-relaxed">{displayMessage}</p>
      {onRetry && (
        <Button variant="outline" themeAccent="teal" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

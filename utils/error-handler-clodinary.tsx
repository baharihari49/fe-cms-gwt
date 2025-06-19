// utils/error-handler.ts

import React from 'react';
import { CloudinaryError } from '@/lib/api/cloudinary-api';

export interface ErrorDisplayOptions {
  showTechnicalDetails?: boolean;
  defaultMessage?: string;
  includeErrorCode?: boolean;
}

/**
 * Format error for user display with user-friendly messages
 */
export const formatUserFriendlyError = (
  error: unknown,
  options: ErrorDisplayOptions = {}
): string => {
  const {
    showTechnicalDetails = false,
    defaultMessage = 'Something went wrong. Please try again.',
    includeErrorCode = false
  } = options;

  if (error instanceof CloudinaryError) {
    let message = getUserFriendlyMessage(error);
    
    if (includeErrorCode && error.code) {
      message += ` (Code: ${error.code})`;
    }
    
    if (showTechnicalDetails && error.originalError) {
      message += `\n\nTechnical details: ${error.originalError.message || 'Unknown error'}`;
    }
    
    return message;
  }
  
  if (error instanceof Error) {
    return showTechnicalDetails ? error.message : defaultMessage;
  }
  
  return defaultMessage;
};

/**
 * Get user-friendly message based on error type
 */
const getUserFriendlyMessage = (error: CloudinaryError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return error.message; // Validation messages are already user-friendly
      
    case 'UPLOAD_ERROR':
      if (error.statusCode === 413) {
        return 'The file you selected is too large. Please choose a smaller image.';
      }
      if (error.statusCode === 400) {
        return 'The file format is not supported. Please use JPG, PNG, or GIF.';
      }
      if (error.statusCode === 401) {
        return 'Upload failed due to authentication issues. Please try again.';
      }
      if (error.statusCode === 403) {
        return 'You don\'t have permission to upload images. Please contact support.';
      }
      return 'Failed to upload image. Please check your file and try again.';
      
    case 'DELETE_ERROR':
      if (error.statusCode === 404) {
        return 'The image was not found and may have already been deleted.';
      }
      if (error.statusCode === 401 || error.statusCode === 403) {
        return 'You don\'t have permission to delete this image.';
      }
      return 'Failed to delete image. Please try again.';
      
    case 'NETWORK_ERROR':
      return 'Network connection failed. Please check your internet connection and try again.';
      
    case 'CONFIG_ERROR':
      return 'Service configuration error. Please contact support.';
      
    case 'INVALID_URL':
      return 'The image URL is invalid or corrupted.';
      
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Error notification component for React
 */
export interface ErrorNotificationProps {
  error: unknown;
  onDismiss?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onDismiss,
  showRetry = false,
  onRetry,
  className = ''
}) => {
  const message = formatUserFriendlyError(error);
  const isValidationError = error instanceof CloudinaryError && error.code === 'VALIDATION_ERROR';
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {isValidationError ? 'File Validation Error' : 'Upload Error'}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {(showRetry || onDismiss) && (
            <div className="mt-4 flex space-x-2">
              {showRetry && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="bg-white px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Hook for managing error state with automatic dismiss
 */
export const useErrorHandler = (autoDismissAfter?: number) => {
  const [error, setError] = React.useState<unknown>(null);
  const [dismissTimer, setDismissTimer] = React.useState<NodeJS.Timeout | null>(null);

  const showError = React.useCallback((newError: unknown) => {
    setError(newError);
    
    if (autoDismissAfter && autoDismissAfter > 0) {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
      
      const timer = setTimeout(() => {
        setError(null);
        setDismissTimer(null);
      }, autoDismissAfter);
      
      setDismissTimer(timer);
    }
  }, [autoDismissAfter, dismissTimer]);

  const dismissError = React.useCallback(() => {
    setError(null);
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      setDismissTimer(null);
    }
  }, [dismissTimer]);

  React.useEffect(() => {
    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [dismissTimer]);

  return {
    error,
    showError,
    dismissError,
    hasError: error !== null
  };
};

/**
 * Error boundary for Cloudinary components
 */
export interface CloudinaryErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class CloudinaryErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>,
  CloudinaryErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): CloudinaryErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Cloudinary Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback;
      
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error} 
            retry={() => this.setState({ hasError: false, error: null })}
          />
        );
      }
      
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Image Upload Component Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Something went wrong with the image upload component.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Utility to log errors for monitoring
 */
export const logError = (error: unknown, context?: string) => {
  const errorInfo = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    url: typeof window !== 'undefined' ? window.location.href : 'Server'
  };

  console.error('Cloudinary Error:', errorInfo);
  
  // Here you can send to your error monitoring service
  // Example: Sentry, LogRocket, etc.
  // Sentry.captureException(error, { extra: errorInfo });
};

export default {
  formatUserFriendlyError,
  ErrorNotification,
  useErrorHandler,
  CloudinaryErrorBoundary,
  logError
};
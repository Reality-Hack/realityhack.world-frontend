'use client';
import LogoutButton from "./auth/LogoutButton";

interface ErrorDisplayProps {
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    showLogout?: boolean;
  }
  
  export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    title,
    message,
    actionLabel = 'Retry',
    onAction,
    showLogout = true
  }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white text-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-row gap-2 justify-center">
          {onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-blue rounded bg-blue-500 text-white transition-colors"
            >
              {actionLabel}
            </button>
          )}
          {showLogout && (
            <LogoutButton
              className="bg-blue-500"
              collapsed={true}
            />
          )}
        </div>
      </div>
    </div>
  );
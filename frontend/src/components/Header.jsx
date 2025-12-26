import React from 'react';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { user, logout, saveStatus } = useApp();

  const getSaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
            Saving...
          </span>
        );
      case 'saved':
        return (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            Saved
          </span>
        );
      case 'error':
        return (
          <span className="text-xs text-red-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full"></span>
            Error
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-light text-gray-900">
            Priority Focus Manager
          </h1>
          {getSaveStatusIndicator()}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

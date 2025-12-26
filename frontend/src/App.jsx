import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './components/Auth';
import Header from './components/Header';
import PriorityGrid from './components/PriorityGrid';

const AppContent = () => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden">
        <PriorityGrid />
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

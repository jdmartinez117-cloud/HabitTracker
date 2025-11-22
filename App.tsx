import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
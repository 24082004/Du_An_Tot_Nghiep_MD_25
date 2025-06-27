import React, { useState } from 'react';
import './App.css';
import SimpleLogin from './Pages/SimpleLogin';
import AdminLayout from './Pages/AdminLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <AdminLayout onLogout={handleLogout} />
      ) : (
        <SimpleLogin onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    const checkConnectionAndSession = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const sessionUser = await manifest.from('Mouse').me();
          if (sessionUser) {
            setCurrentUser(sessionUser);
            setCurrentScreen('dashboard');
            console.log('✅ [APP] User session found:', sessionUser.name);
          }
        } catch (error) {
          console.log('ℹ️ [APP] No active user session.');
          setCurrentUser(null);
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
    };

    checkConnectionAndSession();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const sessionUser = await manifest.from('Mouse').me();
      setCurrentUser(sessionUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setCurrentUser(null);
    setCurrentScreen('landing');
  };

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${backendConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span className={`h-2 w-2 rounded-full mr-2 ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
        </div>
      </div>
      {currentUser ? (
        <DashboardPage user={currentUser} onLogout={handleLogout} manifest={manifest} />
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

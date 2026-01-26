import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = React.useState(false);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Lädt...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return children;
}

export default ProtectedRoute;

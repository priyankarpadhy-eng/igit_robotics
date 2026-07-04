import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';

export default function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0f1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontFamily: 'sans-serif',
        fontSize: '0.9rem',
        letterSpacing: '1px'
      }}>
        ESTABLISHING CONNECTION...
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

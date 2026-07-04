// FILE: frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  // If already logged in and role is known, redirect
  if (!authLoading && !roleLoading && user) {
    return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext handles the profile upsert & then useRole will trigger the redirect
    } catch (err) {
      setError('Invalid credentials or access denied.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Google authentication failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
      >
        <div className="login-header">
          <div className="login-tag">// ACCESS PORTAL</div>
          <h1 className="login-title heading">AXIOM <span className="text-neon">RC</span></h1>
          <p className="login-subtitle">Engineer the Future</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>TERMINAL ID (EMAIL)</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="user@axiom-rc.com"
              required 
            />
          </div>

          <div className="form-group">
            <label>ACCESS KEY (PASSWORD)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-primary w-full py-4 mt-6">
            ESTABLISH CONNECTION
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={handleGoogleLogin} className="btn-secondary w-full py-4 flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          NEURAL LINK (GOOGLE)
        </button>
      </motion.div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--dark);
          position: relative;
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(0, 245, 212, 0.05) 0%, transparent 50%),
            linear-gradient(rgba(0, 245, 212, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 212, 0.02) 1px, transparent 1px);
          background-size: 100% 100%, 40px 40px, 40px 40px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 3rem;
          background: rgba(10, 22, 40, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 245, 212, 0.1);
          border-radius: 24px;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }
        .login-tag {
          font-family: var(--font-orbitron);
          font-size: 0.7rem;
          letter-spacing: 4px;
          color: var(--muted);
          margin-bottom: 1rem;
        }
        .login-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .login-subtitle {
          font-size: 0.9rem;
          color: var(--muted);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 2px;
          color: var(--muted);
          margin-bottom: 0.75rem;
        }
        input {
          width: 100%;
          height: 48px;
          background: rgba(5, 10, 15, 0.5);
          border: 1px solid rgba(0, 245, 212, 0.15);
          border-radius: 8px;
          padding: 0 1rem;
          color: white;
          font-family: 'Exo 2', sans-serif;
          transition: all 0.3s ease;
        }
        input:focus {
          outline: none;
          border-color: var(--neon);
          background: rgba(5, 10, 15, 0.8);
          box-shadow: 0 0 15px rgba(0, 245, 212, 0.15);
        }
        .divider {
          margin: 1.5rem 0;
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--muted);
          font-size: 0.7rem;
          font-weight: 900;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .divider span {
          padding: 0 1rem;
        }
        .login-error {
          color: #ff4d4d;
          font-size: 0.8rem;
          margin-top: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

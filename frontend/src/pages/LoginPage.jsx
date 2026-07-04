import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });

  const triggerToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 3000);
  };

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  // If already logged in as admin, redirect to dashboard
  if (!authLoading && !roleLoading && user && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      triggerToast('Welcome back, establishing secure connection...', 'success');
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code) || 'Invalid credentials or access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send confirmation email
      await sendEmailVerification(userCredential.user);
      setInfoMessage('Verification email sent! Please check your inbox before logging in.');
      setMode('login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code) || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMessage('Password reset link sent! Check your email to configure a new access key.');
      setMode('login');
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code) || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setInfoMessage('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password credentials.';
      case 'auth/email-already-in-use':
        return 'This email address is already registered.';
      case 'auth/weak-password':
        return 'Password is too weak. Must be at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many login attempts. Access is locked temporarily.';
      default:
        return null;
    }
  };

  return (
    <div className="login-container">
      {/* Toast Alert */}
      {toast.text && (
        <div className={`toast-alert ${toast.type}`}>
          {toast.text}
        </div>
      )}

      <div className="login-overlay" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="login-card"
      >
        {/* Club Logo */}
        <div className="login-logo-box">
          <img src="/club-logo.png" alt="IGIT Robotics Logo" className="login-logo" />
        </div>

        {/* Section Heading */}
        <div className="login-header">
          {mode === 'login' && (
            <>
              <h1 className="login-title">Sign in to Axiom</h1>
              <p className="login-subtitle">Enter your keys to establish connection</p>
            </>
          )}
          {mode === 'register' && (
            <>
              <h1 className="login-title">Create Account</h1>
              <p className="login-subtitle">Request access to the engineering portal</p>
            </>
          )}
          {mode === 'forgot' && (
            <>
              <h1 className="login-title">Reset Access Key</h1>
              <p className="login-subtitle">Retrieve a recovery link via email</p>
            </>
          )}
        </div>

        {/* Alert Panels */}
        {error && <div className="alert-box error">{error}</div>}
        {infoMessage && <div className="alert-box success">{infoMessage}</div>}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="user@axiom-rc.com"
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>PASSWORD</label>
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')} 
                  className="link-btn text-brand"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'CONNECTING...' : 'SIGN IN'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="user@axiom-rc.com"
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>CONFIRM PASSWORD</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="login-form">
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="user@axiom-rc.com"
                required 
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'SENDING...' : 'SEND RECOVERY LINK'}
            </button>
          </form>
        )}

        {/* Mode switches */}
        <div className="mode-footer">
          {mode === 'login' && (
            <p>
              Don't have access?{' '}
              <button onClick={() => setMode('register')} className="link-btn" disabled={loading}>
                Create an account
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="link-btn" disabled={loading}>
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              Remember access keys?{' '}
              <button onClick={() => setMode('login')} className="link-btn" disabled={loading}>
                Back to Sign in
              </button>
            </p>
          )}
        </div>

        {/* Social login partition */}
        {mode === 'login' && (
          <>
            <div className="divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <button onClick={handleGoogleLogin} className="btn-secondary" disabled={loading}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              NEURAL LINK (GOOGLE)
            </button>
          </>
        )}
      </motion.div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #070a13;
          position: relative;
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(251, 197, 49, 0.03) 0%, transparent 50%),
            linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
          background-size: 100% 100%, 48px 48px, 48px 48px;
          padding: 24px;
          box-sizing: border-box;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 32px;
          background: #090d18;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          z-index: 10;
          box-sizing: border-box;
        }

        .login-logo-box {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .login-logo {
          height: 72px;
          width: auto;
          object-fit: contain;
        }

        .login-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .login-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: white;
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
        }
        .login-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        .alert-box {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.4;
          text-align: left;
        }
        .alert-box.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }
        .alert-box.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .form-group label {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: #64748b;
        }
        .form-group input {
          width: 100%;
          height: 44px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0 12px;
          color: white;
          font-size: 0.9rem;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .form-group input:focus {
          outline: none;
          border-color: #fbc531;
          background: rgba(0, 0, 0, 0.4);
        }

        .btn-primary {
          height: 44px;
          background: #fbc531;
          color: #0f172a;
          font-weight: 900;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }
        .btn-primary:hover {
          background: #f1b31c;
          transform: translateY(-1px);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .link-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-weight: 800;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s ease;
        }
        .link-btn:hover {
          color: white;
        }
        .link-btn.text-brand {
          color: #fbc531;
        }
        .link-btn.text-brand:hover {
          color: #f1b31c;
        }

        .mode-footer {
          margin-top: 20px;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 700;
        }
        .mode-footer p {
          margin: 0;
        }
        .mode-footer .link-btn {
          color: white;
          text-decoration: underline;
        }

        .divider {
          margin: 20px 0;
          display: flex;
          align-items: center;
          text-align: center;
          color: #475569;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.5px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .divider span {
          padding: 0 12px;
        }

        .btn-secondary {
          height: 44px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .google-icon {
          width: 18px;
          height: 18px;
        }

        .toast-alert {
          position: fixed;
          top: 24px;
          right: 24px;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          z-index: 10000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          background: #10b981;
          color: white;
          animation: slideIn 0.3s ease-out;
        }
        .toast-alert.error {
          background: #ef4444;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

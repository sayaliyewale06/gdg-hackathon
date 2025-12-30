import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './LoginSelection.css';

const LoginSelection = () => {
  const [role, setRole] = useState(null); // 'hire', 'worker', or null
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();
  const { signInWithGoogle, currentUser, userRole, error: authError } = useAuth();

  useEffect(() => {
    console.log('Current role state:', role);
  }, [role]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userRole) {
      if (userRole === 'worker') {
        navigate('/worker-dashboard');
      } else if (userRole === 'hire') {
        navigate('/hire-dashboard');
      }
    }
  }, [currentUser, userRole, navigate]);

  const handleRoleSelect = (selectedRole) => {
    console.log('Clicking on:', selectedRole);
    setRole(prevRole => prevRole === selectedRole ? null : selectedRole);
    setLocalError(null);
  };

  const handleGoogleLogin = async () => {
    if (!role) {
      setLocalError('Please select a role (Hire or Worker) before signing in');
      return;
    }

    setLoading(true);
    setLocalError(null);

    try {
      await signInWithGoogle(role);
      // Navigation will happen automatically via useEffect above
    } catch (error) {
      console.error('Login error:', error);
      setLocalError(error.message || 'Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-selection-container">
      {/* Hire Half */}
      <div
        className={`selection-half hire ${role === 'hire' ? 'expanded' : role === 'worker' ? 'shrunk' : ''}`}
        onClick={() => handleRoleSelect('hire')}
      >
        <img
          src="/hire-person.png"
          alt="Hire"
          className={`hire-image ${role === 'hire' ? 'image-active' : ''}`}
        />
        <div className="content-wrapper">
          <h1 className="selection-title">Hire</h1>
        </div>
      </div>

      {/* Worker Half */}
      <div
        className={`selection-half worker ${role === 'worker' ? 'expanded' : role === 'hire' ? 'shrunk' : ''}`}
        onClick={() => handleRoleSelect('worker')}
      >
        <img
          src="/worker-person.png"
          alt="Worker"
          className={`worker-image ${role === 'worker' ? 'image-active' : ''}`}
        />
        <div className="content-wrapper">
          <h1 className="selection-title">Worker</h1>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className={`login-card-container ${role === 'hire' ? 'move-hire' : role === 'worker' ? 'move-worker' : ''}`}>
        <div className="login-card">
          <h2>{role === 'worker' ? 'Login as Worker' : role === 'hire' ? 'Login as Hirer' : 'Login'}</h2>

          {(localError || authError) && <div className="error-message">{localError || authError}</div>}

          <div className="google-login-wrapper">
            <button
              type="button"
              className={`google-login-btn ${role ? `google-login-btn-${role}` : ''}`}
              onClick={handleGoogleLogin}
              disabled={loading || !role}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {role ? 'Sign in with Google' : 'Select a Role to Continue'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;

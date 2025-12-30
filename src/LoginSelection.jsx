import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSelection.css';

const LoginSelection = () => {
  const [role, setRole] = useState(null); // 'hire', 'worker', or null
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current role state:', role);
  }, [role]);

  const handleRoleSelect = (selectedRole) => {
    console.log('Clicking on:', selectedRole);
    setRole(prevRole => prevRole === selectedRole ? null : selectedRole);
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

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Email / Username</label>
              <input type="text" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button type="submit" className="login-btn" onClick={() => {
              if (role) {
                // Here you would typically handle authentication
                console.log(`Logging in as ${role}`);
                localStorage.setItem('userRole', role); // Simulating auth
                if (role === 'worker') {
                  navigate('/worker-dashboard');
                } else if (role === 'hire') {
                  navigate('/hire-dashboard');
                }
              }
            }}>
              {role ? 'Sign In' : 'Select a Role to Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const HirerDashboard = () => {
    const { currentUser, userRole, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not authenticated or wrong role
        if (!currentUser) {
            navigate('/');
        } else if (userRole && userRole !== 'hire') {
            navigate('/worker-dashboard');
        }
    }, [currentUser, userRole, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!currentUser) {
        return <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="dashboard-container" style={{
            padding: '40px',
            color: 'white',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {currentUser.photoURL && (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    border: '2px solid #4ecca3'
                                }}
                            />
                        )}
                        <div>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>
                                {currentUser.displayName || 'Hirer'}
                            </h2>
                            <p style={{ margin: 0, color: '#b2bec3', fontSize: '0.9rem' }}>
                                {currentUser.email}
                            </p>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '8px',
                                padding: '4px 12px',
                                background: 'rgba(78, 204, 163, 0.2)',
                                color: '#4ecca3',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                Hirer
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '12px 24px',
                            background: '#4ecca3',
                            color: '#1a1a2e',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Logout
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Hirer Dashboard</h1>
                    <p style={{ fontSize: '1.2rem', color: '#b2bec3' }}>
                        Welcome! Here you can post jobs and find workers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HirerDashboard;

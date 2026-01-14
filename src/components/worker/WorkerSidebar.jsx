import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaBriefcase, FaStar, FaWallet, FaMapMarkerAlt, FaCheckCircle, FaGlobe, FaQrcode, FaCommentDots, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const WorkerSidebar = ({ activeView, setActiveView, userProfile, isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (view) => {
        if (onClose) onClose(); // Close sidebar on mobile when nav item clicked

        if (setActiveView) {
            setActiveView(view);
        } else {
            navigate('/worker-dashboard', { state: { view } });
        }
    };

    return (
        <aside className={`left-panel ${isOpen ? 'open' : ''}`}>
            <div className="profile-card">
                <div className="profile-image-wrapper">
                    <img
                        src={currentUser?.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s"}
                        alt={currentUser?.displayName || "Worker"}
                        className="profile-img"
                    />
                </div>
                <div className="profile-details">
                    <h2>{currentUser?.displayName || "Worker"}</h2>
                    <p className="role">{userProfile?.status || "Verified Worker"}</p>
                    <p className="phone">{userProfile?.phone || currentUser?.email || "+91 98765 43210"}</p>
                </div>
            </div>

            <nav className="left-menu">
                <a href="#" className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('dashboard'); }}><FaBriefcase /> Dashboard</a>
                <Link to="/profile" className={`menu-item ${location.pathname === '/profile' ? 'active' : ''}`}><FaUser /> Profile</Link>
                <a href="#" className={`menu-item ${activeView === 'findjobs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('findjobs'); }}><FaSearch /> Find Jobs</a>
                <a href="#" className={`menu-item ${activeView === 'activejobs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('activejobs'); }}><FaBriefcase /> Active Jobs</a>
                <a href="#" className={`menu-item ${activeView === 'myjobs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('myjobs'); }}><FaUserCircle /> My Jobs</a>
                <a href="#" className={`menu-item ${activeView === 'messages' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('messages'); }}><FaCommentDots /> Messages</a>
                <a href="#" className={`menu-item ${activeView === 'reviews' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('reviews'); }}><FaStar /> Reviews</a>
                <a href="#" className={`menu-item ${activeView === 'qrcode' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('qrcode'); }}><FaQrcode /> My QR Code</a>
                <a href="#" className={`menu-item ${activeView === 'earnings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('earnings'); }}><FaWallet /> Earnings</a>
            </nav>

            <div className="side-stats-panel" style={{ height: 'auto', padding: '20px' }}>
                <div style={{ marginBottom: '8px', color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Total Earnings</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-text)' }}>
                    ₹{userProfile?.totalEarnings?.toLocaleString() || '0'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--secondary-text)' }}>This Week</span>
                    <span style={{ fontWeight: '600' }}>
                        ₹{userProfile?.weeklyEarnings?.toLocaleString() || '0'}
                    </span>
                </div>
                <button className="sidebar-action-btn" style={{ marginTop: '20px' }} onClick={() => handleNavigation('findjobs')}>Find Jobs</button>
            </div>

            <div className="verification-list">
                <div className="verify-item">
                    <FaCheckCircle className="verify-icon" /> Profile Verified
                </div>
                <div className="verify-item">
                    <FaCheckCircle className="verify-icon" /> Phone number verified
                </div>
            </div>
            <div className="lang-selector">
                <FaGlobe /> English
            </div>
        </aside>
    );
};

export default WorkerSidebar;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HirerDashboardHome from './HirerDashboardHome';
import PostJob from './PostJob';
import Applicants from './Applicants';
import Messages from './Messages';
import ShortlistedWorkers from './ShortlistedWorkers';
import Notifications from './Notifications';
import Reports from './Reports';
import RecentHiresSidebar from './RecentHiresSidebar';
import './HirerDashboard.css';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    MessageSquare,
    FileText,
    Bell,
    MapPin,
    Plus,
    Menu,
    X,
} from 'lucide-react';

const HirerDashboard = () => {
    const { currentUser, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isPostJobPage = location.pathname === '/hire-dashboard/post-job';
    const isFindWorkersPage = location.pathname === '/hire-dashboard/find-workers';
    const isShortlistedPage = location.pathname === '/hire-dashboard/shortlisted-workers';
    const isMessagesPage = location.pathname === '/hire-dashboard/messages';
    const isNotificationsPage = location.pathname === '/hire-dashboard/notifications';
    const isReportsPage = location.pathname === '/hire-dashboard/reports';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Only show Recent Hires sidebar on dashboard home
    const showRecentHires = location.pathname === '/hire-dashboard' ||
        location.pathname === '/hire-dashboard/' ||
        location.pathname === '/';

    useEffect(() => {
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

    if (!currentUser) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="hirer-dashboard">

            {/* 1. FIXED HEADER */}
            <header className="main-header">
                <div className="brand logo-clickable" onClick={() => navigate('/hire-dashboard')}>
                    <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <MapPin className="brand-icon" size={28} />
                    <span>Digital Naka</span>
                </div>



                <div className="header-actions">
                    <button
                        className={`icon-btn ${isNotificationsPage ? 'active' : ''}`}
                        onClick={() => navigate('/hire-dashboard/notifications')}
                    >
                        <Bell size={20} />
                        {/* Mock unread count, could be dynamic based on Notifications state if lifted up */}
                        <span className="badge">3</span>
                    </button>
                    <div className="user-avatar-circle">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* 2. BODY GRID (Left Fixed | Center & Right handled by Router) */}
            <div className={`dashboard-grid-container ${!showRecentHires ? 'full-width' : ''}`}>

                {/* LEFT SIDEBAR (Fixed) */}
                <aside className={`left-sidebar-fixed ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <div className="profile-section">
                        <div className="profile-pic-container">
                            <img
                                src={currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                alt="Profile"
                                className="profile-img-large"
                            />
                        </div>
                        <h2>{currentUser.displayName || "Sunidhi Verma"}</h2>
                        <div className="user-role-label">Employer</div>
                        <div className="user-email">{currentUser.email || "vermasunidhi18@gmail.com"}</div>
                    </div>

                    <nav className="left-nav-menu">
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard'); setIsMobileMenuOpen(false); }}
                            className={`left-nav-item ${location.pathname === '/hire-dashboard' || location.pathname === '/hire-dashboard/' ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/post-job'); setIsMobileMenuOpen(false); }}
                            className={`left-nav-item ${isPostJobPage ? 'active' : ''}`}
                        >
                            <Plus size={18} /> Post Job
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/find-workers'); setIsMobileMenuOpen(false); }}
                            className={`left-nav-item ${isFindWorkersPage ? 'active' : ''}`}
                        >
                            <Users size={18} /> Find Workers
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/shortlisted-workers'); setIsMobileMenuOpen(false); }}
                            className={`left-nav-item ${isShortlistedPage ? 'active' : ''}`}
                        >
                            <Briefcase size={18} /> Shortlisted
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/messages'); setIsMobileMenuOpen(false); }}
                            className={`left-nav-item ${isMessagesPage ? 'active' : ''}`}
                        >
                            <MessageSquare size={18} /> Messages
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/notifications'); setIsMobileMenuOpen(false); }}
                            className={`left-nav-item ${isNotificationsPage ? 'active' : ''}`}
                        >
                            <Bell size={18} /> Notifications
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/reports'); setIsMobileMenuOpen(false); }}
                            className={`left-nav-item ${isReportsPage ? 'active' : ''}`}
                        >
                            <FileText size={18} /> Reports
                        </a>
                    </nav>
                </aside>

                {/* CENTER CONTENT AREA (Scrollable) */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HirerDashboardHome />} />
                        <Route path="post-job" element={<PostJob />} />
                        <Route path="find-workers" element={<Applicants />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="shortlisted-workers" element={<ShortlistedWorkers />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="reports" element={<Reports />} />
                    </Routes>
                </main>

                {/* RIGHT SIDEBAR (Fixed) - Only on Home Dashboard */}
                {showRecentHires && <RecentHiresSidebar />}
            </div>

        </div>
    );
};

export default HirerDashboard;

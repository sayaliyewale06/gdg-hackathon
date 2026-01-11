import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';
import PostJobModal from './components/PostJobModal';
import './HirerDashboard.css';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    MessageSquare,
    FileText,
    Bell,
    Search,
    MapPin,
    Plus,
    Star,
    CheckCircle,
    Globe,
    RefreshCw,
    Settings
} from 'lucide-react';

const HirerDashboard = () => {
    const { currentUser, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const [stats, setStats] = useState({
        ongoing: 0,
        applicants: 0 // Placeholder as we don't have applicant logic yet
    });

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        } else if (userRole && userRole !== 'hire') {
            navigate('/worker-dashboard');
        }
    }, [currentUser, userRole, navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            if (currentUser?.uid) {
                try {
                    const jobs = await DB.jobs.getByHirer(currentUser.uid);
                    // Filter for open or in_progress jobs
                    const ongoing = jobs.filter(j => ['open', 'in_progress'].includes(j.status)).length;
                    setStats(prev => ({ ...prev, ongoing }));
                } catch (error) {
                    console.error("Error fetching stats:", error);
                }
            }
        };
        fetchStats();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!currentUser) return <div className="loading-screen">Loading...</div>;

    // Dummy data for Recent Hires (Right Sidebar)
    const recentHires = [
        { id: 1, name: 'Ramesh Yadav', role: 'Electrician', rating: 4.5, phone: '+91 9067 65****', pic: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 2, name: 'Suresh Kumar', role: 'Plumber', rating: 5.0, phone: '+91 9125 45****', pic: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { id: 3, name: 'Mohan Das', role: 'Electrician', rating: 4.8, phone: '+91 9665 32****', pic: 'https://randomuser.me/api/portraits/men/62.jpg' },
        { id: 4, name: 'Vinod Patel', role: 'Mason', rating: 4.5, phone: '+91 9876 54****', pic: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { id: 5, name: 'Raju Singh', role: 'Painter', rating: 4.2, phone: '+91 8888 12****', pic: 'https://randomuser.me/api/portraits/men/22.jpg' },
        { id: 6, name: 'Anita Desai', role: 'Cleaner', rating: 4.9, phone: '+91 7777 99****', pic: 'https://randomuser.me/api/portraits/women/44.jpg' },
    ];

    return (
        <div className="hirer-dashboard">

            {/* 1. FIXED HEADER */}
            <header className="main-header">
                <div className="brand" onClick={() => navigate('/hire-dashboard')} style={{ cursor: 'pointer' }}>
                    <MapPin className="brand-icon" size={28} />
                    <span>Digital Naka</span>
                </div>

                <nav className="top-nav">
                    <a href="#" className="nav-link active">
                        <LayoutDashboard size={18} /> Dashboard
                    </a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setIsPostJobOpen(true); }}>
                        Post Job
                    </a>
                    <a href="#" className="nav-link">
                        Find Workers
                    </a>
                    <a href="#" className="nav-link">
                        Messages
                    </a>
                    <a href="#" className="nav-link">
                        Reports
                    </a>
                </nav>

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

            {/* 2. BODY GRID (Left Fixed | Center Scroll | Right Fixed) */}
            <div className="dashboard-grid-container">

                {/* LEFT SIDEBAR (Fixed) */}
                <aside className="left-sidebar-fixed">
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
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard'); }}
                            className={`left-nav-item ${!isPostJobPage && !isFindWorkersPage && !isMessagesPage && !isShortlistedPage && !isNotificationsPage && !isReportsPage ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/post-job'); }}
                            className={`left-nav-item ${isPostJobPage ? 'active' : ''}`}
                        >
                            <Plus size={18} /> Post Job
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/find-workers'); }}
                            className={`left-nav-item ${isFindWorkersPage ? 'active' : ''}`}
                        >
                            <Users size={18} /> Find Workers
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/shortlisted-workers'); }}
                            className={`left-nav-item ${isShortlistedPage ? 'active' : ''}`}
                        >
                            <Briefcase size={18} /> Shortlisted
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/messages'); }}
                            className={`left-nav-item ${isMessagesPage ? 'active' : ''}`}
                        >
                            <MessageSquare size={18} /> Messages
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/notifications'); }}
                            className={`left-nav-item ${isNotificationsPage ? 'active' : ''}`}
                        >
                            <Bell size={18} /> Notifications
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/hire-dashboard/reports'); }}
                            className={`left-nav-item ${isReportsPage ? 'active' : ''}`}
                        >
                            <FileText size={18} /> Reports
                        </a>
                    </nav>
                </aside>

                {/* Right Content Area (Center + Right Panel) */}
                <main className="main-content-area">
                    {/* CENTER COLUMN */}
                    <div className="dashboard-center-col">
                        <div className="welcome-section">
                            <h1>Hirer Dashboard</h1>
                            <p>Welcome, <strong>{currentUser.displayName || "Hirer"}!</strong> Find & hire daily-wage workers instantly.</p>
                        </div>

                        {/* Stats Overview */}
                        <div className="stats-overview">
                            <div className="info-card">
                                <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                                    <Briefcase size={24} />
                                </div>
                                <div className="card-text-content">
                                    <div className="card-title">Ongoing Jobs</div>
                                    <div className="card-value">{stats.ongoing}</div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                                    <Users size={24} />
                                </div>
                                <div className="card-text-content">
                                    <div className="card-title">Applicants</div>
                                    <div className="card-value">23 <span>New</span></div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                                    <Star size={24} />
                                </div>
                                <div className="card-text-content">
                                    <div className="card-title">Shortlisted Workers</div>
                                    <div className="card-value">7</div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                                    <Bell size={24} />
                                </div>
                                <div className="card-text-content">
                                    <div className="card-title">Notifications</div>
                                    <div className="card-value">1 <span>New</span></div>
                                </div>
                                <button className="post-job-small-btn" onClick={() => setIsPostJobOpen(true)}><Plus size={16} /> Post Job</button>
                            </div>
                        </div>

                        <PostJobModal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} />

                        {/* Map & Side Panel */}
                        <div className="middle-grid">
                            <div className="map-container">
                                <div className="section-heading-row">
                                    <div style={{ display: 'flex', alignItems: 'center' }}><Search size={18} style={{ marginRight: 8 }} /> Worker Availability Heatmap</div>
                                    <div className="map-icons-right">
                                        <RefreshCw size={16} />
                                        <Settings size={16} />
                                    </div>
                                </div>
                                <div
                                    className="stat-card clickable"
                                    onClick={() => navigate('/hire-dashboard/find-workers')}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && navigate('/hire-dashboard/find-workers')}
                                >
                                    <div className="stat-icon-circle tan"><Users size={24} /></div>
                                    <div className="stat-info">
                                        <div className="stat-label">Applicants</div>
                                        <div className="stat-value">23 <span className="stat-new">New</span></div>
                                    </div>
                                </div>
                                <div
                                    className="stat-card clickable"
                                    onClick={() => navigate('/hire-dashboard/shortlisted-workers')}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && navigate('/hire-dashboard/shortlisted-workers')}
                                >
                                    <div className="stat-icon-circle tan"><Star size={24} /></div>
                                    <div className="stat-info">
                                        <div className="stat-label">Shortlisted Workers</div>
                                        <div className="stat-value">7</div>
                                    </div>
                                </div>
                                <div
                                    className="stat-card clickable"
                                    onClick={() => navigate('/hire-dashboard/notifications')}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && navigate('/hire-dashboard/notifications')}
                                >
                                    <div className="stat-icon-circle tan"><Bell size={24} /></div>
                                    <div className="stat-info">
                                        <div className="stat-label">Notifications</div>
                                        <div className="stat-value">1 <span className="stat-new">New</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Worker Availability Heatmap */}
                            <div className="map-section-container">
                                <div className="section-header">
                                    <div className="section-title">
                                        <Search size={18} /> Worker Availability Heatmap
                                    </div>
                                    <div className="section-actions">
                                        <RefreshCw size={16} className="action-icon" />
                                        <Settings size={16} className="action-icon" />
                                    </div>
                                </div>

                                <div className="map-wrapper">
                                    {/* Placeholder for Leaflet Map */}
                                    <div className="map-placeholder-bg">
                                        <div className="map-landmark" style={{ top: '30%', left: '40%' }}>📍 Hotel Aga Khan Palace</div>
                                        <div className="map-landmark" style={{ top: '60%', left: '20%' }}>📍 Sun-n-Sand</div>
                                        <div className="map-landmark" style={{ top: '50%', left: '70%' }}>📍 Mundhwa</div>
                                    </div>

                                    <div className="map-controls">
                                        <button className="map-btn">+</button>
                                        <button className="map-btn">-</button>
                                    </div>

                                    <div className="map-legend-overlay">
                                        <div className="legend-item"><span className="dot low"></span> Low</div>
                                        <div className="legend-item"><span className="dot medium"></span> Medium</div>
                                        <div className="legend-item"><span className="dot high"></span> High</div>
                                    </div>
                                </div>
                            </div>
                        </main>

                        {/* RIGHT SIDEBAR (Scrollable) */}
                        <aside className="right-sidebar-scrollable">
                            <h3 className="right-sidebar-title">Recent Hires</h3>
                            <div className="recent-hires-list">
                                {recentHires.map(worker => (
                                    <div className="worker-card-compact" key={worker.id}>
                                        <div className="worker-card-top">
                                            <img src={worker.pic} alt={worker.name} className="worker-avatar-small" />
                                            <div className="worker-info-compact">
                                                <h4>{worker.name}</h4>
                                                <div className="worker-role">{worker.role} <span className="star">⭐</span></div>
                                                <div className="worker-phone">{worker.phone}</div>
                                            </div>
                                            <button className="view-profile-btn">View Profile</button>
                                        </div>
                                        <div className="worker-card-bottom">
                                            <a href="#" className="contact-link">• Contact</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </>
                )}

            </div>
        </div>
    );
};

export default HirerDashboard;

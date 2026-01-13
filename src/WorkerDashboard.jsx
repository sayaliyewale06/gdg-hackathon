import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './WorkerDashboard.css';
import { DB } from './lib/db';
import WorkerEarnings from './WorkerEarnings';
import WorkerMyJobs from './WorkerMyJobs';
import WorkerReviews from './WorkerReviews';
import WorkerQRCode from './WorkerQRCode';
import WorkerActiveJobs from './WorkerActiveJobs';
import WorkerFindJobs from './WorkerFindJobs';
import WorkerNotifications from './WorkerNotifications';
import WorkerMessages from './WorkerMessages';
import { FaUserCircle, FaSearch, FaBriefcase, FaStar, FaWallet, FaMapMarkerAlt, FaBell, FaUsers, FaPlus, FaCheckCircle, FaGlobe, FaArrowUp, FaQrcode, FaCommentDots } from 'react-icons/fa';

const WorkerDashboard = () => {
    const { currentUser, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeView, setActiveView] = useState('dashboard');

    useEffect(() => {
        if (location.state?.view) {
            setActiveView(location.state.view);
        }
    }, [location.state]);

    const [stats, setStats] = useState({
        earnings: 0,
        activeJobs: 0,
        applications: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [myRecentJobs, setMyRecentJobs] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser?.uid) {
                try {
                    const [allJobs, myApplications, myReviews, userDoc] = await Promise.all([
                        DB.jobs.getAll(),
                        DB.applications.getByWorker(currentUser.uid),
                        DB.reviews.getByTargetUser(currentUser.uid),
                        DB.users.get(currentUser.uid)
                    ]);

                    // Stats
                    const activeApps = myApplications.filter(a => ['accepted', 'in_progress'].includes(a.status));
                    const completedApps = myApplications.filter(a => a.status === 'completed');
                    // Calculate earnings (assuming wage is in the job details attached to application, or we need to fetch jobs)
                    // For now, let's assume we need to join. But for speed, let's just count completed for now or mock the calc if wage isn't in app.
                    // Actually, ApplicationSchema doesn't have wage. We should probably fetch job details.
                    // For simply MVP, let's assume a hardcoded average or just 0 if no logic yet.
                    // Better: Fetch job details for completed apps.
                    let totalEarnings = 0;
                    // We can do a quick lookup if we have all jobs, or just fetch needed.
                    // Since we fetched allJobs, we can map.
                    const jobsMap = new Map(allJobs.map(j => [j.id, j]));

                    completedApps.forEach(app => {
                        const job = jobsMap.get(app.jobId);
                        if (job) totalEarnings += job.wage;
                    });

                    setStats({
                        earnings: totalEarnings,
                        activeJobs: activeApps.length,
                        applications: myApplications.length
                    });

                    if (userDoc) setUserProfile(userDoc);

                    // Recent Listings (Open jobs not applied to?)
                    // Just show all open jobs
                    const openJobs = allJobs.filter(j => j.status === 'open').slice(0, 4);
                    setRecentJobs(openJobs);

                    // My Recent Jobs (Sidebar)
                    setMyRecentJobs(completedApps.slice(0, 2).map(app => ({ ...app, job: jobsMap.get(app.jobId) })));

                    // Recent Reviews
                    setRecentReviews(myReviews.slice(0, 2));

                } catch (error) {
                    console.error("Error fetching worker data:", error);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    useEffect(() => {
        // Redirect if not authenticated or wrong role
        if (!currentUser) {
            navigate('/');
        } else if (userRole && userRole !== 'worker') {
            navigate('/hire-dashboard');
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
        <div className="worker-dashboard">
            {/* Top Header */}
            <header className="main-header">
                <div className="brand logo-clickable" onClick={() => setActiveView('dashboard')}>
                    <FaMapMarkerAlt className="brand-icon" />
                    <span>Digital Naka</span>
                </div>





                <div className="header-actions">

                    <button className="icon-btn" onClick={() => setActiveView('notifications')}>
                        <FaBell />
                        <span className="badge">3</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#5e5e5b',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            marginLeft: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Dashboard Body */}
            <div className="dashboard-body">
                {/* Left Panel */}
                <aside className="left-panel">
                    <div className="profile-card">
                        <div className="profile-image-wrapper">
                            <img
                                src={currentUser.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s"}
                                alt={currentUser.displayName || "Worker"}
                                className="profile-img"
                            />
                        </div>
                        <div className="profile-details">
                            <h2>{currentUser.displayName || "Worker"}</h2>
                            <p className="role">{userProfile?.status || "Verified Worker"}</p>
                            <p className="phone">{userProfile?.phone || currentUser.email || "+91 98765 43210"}</p>
                        </div>
                    </div>

                    <nav className="left-menu">
                        <a href="#" className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}><FaBriefcase /> Dashboard</a>
                        <a href="#" className={`menu-item ${activeView === 'findjobs' ? 'active' : ''}`} onClick={() => setActiveView('findjobs')}><FaSearch /> Find Jobs</a>
                        <a href="#" className={`menu-item ${activeView === 'activejobs' ? 'active' : ''}`} onClick={() => setActiveView('activejobs')}><FaBriefcase /> Active Jobs</a>
                        <a href="#" className={`menu-item ${activeView === 'myjobs' ? 'active' : ''}`} onClick={() => setActiveView('myjobs')}><FaUserCircle /> My Jobs</a>
                        <a href="#" className={`menu-item ${activeView === 'messages' ? 'active' : ''}`} onClick={() => setActiveView('messages')}><FaCommentDots /> Messages</a>
                        <a href="#" className={`menu-item ${activeView === 'reviews' ? 'active' : ''}`} onClick={() => setActiveView('reviews')}><FaStar /> Reviews</a>
                        <a href="#" className={`menu-item ${activeView === 'qrcode' ? 'active' : ''}`} onClick={() => setActiveView('qrcode')}><FaQrcode /> My QR Code</a>
                        <a href="#" className={`menu-item ${activeView === 'earnings' ? 'active' : ''}`} onClick={() => setActiveView('earnings')}><FaWallet /> Earnings</a>
                    </nav>

                    <div className="side-stats-panel" style={{ height: 'auto', padding: '20px' }}>
                        <div style={{ marginBottom: '8px', color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Total Earnings</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-text)' }}>₹{stats.earnings}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--secondary-text)' }}>This Week</span>
                            <span style={{ fontWeight: '600' }}>₹{stats.earnings > 0 ? stats.earnings : 0}</span>
                        </div>
                        <button className="sidebar-action-btn" style={{ marginTop: '20px' }}>Find Jobs</button>
                    </div>

                    <div className="verification-list">
                        <div className="verify-item">
                            <FaCheckCircle className="verify-icon" /> Profile Verified
                        </div>
                        <div className="verify-item">
                            <FaCheckCircle className="verify-icon" /> Phone number verified
                        </div>
                        <div className="verify-item">
                            <FaCheckCircle className="verify-icon" /> Location-based hiring
                        </div>
                    </div>
                    <div className="lang-selector">
                        <FaGlobe /> English
                    </div>
                </aside>

                {/* Main Content Area (Center + Right) */}
                <main className="main-content-area" style={{ display: ['earnings', 'myjobs', 'reviews', 'qrcode', 'activejobs', 'findjobs', 'notifications', 'messages'].includes(activeView) ? 'block' : 'grid', width: '100%' }}>
                    {activeView === 'earnings' && <WorkerEarnings />}

                    {activeView === 'activejobs' && <WorkerActiveJobs />}

                    {activeView === 'findjobs' && <WorkerFindJobs />}

                    {activeView === 'myjobs' && <WorkerMyJobs />}

                    {activeView === 'reviews' && <WorkerReviews />}

                    {activeView === 'qrcode' && <WorkerQRCode />}

                    {activeView === 'notifications' && <WorkerNotifications />}

                    {activeView === 'messages' && <WorkerMessages />}

                    {activeView === 'dashboard' && (
                        <>
                            {/* Center Column */}
                            <div className="dashboard-center-col">
                                <div className="welcome-section">
                                    <h1>Worker Dashboard</h1>
                                    <p>Welcome, {currentUser.displayName || "Worker"}! Find and apply for daily-wage jobs in your area.</p>
                                </div>

                                {/* Stats Row */}
                                <div className="stats-overview">
                                    <div
                                        className="info-card card-clickable"
                                        onClick={() => setActiveView('activejobs')}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => e.key === 'Enter' && setActiveView('activejobs')}
                                    >
                                        <div className="card-icon-box"><FaBriefcase /></div>
                                        <div className="card-text-content">
                                            <div className="card-title">Active Jobs</div>
                                            <div className="card-value">{stats.activeJobs}</div>
                                        </div>
                                    </div>
                                    <div
                                        className="info-card card-clickable"
                                        onClick={() => setActiveView('earnings')}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => e.key === 'Enter' && setActiveView('earnings')}
                                    >
                                        <div className="card-icon-box"><FaWallet /></div>
                                        <div className="card-text-content">
                                            <div className="card-title">Earnings</div>
                                            <div className="card-value">₹{stats.earnings}</div>
                                        </div>
                                    </div>
                                    <div
                                        className="info-card card-clickable"
                                        onClick={() => setActiveView('activejobs')}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => e.key === 'Enter' && setActiveView('activejobs')}
                                    >
                                        <div className="card-icon-box"><FaUsers /></div>
                                        <div className="card-text-content">
                                            <div className="card-title">Applications</div>
                                            <div className="card-value">{stats.applications} <span>Sent</span></div>
                                        </div>
                                    </div>

                                </div>

                                {/* Map Section */}
                                <div className="middle-grid">
                                    <div className="map-container">
                                        <div className="section-heading-row">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <FaMapMarkerAlt /> Job Demand Heatmap
                                            </div>
                                            <div className="map-icons-right">
                                                {/* Icons placeholder */}
                                            </div>
                                        </div>
                                        <div className="real-map-box">
                                            {/* Placeholder Map Image - In real app use Leaflet/Google Maps */}
                                            <img
                                                src="https://www.mapsofindia.com/pune/pune-map.jpg"
                                                alt="Map of Pune"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }}
                                            />
                                            <div className="map-controls-overlay">
                                                <button className="map-ctrl-btn">+</button>
                                                <button className="map-ctrl-btn">-</button>
                                            </div>
                                            <div className="map-legend">
                                                <div><span className="legend-dot" style={{ background: '#E55B5B' }}></span>High Demand</div>
                                                <div><span className="legend-dot" style={{ background: '#F4B400' }}></span>Medium Demand</div>
                                                <div><span className="legend-dot" style={{ background: '#7FB06F' }}></span>Low Demand</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Job Listings */}
                                <div className="section-heading-row">
                                    <h3>Recent Job Listings</h3>
                                </div>
                                <div className="hires-grid">
                                    {recentJobs.length === 0 ? (
                                        <div style={{ padding: '20px', color: '#666' }}>No jobs found.</div>
                                    ) : (
                                        recentJobs.map(job => (
                                            <div className="hire-row-card" key={job.id}>
                                                <div className="worker-identity">
                                                    <div className="card-icon-box" style={{ background: '#EAE3DA', color: '#8C8177' }}><FaBriefcase /></div>
                                                    <div className="worker-details">
                                                        <h4>{job.title}</h4>
                                                        <span>Location: {job.location}</span>
                                                    </div>
                                                </div>
                                                <div className="worker-contact-info" style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                                    ₹{job.wage} / day
                                                </div>
                                                <div className="worker-contact-info" style={{ marginRight: 0 }}>
                                                    {job.isUrgent && <span style={{ background: '#E6DCCD', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>Urgent</span>}
                                                </div>
                                                <button className="view-btn" style={{ backgroundColor: '#5d7e85' }}>Apply</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <aside className="right-dashboard-sidebar">
                                {/* My Recent Jobs */}
                                <div className="compact-hires-section">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-text)' }}>My Recent Jobs</h3>
                                    </div>
                                    <div className="compact-hires-list">
                                        {myRecentJobs.length === 0 ? (
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>No completed jobs yet.</div>
                                        ) : (
                                            myRecentJobs.map(app => (
                                                <div className="compact-hire-card" key={app.id}>
                                                    <div className="compact-card-header">
                                                        <div className="card-icon-box" style={{ width: '40px', height: '40px' }}><FaBriefcase /></div>
                                                        <div className="compact-info">
                                                            <h4>{app.jobTitle || app.job?.title || "Job"}</h4>
                                                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>Completed</span>
                                                        </div>
                                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>₹{app.job?.wage}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <button
                                            className="view-all-button"
                                            onClick={() => setActiveView('myjobs')}
                                        >
                                            View All {'>'}
                                        </button>
                                    </div>
                                </div>

                                {/* Worker Reviews */}
                                <div className="compact-hires-section">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-text)' }}>Worker Reviews</h3>
                                    </div>

                                    <div className="compact-hires-list">


                                        {recentReviews.length === 0 ? (
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>No reviews yet.</div>
                                        ) : (
                                            recentReviews.map(review => (
                                                <div className="compact-hire-card" key={review.id}>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <div className="circle-avatar" style={{ width: 30, height: 30, background: '#eee', borderRadius: '50%' }}></div>
                                                        <div className="compact-info">
                                                            <div className="worker-stars" style={{ fontSize: '0.8rem' }}>
                                                                {[...Array(review.rating)].map((_, i) => <FaStar key={i} color="#F4B400" />)}
                                                            </div>
                                                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--primary-text)' }}>"{review.comment}"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <button
                                            className="view-all-button"
                                            onClick={() => setActiveView('reviews')}
                                        >
                                            View All {'>'}
                                        </button>
                                    </div>
                                </div>

                            </aside>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default WorkerDashboard;

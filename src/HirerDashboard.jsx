import React from 'react';
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
    Settings,
    ArrowUpRight
} from 'lucide-react';

const HirerDashboard = () => {
    return (
        <div className="hirer-dashboard">

            {/* Top Header */}
            <header className="main-header">
                <div className="brand">
                    <MapPin className="brand-icon" size={28} />
                    <span>Digital Naka</span>
                </div>

                <nav className="top-nav">
                    <a href="#" className="nav-link active">
                        <LayoutDashboard size={18} /> Dashboard
                    </a>
                    <a href="#" className="nav-link">
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
                    <button className="icon-btn">
                        <Bell size={20} />
                        <span className="badge">1</span>
                    </button>
                    <div className="user-avatar-circle">AK</div>
                </div>
            </header>

            {/* Main Grid Layout */}
            <div className="dashboard-body">

                {/* Left Panel */}
                <aside className="left-panel">
                    {/* Profile Card */}
                    <div className="profile-card">
                        <div className="profile-image-wrapper">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="Amit Khanna"
                                className="profile-img"
                            />
                        </div>
                        <div className="profile-details">
                            <h2>Amit Khanna</h2>
                            <div className="role">Employer</div>
                            <div className="phone">+91 9876543210</div>
                        </div>
                    </div>

                    {/* Left Menu (Duplicative visually but part of the design) */}
                    <nav className="left-menu">
                        <a href="#" className="menu-item active">
                            <LayoutDashboard size={18} /> Dashboard
                        </a>
                        <a href="#" className="menu-item">
                            <Briefcase size={18} /> Post Job
                        </a>
                        <a href="#" className="menu-item">
                            <Users size={18} /> Find Workers
                        </a>
                        <a href="#" className="menu-item">
                            <MessageSquare size={18} /> Messages
                        </a>
                        <a href="#" className="menu-item">
                            <FileText size={18} /> Reports
                        </a>
                    </nav>

                    {/* Stats & Actions */}
                    <div className="sidebar-stats-card">
                        <div className="sidebar-stat-label">Total Workers Available</div>
                        <div className="sidebar-stat-number">1,245 <span className="sidebar-stat-trend">▼1</span></div>
                        <div className="sidebar-stat-2"><span className="highlight-stat">78</span> Recent Hires Today</div>
                    </div>

                    <button className="sidebar-action-btn">Find Workers</button>

                    <div className="verification-list">
                        <div className="verify-item">
                            <CheckCircle size={16} className="verify-icon" /> Aadhaar / Phone verified workers
                        </div>
                        <div className="verify-item">
                            <CheckCircle size={16} className="verify-icon" /> Rated by past contractors
                        </div>
                        <div className="verify-item">
                            <CheckCircle size={16} className="verify-icon" /> Location-based hiring
                        </div>
                    </div>

                    <div className="lang-selector">
                        <span style={{ fontSize: '1.2rem' }}>🇺🇸</span> English ▼
                    </div>
                </aside>

                {/* Right Content Area (Center + Right Panel) */}
                <main className="main-content-area">
                    {/* CENTER COLUMN */}
                    <div className="dashboard-center-col">
                        <div className="welcome-section">
                            <h1>Hirer Dashboard</h1>
                            <p>Welcome, <strong>Amit Khanna!</strong> Find & hire daily-wage workers instantly.</p>
                        </div>

                        {/* Stats Overview */}
                        <div className="stats-overview">
                            <div className="info-card">
                                <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                                    <Briefcase size={24} />
                                </div>
                                <div className="card-text-content">
                                    <div className="card-title">Ongoing Jobs</div>
                                    <div className="card-value">5</div>
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
                                <button className="post-job-small-btn"><Plus size={16} /> Post Job</button>
                            </div>
                        </div>

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
                                <div className="real-map-box">
                                    {/* Map Placeholder Image */}
                                    <img src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/73.8567,18.5204,12,0/800x400?access_token=YOUR_ACCESS_TOKEN" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.3) opacity(0.5)' }} alt="Map" />

                                    <div className="map-controls-overlay">
                                        <button className="map-ctrl-btn">+</button>
                                        <div style={{ height: '1px', background: '#eee' }}></div>
                                        <button className="map-ctrl-btn">-</button>
                                    </div>

                                    <div className="map-legend">
                                        <span style={{ display: 'flex', alignItems: 'center' }}><span className="legend-dot" style={{ background: '#A5D6A7' }}></span> Low</span>
                                        <span style={{ display: 'flex', alignItems: 'center' }}><span className="legend-dot" style={{ background: '#FFE082' }}></span> Medium</span>
                                        <span style={{ display: 'flex', alignItems: 'center' }}><span className="legend-dot" style={{ background: '#EF9A9A' }}></span> High</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Recent Hires Wide List */}
                        <div className="recent-hires-container">
                            <div className="section-heading-row">Recent Hires</div>
                            <div className="hires-grid">
                                <div className="hire-row-card">
                                    <div className="worker-identity">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" className="worker-pic" alt="" />
                                        <div className="worker-details">
                                            <h4>Ramesh Yadav</h4>
                                            <span>Construction Labor</span>
                                        </div>
                                    </div>
                                    <div className="worker-stars">★★★★☆ 4.5</div>
                                    <div className="worker-contact-info">
                                        <div>+91 9067 65***</div>
                                        <div><MapPin size={12} /> Hinjawadi</div>
                                    </div>
                                    <button className="view-btn orange">View Profile</button>
                                </div>

                                <div className="hire-row-card">
                                    <div className="worker-identity">
                                        <img src="https://randomuser.me/api/portraits/men/45.jpg" className="worker-pic" alt="" />
                                        <div className="worker-details">
                                            <h4>Suresh Kumar</h4>
                                            <span>Plumber</span>
                                        </div>
                                    </div>
                                    <div className="worker-stars">★★★★★ 5</div>
                                    <div className="worker-contact-info">
                                        <div>+91 9125 45***</div>
                                        <div><MapPin size={12} /> Wakad</div>
                                    </div>
                                    <button className="view-btn orange">View Profile</button>
                                </div>

                                <div className="hire-row-card">
                                    <div className="worker-identity">
                                        <img src="https://randomuser.me/api/portraits/men/62.jpg" className="worker-pic" alt="" />
                                        <div className="worker-details">
                                            <h4>Mohan Das</h4>
                                            <span>Electrician</span>
                                        </div>
                                    </div>
                                    <div className="worker-stars">★★★★☆ 4.8</div>
                                    <div className="worker-contact-info">
                                        <div>+91 9845 32***</div>
                                        <div><MapPin size={12} /> Shivajinagar</div>
                                    </div>
                                    <button className="view-btn orange">View Profile</button>
                                </div>

                                <div className="hire-row-card">
                                    <div className="worker-identity">
                                        <img src="https://randomuser.me/api/portraits/men/11.jpg" className="worker-pic" alt="" />
                                        <div className="worker-details">
                                            <h4>Vinod Patel</h4>
                                            <span>Mason</span>
                                        </div>
                                    </div>
                                    <div className="worker-stars">★★★★☆ 4.5</div>
                                    <div className="worker-contact-info">
                                        <div>+91 9876 54***</div>
                                        <div><MapPin size={12} /> Baner</div>
                                    </div>
                                    <button className="view-btn orange">View Profile</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Compact Recent Hires */}
                    <aside className="right-dashboard-sidebar">
                        <div className="compact-hires-section">
                            <div className="section-heading-row">Recent Hires</div>

                            <div className="compact-hires-list">
                                {/* Card 1 */}
                                <div className="compact-hire-card">
                                    <div className="compact-card-header">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" className="compact-pic" alt="Ramesh" />
                                        <div className="compact-info">
                                            <h4>Ramesh Yadav</h4>
                                            <div className="compact-role">Electrician <span className="gold-txt">★</span></div>
                                            <div className="compact-phone">+91 9067 65****</div>
                                        </div>
                                        <button className="compact-view-btn">View Profile</button>
                                    </div>
                                    <div className="compact-card-footer">
                                        <span className="dot-action">● Contact</span>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="compact-hire-card">
                                    <div className="compact-card-header">
                                        <img src="https://randomuser.me/api/portraits/men/45.jpg" className="compact-pic" alt="Suresh" />
                                        <div className="compact-info">
                                            <h4>Suresh Kumar</h4>
                                            <div className="compact-role">Plumber <span className="gold-txt">★</span></div>
                                            <div className="compact-phone">+91 9125 45****</div>
                                        </div>
                                        <button className="compact-view-btn">View Profile</button>
                                    </div>
                                    <div className="compact-card-footer">
                                        <span className="dot-action">● Contact</span>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="compact-hire-card">
                                    <div className="compact-card-header">
                                        <img src="https://randomuser.me/api/portraits/men/62.jpg" className="compact-pic" alt="Mohan" />
                                        <div className="compact-info">
                                            <h4>Mohan Das</h4>
                                            <div className="compact-role">Electrician <span className="gold-txt">★</span></div>
                                            <div className="compact-phone">+91 9665 32****</div>
                                        </div>

                                        <button className="compact-view-btn">View Profile</button>
                                    </div>
                                    <div className="compact-card-footer">
                                        <span className="dot-action">● Contact</span>
                                    </div>
                                </div>

                                {/* Card 4 */}
                                <div className="compact-hire-card">
                                    <div className="compact-card-header">
                                        <img src="https://randomuser.me/api/portraits/men/11.jpg" className="compact-pic" alt="Vinod" />
                                        <div className="compact-info">
                                            <h4>Vinod Patel</h4>
                                            <div className="compact-role">Painter <span className="gold-txt">★</span></div>
                                            <div className="compact-phone">+91 9876 54****</div>
                                        </div>
                                        <button className="compact-view-btn">View Profile</button>
                                    </div>
                                    <div className="compact-card-footer">
                                        <span className="dot-action">● Contact</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="lang-selector-right">
                            <span style={{ fontSize: '1.2rem' }}>🌺</span> English ▼ &nbsp; <span className="lang-text">Language</span>
                        </div>

                    </aside>

                </main>
            </div>

        </div>
    );
};

export default HirerDashboard;

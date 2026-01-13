import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';
import PostJobModal from './components/PostJobModal';
import {
    Briefcase,
    Users,
    Bell,
    Search,
    Plus,
    Star,
    RefreshCw,
    Settings
} from 'lucide-react';
import './HirerDashboard.css';
import WorkerHeatmap from './WorkerHeatmap';

const HirerDashboardHome = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const [stats, setStats] = useState({
        ongoing: 0,
        applicants: 0 // Placeholder
    });

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


    return (
        <div className="home-dashboard-content">
            <div className="welcome-section">
                <h1>Hirer Dashboard</h1>
                <p>Welcome, <strong>{currentUser?.displayName || "Hirer"}!</strong> Find & hire daily-wage workers instantly.</p>
            </div>

            {/* Stats Overview Grid */}
            <div className="dashboard-stats-grid">
                {/* 1. Ongoing Jobs */}
                <div
                    className="info-card summary-card"
                >
                    <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                        <Briefcase size={24} />
                    </div>
                    <div className="card-text-content">
                        <div className="card-title">Ongoing Jobs</div>
                        <div className="card-value">{stats.ongoing}</div>
                    </div>
                </div>

                {/* 2. Applicants */}
                <div
                    className="info-card clickable summary-card"
                    onClick={() => navigate('/hire-dashboard/find-workers')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && navigate('/hire-dashboard/find-workers')}
                >
                    <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                        <Users size={24} />
                    </div>
                    <div className="card-text-content">
                        <div className="card-title">Applicants</div>
                        <div className="card-value">23 <span>New</span></div>
                    </div>
                </div>

                {/* 3. Shortlisted */}
                <div
                    className="info-card clickable summary-card"
                    onClick={() => navigate('/hire-dashboard/shortlisted-workers')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && navigate('/hire-dashboard/shortlisted-workers')}
                >
                    <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                        <Star size={24} />
                    </div>
                    <div className="card-text-content">
                        <div className="card-title">Shortlisted Workers</div>
                        <div className="card-value">7</div>
                    </div>
                </div>

                {/* 4. Notifications (Standalone) */}
                <div
                    className="info-card clickable summary-card"
                    onClick={() => navigate('/hire-dashboard/notifications')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && navigate('/hire-dashboard/notifications')}
                >
                    <div className="card-icon-box" style={{ background: '#F8E8D8', color: '#D98347' }}>
                        <Bell size={24} />
                    </div>
                    <div className="card-text-content">
                        <div className="card-title">Notifications</div>
                        <div className="card-value">1 <span>New</span></div>
                    </div>
                </div>



                {/* 5. Post Job Card (Standard Size) */}
                <div
                    className="info-card clickable summary-card post-job-card"
                    onClick={() => navigate('/hire-dashboard/post-job')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && navigate('/hire-dashboard/post-job')}
                >
                    <div className="card-icon-box" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                        <Plus size={24} />
                    </div>
                    <div className="card-text-content">
                        <div className="card-title" style={{ color: 'white', fontSize: '1.1rem', marginBottom: 0 }}>Post a Job</div>
                    </div>
                </div>
            </div>

            <PostJobModal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} />

            {/* Map & Side Panel */}
            <div className="middle-grid">
                {/* Worker Availability Heatmap */}
                <div className="map-section-container" style={{ width: '100%' }}>
                    <div className="section-header">
                        <div className="section-title">
                            <Search size={18} /> Worker Availability Heatmap
                        </div>
                        <div className="section-actions">
                            <RefreshCw size={16} className="action-icon" />
                            <Settings size={16} className="action-icon" />
                        </div>
                    </div>

                    <div className="map-wrapper" style={{ height: '500px', border: 'none' }}>
                        <WorkerHeatmap />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default HirerDashboardHome;

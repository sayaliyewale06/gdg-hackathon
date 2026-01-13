import React, { useState, useEffect } from 'react';
import './WorkerDashboard.css'; // Reuse valid styles
import { FaBriefcase, FaRupeeSign, FaCalendarAlt, FaStar, FaDownload } from 'react-icons/fa';
import { DB } from './lib/db';
import { useAuth } from './context/AuthContext';

const WorkerEarnings = () => {
    const { currentUser } = useAuth();
    const [earningsData, setEarningsData] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        weekly: 0,
        jobsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            if (currentUser?.uid) {
                try {
                    // Fetch completed applications (which represent earnings)
                    const myApplications = await DB.applications.getByWorker(currentUser.uid);

                    // Filter for completed/accepted jobs (assuming these are paid)
                    // For this MVP, let's treat 'completed' as earned
                    const completedApps = myApplications.filter(app => app.status === 'completed');

                    // Need to fetch job details to get the wage
                    const jobsPromises = completedApps.map(async (app) => {
                        const job = await DB.jobs.get(app.jobId);
                        return {
                            ...app, // app has createdAt
                            wage: job?.wage || 0,
                            jobTitle: job?.title || 'Unknown Job',
                            location: job?.location || 'Unknown',
                            hirerName: job?.hirerName || 'Unknown Employer',
                            hirerPic: job?.hirerPic,
                            hirerRating: job?.hirerRating || 0
                        };
                    });

                    const earningsHistory = await Promise.all(jobsPromises);

                    // Sort by newest
                    const sortedHistory = earningsHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setEarningsData(sortedHistory);

                    // Calculate Stats
                    const total = sortedHistory.reduce((acc, curr) => acc + (parseInt(curr.wage) || 0), 0);

                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    const weekly = sortedHistory
                        .filter(item => new Date(item.createdAt) >= oneWeekAgo)
                        .reduce((acc, curr) => acc + (parseInt(curr.wage) || 0), 0);

                    setStats({
                        total,
                        weekly,
                        jobsCount: sortedHistory.length
                    });

                } catch (error) {
                    console.error("Error fetching earnings:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchEarnings();
    }, [currentUser]);
    return (
        <div className="earnings-container">
            <div className="section-heading-row" style={{ marginBottom: '0' }}>
                <h1>Earnings</h1>
            </div>

            {/* Overview & Chart Grid */}
            <div className="earnings-overview-grid">
                {/* 3 Summary Cards */}
                <div className="earnings-cards-group">
                    <div className="earnings-card-large" style={{ gridColumn: 'span 1', background: '#EAE3DA' }}>
                        <FaBriefcase className="ec-icon" />
                        <div className="ec-amount">₹{stats.total.toLocaleString()}</div>
                        <div className="ec-label">Total Earnings</div>
                    </div>
                    <div className="earnings-card-small" style={{ background: '#F8F5F2' }}>
                        <FaRupeeSign className="ec-icon" style={{ color: '#5D7E85' }} />
                        <div className="ec-amount" style={{ fontSize: '1.4rem' }}>₹{stats.weekly.toLocaleString()}</div>
                        <div className="ec-label">This Week</div>
                    </div>
                    <div className="earnings-card-small" style={{ gridColumn: 'span 2', background: '#F8F5F2' }}>
                        <FaBriefcase className="ec-icon" style={{ color: '#5D7E85' }} />
                        <div className="ec-amount">{stats.jobsCount}</div>
                        <div className="ec-label">Completed Jobs</div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="earnings-chart-container">
                    <div className="chart-header">
                        <h3 style={{ margin: 0, color: 'var(--primary-text)' }}>Earnings Chart</h3>
                        <div className="filter-select" style={{ fontSize: '0.8rem' }}>Last 4 Weeks ▼</div>
                    </div>

                    {/* Visual Placeholder for Chart Line */}
                    <div className="chart-visual-placeholder">
                        <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
                            <path d="M0,120 Q50,100 100,80 T200,90 T300,50 T400,30"
                                fill="none" stroke="#5D7E85" strokeWidth="3" />
                            <circle cx="0" cy="120" r="4" fill="#5D7E85" />
                            <circle cx="100" cy="80" r="4" fill="#5D7E85" />
                            <circle cx="200" cy="90" r="4" fill="#5D7E85" />
                            <circle cx="300" cy="50" r="4" fill="#5D7E85" />
                            <circle cx="400" cy="30" r="4" fill="#5D7E85" />
                            {/* Area fill */}
                            <path d="M0,120 Q50,100 100,80 T200,90 T300,50 T400,30 V150 H0 Z"
                                fill="rgba(93, 126, 133, 0.1)" stroke="none" />
                        </svg>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                        <span>Week 5</span>
                    </div>
                </div>
            </div>

            {/* Earnings History */}
            <div className="earnings-history-section">
                <div className="history-filter-bar">
                    <span style={{ fontWeight: '600', marginRight: 'auto', fontSize: '1.1rem' }}>Earnings History</span>
                    <select className="filter-select"><option>This Month</option></select>
                    <select className="filter-select"><option>₹65000 - ₹70000</option></select>
                    <select className="filter-select"><option>Apr 2024</option></select>
                    <button className="export-btn">Export</button>
                </div>

                <div className="earnings-table">
                    {/* Header Row */}
                    <div className="et-row et-header">
                        <div>Date</div>
                        <div>Job</div>
                        <div>Earnings</div>
                        <div>Employer</div>
                        <div style={{ justifySelf: 'end' }}>Status</div>
                    </div>

                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading earnings...</div>
                    ) : earningsData.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No earnings history yet.</div>
                    ) : (
                        earningsData.map((item) => (
                            <div className="et-row" key={item.id}>
                                <div className="et-date">
                                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="et-job">
                                    <div className="et-job-icon"><FaBriefcase /></div>
                                    <div className="et-job-details">
                                        <h4>{item.jobTitle}</h4>
                                        <span>{item.location}</span>
                                    </div>
                                </div>
                                <div className="et-amount">₹{item.wage}</div>
                                <div className="et-employer">
                                    <img src={item.hirerPic || "https://randomuser.me/api/portraits/men/32.jpg"} alt={item.hirerName} />
                                    <div className="et-employer-info">
                                        <h5>{item.hirerName}</h5>
                                        <div className="worker-stars" style={{ fontSize: '0.7rem' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    color={i < (item.hirerRating || 0) ? "#F4B400" : "#E0E0E0"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="et-applied-tag" style={{ background: '#e6fffa', color: '#047857' }}>Completed</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerEarnings;

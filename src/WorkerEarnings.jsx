import React from 'react';
import './WorkerDashboard.css'; // Reuse valid styles
import { FaBriefcase, FaRupeeSign, FaCalendarAlt, FaStar, FaDownload } from 'react-icons/fa';

const WorkerEarnings = () => {
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
                        <div className="ec-amount">₹65,700</div>
                        <div className="ec-label">Total Earnings</div>
                    </div>
                    <div className="earnings-card-small" style={{ background: '#F8F5F2' }}>
                        <FaRupeeSign className="ec-icon" style={{ color: '#5D7E85' }} />
                        <div className="ec-amount" style={{ fontSize: '1.4rem' }}>₹12,500</div>
                        <div className="ec-label">This Week</div>
                    </div>
                    <div className="earnings-card-small" style={{ gridColumn: 'span 2', background: '#F8F5F2' }}>
                        <FaBriefcase className="ec-icon" style={{ color: '#5D7E85' }} />
                        <div className="ec-amount">162</div>
                        <div className="ec-label">Total Jobs</div>
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

                    {/* Row 1 */}
                    <div className="et-row">
                        <div className="et-date">April 28</div>
                        <div className="et-job">
                            <div className="et-job-icon"><FaBriefcase /></div>
                            <div className="et-job-details">
                                <h4>Packing Help</h4>
                                <span>Baner</span>
                            </div>
                        </div>
                        <div className="et-amount">₹700</div>
                        <div className="et-employer">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Vikram" />
                            <div className="et-employer-info">
                                <h5>Vikram Singh</h5>
                                <div className="worker-stars" style={{ fontSize: '0.7rem' }}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /> <span style={{ color: '#888', fontWeight: '400' }}>95 Reviews</span>
                                </div>
                            </div>
                        </div>
                        <div className="et-applied-tag">Applied</div>
                    </div>

                    {/* Row 2 */}
                    <div className="et-row">
                        <div className="et-date">April 27</div>
                        <div className="et-job">
                            <div className="et-job-icon"><FaBriefcase /></div>
                            <div className="et-job-details">
                                <h4>Masonry Work</h4>
                                <span>Hinjewadi</span>
                            </div>
                        </div>
                        <div className="et-amount">₹950</div>
                        <div className="et-employer">
                            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Rahul" />
                            <div className="et-employer-info">
                                <h5>Rahul Agrawal</h5>
                                <div className="worker-stars" style={{ fontSize: '0.7rem' }}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /> <span style={{ color: '#888', fontWeight: '400' }}>125 Reviews</span>
                                </div>
                            </div>
                        </div>
                        <div className="et-applied-tag">Applied</div>
                    </div>

                    {/* Row 3 */}
                    <div className="et-row">
                        <div className="et-date">April 26</div>
                        <div className="et-job">
                            <div className="et-job-icon"><FaBriefcase /></div>
                            <div className="et-job-details">
                                <h4>Driving Job</h4>
                                <span>Shivajinagar</span>
                            </div>
                        </div>
                        <div className="et-amount">₹800</div>
                        <div className="et-employer">
                            <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Vishal" />
                            <div className="et-employer-info">
                                <h5>Vishal More</h5>
                                <div className="worker-stars" style={{ fontSize: '0.7rem' }}>
                                    <FaStar /><FaStar /><FaStar /> <span style={{ color: '#888', fontWeight: '400' }}>53 Reviews</span>
                                </div>
                            </div>
                        </div>
                        <div className="et-applied-tag">Applied</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerEarnings;

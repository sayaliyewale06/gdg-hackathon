import React from 'react';
import './WorkerDashboard.css';
import { FaCheckCircle, FaQrcode, FaDownload, FaBriefcase, FaRupeeSign, FaTools, FaMapMarkerAlt, FaStar, FaEye } from 'react-icons/fa';

const WorkerQRCode = () => {
    return (
        <div className="earnings-container">
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>My QR Code</h5>
                </div>
            </div>
            <div className="section-heading-row" style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0 }}>Rajesh Kumar</h1>
            </div>

            <div className="qr-dashboard-grid">
                {/* Left Column: QR Profile Card */}
                <div className="qr-profile-card">
                    <div className="qr-profile-header">
                        <div className="qr-avatar-wrapper">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s" alt="Rajesh Kumar" className="qr-avatar" />
                        </div>
                        <div className="qr-user-details">
                            <h2>Rajesh Kumar</h2>
                            <p>Top Worker</p>
                            <p>+91 98765 43210</p>
                        </div>
                    </div>

                    <div className="qr-verifications">
                        <div className="qr-verify-item"><FaCheckCircle className="qr-check-icon" /> Profile Verified</div>
                        <div className="qr-verify-item"><FaCheckCircle className="qr-check-icon" /> Location-based hiring</div>
                    </div>

                    <div className="qr-code-box">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://digitalnaka.com/worker/rajesh-kumar" alt="Worker QR Code" className="main-qr-img" />
                        <p className="qr-scan-text">Scan this unique QR code to view my resume.</p>

                        <div className="qr-action-buttons">
                            <button className="qr-btn primary">
                                <FaQrcode style={{ marginRight: '8px' }} /> Scan QR Code
                            </button>
                            <button className="qr-btn secondary">
                                <FaDownload style={{ marginRight: '8px' }} /> Download QR Code
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Resume & Reviews */}
                <div className="qr-right-col">
                    {/* Resume Card */}
                    <div className="qr-info-card">
                        <h3 className="qr-card-title">Rajesh's Resume</h3>

                        <div className="resume-list">
                            <div className="resume-item">
                                <FaBriefcase className="resume-icon" /> <span>5+ Years working in daily wage jobs</span>
                            </div>
                            <div className="resume-item">
                                <FaRupeeSign className="resume-icon" /> <span><strong>₹65,700</strong> total Earned</span>
                            </div>
                            <div className="resume-item">
                                <FaTools className="resume-icon" /> <span>Masonry, Driving, Electrician, Helper</span>
                            </div>
                            <div className="resume-item">
                                <FaMapMarkerAlt className="resume-icon" /> <span>Pune, Maharashtra</span>
                            </div>
                        </div>

                        <div className="resume-footer">
                            <div className="resume-rating">
                                <div className="worker-stars">
                                    <FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" style={{ opacity: 0.5 }} />
                                </div>
                                <span style={{ fontWeight: '700', marginLeft: '8px' }}>4.8</span>
                                <span style={{ color: '#777', fontSize: '0.9rem', marginLeft: '4px' }}>(162 Reviews)</span>
                            </div>
                            <button className="view-resume-btn">View Resume</button>
                        </div>
                    </div>

                    {/* Recent Reviews Mini Widget */}
                    <div className="qr-info-card">
                        <h3 className="qr-card-title">Recent Reviews</h3>
                        <div className="mini-reviews-list">
                            <div className="mini-review-item">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="mini-review-pic" />
                                <div>
                                    <p className="mini-review-text"><strong>Anita Sharma</strong>, Great work, very reliable!</p>
                                    <div className="worker-stars sm-stars">
                                        <FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" />
                                        <span className="mini-time">2 days ago</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mini-review-item">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="mini-review-pic" />
                                <div>
                                    <p className="mini-review-text"><strong>Vikram Singh</strong>, Punctual and skilled</p>
                                    <div className="worker-stars sm-stars">
                                        <FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" /><FaStar color="#F4B400" />
                                        <span className="mini-time">3 days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '12px' }}>
                            <button className="view-more-sm-btn">View More</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerQRCode;

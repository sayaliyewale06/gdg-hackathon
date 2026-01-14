import React, { useState, useEffect, useRef } from 'react';
import './WorkerDashboard.css';
import { DB } from './lib/db';
import { useAuth } from './context/AuthContext';
import { FaCheckCircle, FaQrcode, FaDownload, FaBriefcase, FaRupeeSign, FaTools, FaMapMarkerAlt, FaStar, FaEye, FaUserCircle, FaCopy } from 'react-icons/fa';
import { QRCodeCanvas } from "qrcode.react";
import { toast } from 'react-hot-toast';

const WorkerQRCode = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [stats, setStats] = useState({ earnings: 0, reviewsCount: 0, rating: 0 });
    const [reviews, setReviews] = useState([]);
    const [skills, setSkills] = useState("General Worker");

    // Ref for QR Code wrapper to handle download
    const qrWrapRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser?.uid) {
                try {
                    const [userDoc, myReviews, myApplications, allJobs] = await Promise.all([
                        DB.users.get(currentUser.uid),
                        DB.reviews.getByTargetUser(currentUser.uid),
                        DB.applications.getByWorker(currentUser.uid),
                        DB.jobs.getAll()
                    ]);

                    if (userDoc) {
                        setUserProfile(userDoc);
                        if (userDoc.skills && userDoc.skills.length > 0) {
                            setSkills(userDoc.skills.join(", "));
                        }
                    }

                    // Calculate Earnings
                    const jobsMap = new Map(allJobs.map(j => [j.id, j]));
                    const completedApps = myApplications.filter(a => a.status === 'completed');
                    let totalEarnings = 0;
                    completedApps.forEach(app => {
                        const job = jobsMap.get(app.jobId);
                        if (job) totalEarnings += Number(job.wage);
                    });

                    // Reviews Stats
                    const avgRating = myReviews.length > 0
                        ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1)
                        : 0;

                    setStats({
                        earnings: totalEarnings,
                        reviewsCount: myReviews.length,
                        rating: avgRating
                    });

                    setReviews(myReviews.slice(0, 2));

                } catch (error) {
                    console.error("Error fetching QR data:", error);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    const profileUrl = currentUser ? `${window.location.origin}/worker-profile/${currentUser.uid}` : "";

    const downloadQR = () => {
        const canvas = qrWrapRef.current?.querySelector("canvas");
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `worker-profile-qr-${currentUser?.uid || "user"}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            toast.success("Profile link copied!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="earnings-container">
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>My QR Code</h5>
                </div>
            </div>
            <div className="section-heading-row" style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0 }}>{currentUser?.displayName || "Worker Name"}</h1>
            </div>

            <div className="qr-dashboard-grid">
                {/* Left Column: QR Profile Card */}
                <div className="qr-profile-card">
                    <div className="qr-profile-header">
                        <div className="qr-avatar-wrapper">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Avatar" className="qr-avatar" />
                            ) : (
                                <FaUserCircle className="qr-avatar" style={{ color: '#ccc', background: 'white' }} />
                            )}
                        </div>
                        <div className="qr-user-details">
                            <h2>{currentUser?.displayName || "Worker Name"}</h2>
                            <p>{userProfile?.role === 'worker' ? 'Verified Worker' : (userProfile?.role || "Worker")}</p>
                            <p>{userProfile?.phone || currentUser?.email || "No Contact Info"}</p>
                        </div>
                    </div>

                    <div className="qr-verifications">
                        <div className={`qr-verify-item ${userProfile?.verified?.profile ? 'verified' : ''}`}>
                            <FaCheckCircle className="qr-check-icon" color={userProfile?.uid ? "#4CAF50" : "#ccc"} />
                            Profile Verified
                        </div>
                        <div className={`qr-verify-item ${userProfile?.location ? 'verified' : ''}`}>
                            <FaCheckCircle className="qr-check-icon" color={userProfile?.location ? "#4CAF50" : "#ccc"} />
                            Location-based hiring
                        </div>
                    </div>

                    <div className="qr-code-box" ref={qrWrapRef}>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <QRCodeCanvas
                                value={profileUrl}
                                size={220}
                                level="M"
                                includeMargin={true}
                            />
                        </div>
                        <p className="qr-scan-text">Scan to view my resume</p>
                        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px', wordBreak: 'break-all' }}>{profileUrl}</p>

                        <div className="qr-action-buttons">
                            <button className="qr-btn primary" onClick={copyLink}>
                                <FaCopy style={{ marginRight: '8px' }} /> Copy Link
                            </button>
                            <button className="qr-btn secondary" onClick={downloadQR}>
                                <FaDownload style={{ marginRight: '8px' }} /> Download QR
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Resume & Reviews */}
                <div className="qr-right-col">
                    {/* Resume Card */}
                    <div className="qr-info-card">
                        <h3 className="qr-card-title">My Resume Stats</h3>

                        <div className="resume-list">
                            <div className="resume-item">
                                <FaBriefcase className="resume-icon" />
                                <span>{userProfile?.experience || "Experience not added"}</span>
                            </div>
                            <div className="resume-item">
                                <FaRupeeSign className="resume-icon" />
                                <span><strong>₹{stats.earnings}</strong> Total Earned</span>
                            </div>
                            <div className="resume-item">
                                <FaTools className="resume-icon" />
                                <span>{skills || "No skills listed"}</span>
                            </div>
                            <div className="resume-item">
                                <FaMapMarkerAlt className="resume-icon" />
                                <span>{userProfile?.location || "Location not set"}</span>
                            </div>
                        </div>

                        <div className="resume-footer">
                            <div className="resume-rating">
                                <div className="worker-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < Math.round(Number(stats.rating)) ? "#F4B400" : "#ccc"} />
                                    ))}
                                </div>
                                <span style={{ fontWeight: '700', marginLeft: '8px' }}>{stats.rating}</span>
                                <span style={{ color: '#777', fontSize: '0.9rem', marginLeft: '4px' }}>({stats.reviewsCount} Reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reviews Mini Widget */}
                    <div className="qr-info-card">
                        <h3 className="qr-card-title">Recent Reviews</h3>
                        <div className="mini-reviews-list">
                            {reviews.length === 0 ? (
                                <div style={{ color: '#888', fontStyle: 'italic', padding: '10px 0' }}>No reviews yet.</div>
                            ) : (
                                reviews.map((rev, idx) => (
                                    <div className="mini-review-item" key={idx}>
                                        <div className="mini-review-pic-wrapper">
                                            {/* Placeholder for reviewer - ideally fetch reviewer details or store in review */}
                                            <FaUserCircle size={32} color="#ddd" />
                                        </div>
                                        <div>
                                            <p className="mini-review-text"><strong>{rev.reviewerName || "Employer"}</strong>: "{rev.comment}"</p>
                                            <div className="worker-stars sm-stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} color={i < Math.floor(rev.rating) ? "#F4B400" : "#ccc"} />
                                                ))}
                                                <span className="mini-time">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerQRCode;

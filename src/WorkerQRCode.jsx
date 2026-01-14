import React, { useState, useEffect } from 'react';
import './WorkerDashboard.css';
import { DB } from './lib/db';
import { useAuth } from './context/AuthContext';
import { FaCheckCircle, FaQrcode, FaDownload, FaBriefcase, FaRupeeSign, FaTools, FaMapMarkerAlt, FaStar, FaEye, FaUserCircle } from 'react-icons/fa';
import QRCode from "react-qr-code";

const WorkerQRCode = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [stats, setStats] = useState({ earnings: 0, reviewsCount: 0, rating: 0 });
    const [reviews, setReviews] = useState([]);
    const [skills, setSkills] = useState("General Worker");

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
        const svg = document.getElementById("worker-qr-code");
        if (!svg) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const data = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        // Create a Blob from the SVG data
        const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            // Set canvas size (add padding)
            canvas.width = 250;
            canvas.height = 250;

            // Draw white background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the image
            // Note: SVG viewBox might need handling if simple drawImage is off, but typically works for simple QRs
            ctx.drawImage(img, 0, 0, 250, 250);

            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "worker-profile-qr.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        };
        img.src = url;
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
                            <img src={currentUser?.photoURL || "https://randomuser.me/api/portraits/men/99.jpg"} alt="Avatar" className="qr-avatar" />
                        </div>
                        <div className="qr-user-details">
                            <h2>{currentUser?.displayName || "Worker Name"}</h2>
                            <p>{userProfile?.status || "Verified Worker"}</p>
                            <p>{userProfile?.phone || currentUser?.email || "+91 XXXXX XXXXX"}</p>
                        </div>
                    </div>

                    <div className="qr-verifications">
                        <div className="qr-verify-item"><FaCheckCircle className="qr-check-icon" /> Profile Verified</div>
                        <div className="qr-verify-item"><FaCheckCircle className="qr-check-icon" /> Location-based hiring</div>
                    </div>

                    <div className="qr-code-box">
                        <div style={{ background: 'white', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
                            <QRCode
                                id="worker-qr-code"
                                value={profileUrl}
                                size={200}
                                level="H"
                            />
                        </div>
                        <p className="qr-scan-text">Scan this unique QR code to view my resume.</p>

                        <div className="qr-action-buttons">
                            <button className="qr-btn primary">
                                <FaQrcode style={{ marginRight: '8px' }} /> Scan QR Code
                            </button>
                            <button className="qr-btn secondary" onClick={downloadQR}>
                                <FaDownload style={{ marginRight: '8px' }} /> Download QR Code
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Resume & Reviews */}
                <div className="qr-right-col">
                    {/* Resume Card */}
                    <div className="qr-info-card">
                        <h3 className="qr-card-title">{currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Worker'}'s Resume</h3>

                        <div className="resume-list">
                            <div className="resume-item">
                                <FaBriefcase className="resume-icon" /> <span>{userProfile?.experience || "New Worker"}</span>
                            </div>
                            <div className="resume-item">
                                <FaRupeeSign className="resume-icon" /> <span><strong>₹{stats.earnings}</strong> total Earned</span>
                            </div>
                            <div className="resume-item">
                                <FaTools className="resume-icon" /> <span>{skills}</span>
                            </div>
                            <div className="resume-item">
                                <FaMapMarkerAlt className="resume-icon" /> <span>{userProfile?.location || "Pune, India"}</span>
                            </div>
                        </div>

                        <div className="resume-footer">
                            <div className="resume-rating">
                                <div className="worker-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < Math.round(stats.rating) ? "#F4B400" : "#ccc"} />
                                    ))}
                                </div>
                                <span style={{ fontWeight: '700', marginLeft: '8px' }}>{stats.rating}</span>
                                <span style={{ color: '#777', fontSize: '0.9rem', marginLeft: '4px' }}>({stats.reviewsCount} Reviews)</span>
                            </div>
                            <button className="view-resume-btn">View Resume</button>
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
                                        <img src={rev.reviewerPic || "https://randomuser.me/api/portraits/men/99.jpg"} className="mini-review-pic" alt="Reviewer" />
                                        <div>
                                            <p className="mini-review-text"><strong>{rev.reviewerName}</strong>, {rev.comment}</p>
                                            <div className="worker-stars sm-stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} color={i < Math.floor(rev.rating) ? "#F4B400" : "#ccc"} />
                                                ))}
                                                <span className="mini-time">Recent</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
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

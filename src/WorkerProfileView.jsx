import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DB } from './lib/db';
import './WorkerProfileView.css';
import { toast } from 'react-hot-toast';

const WorkerProfileView = () => {
    const { workerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [workerData, setWorkerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkerProfile();
    }, [workerId]);

    const loadWorkerProfile = async () => {
        try {
            setLoading(true);

            // 1. Fetch User Data
            const userDoc = await DB.users.get(workerId);

            if (!userDoc) {
                toast.error("Worker not found");
                return;
            }

            // 2. Fetch Reviews for this worker
            // Assuming DB.reviews.getByTargetUser(workerId) exists or similar
            let reviews = [];
            try {
                reviews = await DB.reviews.getByTargetUser(workerId);
            } catch (e) {
                console.log("No reviews or error fetching reviews", e);
            }

            // 3. Fetch Completed Jobs (Employment History)
            // Basically applications where status = COMPLETED
            let history = [];
            try {
                const apps = await DB.applications.getByWorker(workerId);
                const completedApps = apps.filter(a => a.status === 'completed');

                // Hydrate with Job details for history
                history = await Promise.all(completedApps.map(async (app) => {
                    const job = await DB.jobs.get(app.jobId);
                    return {
                        jobTitle: job?.title || 'Job',
                        location: job?.location || app.location || 'Pune', // fallback
                        amount: job?.wage || 0,
                        status: 'Completed',
                        date: new Date(app.createdAt).toLocaleDateString() // Using created date as proxy for now
                    };
                }));
            } catch (e) {
                console.log("Error fetching history", e);
            }

            setWorkerData({
                id: workerId,
                name: userDoc.displayName || 'Worker',
                role: userDoc.role || 'Verified Worker',
                profession: userDoc.profession || userDoc.role || 'Worker',
                photo: userDoc.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                phone: userDoc.phone || 'Not Shared',
                email: userDoc.email || '',
                location: userDoc.location || 'Not Specified',
                availability: userDoc.availability || 'Available',
                rating: userDoc.rating || 0, // Should be in user doc ideally
                totalReviews: reviews.length,
                experience: userDoc.experience || 'No experience info',
                about: userDoc.about || 'No description provided.',
                skills: userDoc.skills || [],
                employmentHistory: history,
                reviews: reviews.map(r => ({
                    name: r.reviewerName || 'Employer',
                    rating: r.rating,
                    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently',
                    comment: r.comment
                })),
                verified: {
                    profile: true, // Assuming if they are on platform
                    phone: !!userDoc.phone,
                    id: false, // Future feature
                    location: !!userDoc.location
                }
            });

        } catch (error) {
            console.error('Error loading worker profile:', error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = () => {
        // Navigate to messages with state to start convo
        navigate('/hire-dashboard/messages', {
            state: {
                startConversationWith: workerId,
                workerName: workerData?.name
            }
        });
    };

    const handleHire = () => {
        // Navigate to post job, maybe pre-select worker? 
        // Or if coming from "Applicants", maybe just go back to Accept?
        // For now, let's just go to Post Job
        navigate('/hire-dashboard/post-job', {
            state: {
                preSelectedWorker: {
                    id: workerId,
                    name: workerData?.name
                }
            }
        });
    };

    if (loading) {
        return <div className="loading-screen">Loading worker profile...</div>;
    }

    if (!workerData) {
        return <div style={{ padding: 40, textAlign: 'center' }}>Worker not found.</div>;
    }

    return (
        <div className="worker-profile-view-page">
            {/* Header */}
            <div className="profile-view-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Back
                </button>
                <div className="header-actions">
                    <button onClick={handleMessage} className="message-btn">
                        💬 Message
                    </button>
                    <button onClick={handleHire} className="hire-btn">
                        ✓ Hire/Offer Job
                    </button>
                </div>
            </div>

            <div className="profile-view-content">
                {/* Left Column - Worker Card */}
                <div className="worker-profile-card">
                    <div className="profile-photo">
                        <img src={workerData.photo} alt={workerData.name} />
                    </div>

                    <h2>{workerData.name}</h2>
                    <span className="role-badge">{workerData.profession}</span>

                    <div className="rating">
                        <div className="stars">
                            {'★'.repeat(Math.round(workerData.rating))}
                            {'☆'.repeat(5 - Math.round(workerData.rating))}
                        </div>
                        <span className="rating-text">
                            {workerData.rating} ({workerData.totalReviews} Reviews)
                        </span>
                    </div>

                    <div className="contact-info">
                        <div className="info-item">
                            <span className="icon">📞</span>
                            <div>
                                <span className="label">Phone</span>
                                <span className="value">{workerData.phone}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="icon">✉️</span>
                            <div>
                                <span className="label">Email</span>
                                <span className="value">{workerData.email}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="icon">📍</span>
                            <div>
                                <span className="label">Location</span>
                                <span className="value">{workerData.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="verification-status">
                        <h4>Verification Status</h4>
                        <div className="verification-badges">
                            <div className={`badge ${workerData.verified.profile ? 'verified' : ''}`}>
                                {workerData.verified.profile ? '✓' : '○'} Profile Verified
                            </div>
                            <div className={`badge ${workerData.verified.phone ? 'verified' : ''}`}>
                                {workerData.verified.phone ? '✓' : '○'} Phone Verified
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="worker-details-panel">
                    {/* About */}
                    <section className="details-section">
                        <h3>About</h3>
                        <p>{workerData.about}</p>
                    </section>

                    {/* Skills & Experience */}
                    <section className="details-section">
                        <h3>Skills & Experience</h3>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Experience:</strong> {workerData.experience}
                        </div>
                        <div className="skills-list">
                            {workerData.skills.length > 0 ? (
                                workerData.skills.map((skill, i) => (
                                    <span key={i} className="skill-tag">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span style={{ color: '#888' }}>No skills listed</span>
                            )}
                        </div>
                    </section>

                    {/* Employment History */}
                    {workerData.employmentHistory.length > 0 && (
                        <section className="details-section">
                            <h3>Employment History</h3>
                            <div className="employment-list">
                                {workerData.employmentHistory.map((job, idx) => (
                                    <div key={idx} className="employment-card">
                                        <div className="job-info">
                                            <h4>{job.jobTitle}</h4>
                                            <p>📍 {job.location}</p>
                                            <p className="job-date">{job.date}</p>
                                        </div>
                                        <div className="job-amount">
                                            <span className="amount">₹{job.amount}</span>
                                            <span className="status completed">{job.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Reviews */}
                    <section className="details-section">
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Reviews</h3>
                        </div>
                        <div className="reviews-list">
                            {workerData.reviews.length === 0 ? (
                                <p style={{ color: '#888' }}>No reviews yet.</p>
                            ) : (
                                workerData.reviews.map((review, idx) => (
                                    <div key={idx} className="review-card">
                                        <div className="review-header">
                                            <div>
                                                <h4>{review.name}</h4>
                                                <div className="stars" style={{ fontSize: '0.8rem' }}>
                                                    {'★'.repeat(review.rating)}
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>{review.date}</span>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default WorkerProfileView;
